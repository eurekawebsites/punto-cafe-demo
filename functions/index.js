"use strict";

const {getApps, initializeApp} = require("firebase-admin/app");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret, defineString} = require("firebase-functions/params");
const Stripe = require("stripe");
const {
  normalizeCheckoutInput,
  priceOrder,
  stripeLineItems,
  verifiedPaidSession
} = require("./payment-service");

if (!getApps().length) initializeApp();
const db = getFirestore();

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const publicBaseUrl = defineString("PUBLIC_BASE_URL", {default: "http://localhost:5000"});
const allowedOrigins = defineString("ALLOWED_ORIGINS", {default: "http://localhost:5000"});

function applyCors(req, res) {
  const allowed = new Set(allowedOrigins.value().split(",").map((value) => value.trim()).filter(Boolean));
  const origin = req.get("origin");
  if (origin && allowed.has(origin)) res.set("Access-Control-Allow-Origin", origin);
  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  return !origin || allowed.has(origin);
}

exports.createCheckoutSession = onRequest({secrets: [stripeSecretKey]}, async (req, res) => {
  if (!applyCors(req, res)) return res.status(403).json({error: "Origin not allowed"});
  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).json({error: "Method not allowed"});

  try {
    const input = normalizeCheckoutInput(req.body);
    const productRefs = input.items.map((item) => db.doc(`products/${item.productId}`));
    const productSnapshots = await db.getAll(...productRefs);
    const catalog = new Map(productSnapshots.map((snapshot) => [snapshot.id, snapshot.exists ? snapshot.data() : null]));
    const storeSnapshot = await db.doc("settings/store").get();
    const deliveryFeeMinor = storeSnapshot.exists ? storeSnapshot.data().deliveryFeeMinor : 0;
    const priced = priceOrder(input, catalog, deliveryFeeMinor);
    const orderRef = db.collection("orders").doc();

    await orderRef.set({
      ...input,
      ...priced,
      paymentProvider: "stripe",
      paymentStatus: "pending",
      operationalStatus: "awaiting_payment",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    const stripe = new Stripe(stripeSecretKey.value());
    const baseUrl = publicBaseUrl.value().replace(/\/$/, "");
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: stripeLineItems(priced),
      customer_email: input.customer.email,
      client_reference_id: orderRef.id,
      metadata: {orderId: orderRef.id},
      payment_intent_data: {metadata: {orderId: orderRef.id}},
      success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?checkout=cancelled`
    }, {idempotencyKey: `checkout-${orderRef.id}`});

    await orderRef.update({
      checkoutSessionId: session.id,
      updatedAt: FieldValue.serverTimestamp()
    });
    return res.status(200).json({checkoutUrl: session.url});
  } catch (error) {
    console.error("createCheckoutSession failed", error);
    return res.status(400).json({error: "No fue posible iniciar el pago"});
  }
});

exports.stripeWebhook = onRequest({secrets: [stripeSecretKey, stripeWebhookSecret]}, async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  let event;
  try {
    const stripe = new Stripe(stripeSecretKey.value());
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.get("stripe-signature"),
      stripeWebhookSecret.value()
    );
  } catch (error) {
    console.error("Invalid Stripe webhook", error);
    return res.status(400).send("Invalid signature");
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const orderRef = db.doc(`orders/${orderId}`);
      await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(orderRef);
        if (!snapshot.exists) return;
        const order = {id: snapshot.id, ...snapshot.data()};
        if (order.paymentStatus === "paid") return;
        if (!verifiedPaidSession(session, order)) {
          transaction.update(orderRef, {
            paymentStatus: "review",
            updatedAt: FieldValue.serverTimestamp()
          });
          return;
        }
        transaction.update(orderRef, {
          paymentStatus: "paid",
          operationalStatus: "confirmed",
          paymentIntentId: session.payment_intent,
          paidAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        });
      });
    }
  }

  return res.status(200).json({received: true});
});


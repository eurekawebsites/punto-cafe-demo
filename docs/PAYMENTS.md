# Punto Café Lite — online card payments

## Product promise

Online card payments are included in new Punto Café Lite implementations. The
default provider is Stripe Checkout. The client owns the Stripe merchant
account and pays Stripe's transaction fees directly. A different processor is
a separately scoped integration.

The public GitHub Pages demo never collects card numbers or performs a real
charge. It demonstrates the user experience only. A client deployment uses
Firebase Functions, Firestore, Firebase Authentication for administration, and
the client's Stripe credentials.

## Trusted payment flow

1. The browser sends product IDs, quantities, customer data, and the requested
   pickup/delivery slot to `createCheckoutSession`.
2. The server reloads active products and prices from Firestore. Browser totals
   are never trusted.
3. The server creates an order with `paymentStatus: pending` and starts a hosted
   Stripe Checkout Session.
4. Stripe collects the card data. Card numbers never pass through Punto Café.
5. `stripeWebhook` validates Stripe's signature, amount, currency, and order ID.
6. Only a verified paid event changes the order to `paymentStatus: paid` and
   `operationalStatus: confirmed`.
7. The administration view queries operational orders; abandoned or unpaid
   Checkout Sessions do not enter the preparation queue.

## Per-client setup

- Create or connect the client's Stripe account.
- Load the client's product catalog into Firestore using integer centavos in
  `priceMinor`.
- Configure `settings/store.deliveryFeeMinor`.
- Configure `PUBLIC_BASE_URL` and `ALLOWED_ORIGINS`.
- Store `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as Firebase secrets.
- Register the deployed webhook URL in Stripe.
- Test successful, declined, cancelled, duplicate, and tampered-total paths.
- Give the administrator account the custom claim `admin: true`.

## Commercial boundary

The standard integration includes one Stripe merchant account, hosted card
checkout, payment verification, paid-order status, and one production test
cycle. Processor commissions, disputes, refunds, tax/invoicing services, Uber
Direct, subscriptions, split payments, marketplace payouts, and a different
payment processor are outside the base package unless explicitly quoted.

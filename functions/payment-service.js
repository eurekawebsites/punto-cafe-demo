"use strict";

const MAX_LINE_ITEMS = 50;
const MAX_QUANTITY = 99;

function requireText(value, label, maxLength = 200) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required`);
  }
  return value.trim().slice(0, maxLength);
}

function normalizeCheckoutInput(body) {
  const input = body && typeof body === "object" ? body : {};
  if (!Array.isArray(input.items) || input.items.length < 1 || input.items.length > MAX_LINE_ITEMS) {
    throw new Error("items must contain between 1 and 50 products");
  }

  const quantities = new Map();
  for (const item of input.items) {
    const productId = requireText(item?.productId, "productId", 100);
    if (!/^[A-Za-z0-9_-]+$/.test(productId)) {
      throw new Error("productId contains unsupported characters");
    }
    const quantity = Number(item?.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      throw new Error("quantity must be an integer between 1 and 99");
    }
    const combinedQuantity = (quantities.get(productId) || 0) + quantity;
    if (combinedQuantity > MAX_QUANTITY) {
      throw new Error("combined product quantity cannot exceed 99");
    }
    quantities.set(productId, combinedQuantity);
  }

  const fulfillmentType = input.fulfillment?.type;
  if (!new Set(["pickup", "delivery"]).has(fulfillmentType)) {
    throw new Error("fulfillment.type must be pickup or delivery");
  }

  const customer = {
    name: requireText(input.customer?.name, "customer.name", 120),
    email: requireText(input.customer?.email, "customer.email", 254).toLowerCase(),
    phone: requireText(input.customer?.phone, "customer.phone", 30)
  };
  if (!customer.email.includes("@")) throw new Error("customer.email is invalid");

  const fulfillment = {
    type: fulfillmentType,
    date: requireText(input.fulfillment?.date, "fulfillment.date", 10),
    time: requireText(input.fulfillment?.time, "fulfillment.time", 40),
    address: fulfillmentType === "delivery"
      ? requireText(input.fulfillment?.address, "fulfillment.address", 400)
      : "Recoger en tienda"
  };

  return {
    customer,
    fulfillment,
    items: [...quantities].map(([productId, quantity]) => ({productId, quantity}))
  };
}

function priceOrder(input, catalogById, deliveryFeeMinor = 0) {
  const pricedItems = input.items.map(({productId, quantity}) => {
    const product = catalogById.get(productId);
    if (!product || product.active !== true || !Number.isInteger(product.priceMinor) || product.priceMinor < 1) {
      throw new Error(`product ${productId} is unavailable`);
    }
    return {
      productId,
      name: requireText(product.name, "product.name", 120),
      quantity,
      unitAmountMinor: product.priceMinor,
      subtotalMinor: product.priceMinor * quantity
    };
  });

  const delivery = input.fulfillment.type === "delivery" ? Math.max(0, Number(deliveryFeeMinor) || 0) : 0;
  const subtotalMinor = pricedItems.reduce((sum, item) => sum + item.subtotalMinor, 0);
  return {
    items: pricedItems,
    subtotalMinor,
    deliveryFeeMinor: delivery,
    totalMinor: subtotalMinor + delivery,
    currency: "mxn"
  };
}

function stripeLineItems(pricedOrder) {
  const lines = pricedOrder.items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: pricedOrder.currency,
      unit_amount: item.unitAmountMinor,
      product_data: {name: item.name}
    }
  }));
  if (pricedOrder.deliveryFeeMinor > 0) {
    lines.push({
      quantity: 1,
      price_data: {
        currency: pricedOrder.currency,
        unit_amount: pricedOrder.deliveryFeeMinor,
        product_data: {name: "Entrega"}
      }
    });
  }
  return lines;
}

function verifiedPaidSession(session, order) {
  return Boolean(
    session &&
    order &&
    session.payment_status === "paid" &&
    session.currency === order.currency &&
    session.amount_total === order.totalMinor &&
    session.metadata?.orderId === order.id
  );
}

module.exports = {
  normalizeCheckoutInput,
  priceOrder,
  stripeLineItems,
  verifiedPaidSession
};

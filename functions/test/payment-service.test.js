"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeCheckoutInput,
  priceOrder,
  stripeLineItems,
  verifiedPaidSession
} = require("../payment-service");

const input = normalizeCheckoutInput({
  customer: {name: "Ana", email: "ANA@example.com", phone: "5512345678"},
  fulfillment: {type: "delivery", date: "2026-09-20", time: "11:00–13:00", address: "Río Nazas 100"},
  items: [{productId: "croissant", quantity: 2}, {productId: "croissant", quantity: 1}]
});

test("normalizes checkout data and combines duplicate products", () => {
  assert.equal(input.customer.email, "ana@example.com");
  assert.deepEqual(input.items, [{productId: "croissant", quantity: 3}]);
});

test("rejects unsafe product IDs and excessive combined quantities", () => {
  const base = {
    customer: {name: "Ana", email: "ana@example.com", phone: "5512345678"},
    fulfillment: {type: "pickup", date: "2026-09-20", time: "11:00–13:00"}
  };
  assert.throws(
    () => normalizeCheckoutInput({...base, items: [{productId: "../settings/store", quantity: 1}]}),
    /unsupported characters/
  );
  assert.throws(
    () => normalizeCheckoutInput({...base, items: [{productId: "croissant", quantity: 60}, {productId: "croissant", quantity: 60}]}),
    /cannot exceed 99/
  );
});

test("prices only from the trusted catalog", () => {
  const priced = priceOrder(input, new Map([["croissant", {name: "Croissant", priceMinor: 6800, active: true}]]), 3500);
  assert.equal(priced.subtotalMinor, 20400);
  assert.equal(priced.totalMinor, 23900);
  assert.equal(stripeLineItems(priced).length, 2);
});

test("rejects unavailable products", () => {
  assert.throws(() => priceOrder(input, new Map(), 0), /unavailable/);
});

test("accepts only a paid session matching the server-priced order", () => {
  const order = {id: "order_1", totalMinor: 23900, currency: "mxn"};
  const session = {payment_status: "paid", amount_total: 23900, currency: "mxn", metadata: {orderId: "order_1"}};
  assert.equal(verifiedPaidSession(session, order), true);
  assert.equal(verifiedPaidSession({...session, amount_total: 1}, order), false);
  assert.equal(verifiedPaidSession({...session, payment_status: "unpaid"}, order), false);
});

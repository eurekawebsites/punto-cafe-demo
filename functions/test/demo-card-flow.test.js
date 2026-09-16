"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {JSDOM} = require("jsdom");

const html = fs.readFileSync(path.join(__dirname, "..", "..", "index.html"), "utf8");

function demo() {
  return new JSDOM(html, {
    runScripts: "dangerously",
    url: "https://demo.example.test/",
    pretendToBeVisual: true,
    beforeParse(window) {
      window.scrollTo = () => {};
      window.open = () => null;
    }
  });
}

function click(window, selector) {
  const element = window.document.querySelector(selector);
  assert.ok(element, `missing element ${selector}`);
  element.dispatchEvent(new window.MouseEvent("click", {bubbles: true}));
}

function startCardOrder(window, customerName) {
  click(window, '[data-role="customer"]');
  click(window, "[data-add-cart]");
  click(window, '[data-action="checkout"]');
  window.document.getElementById("checkoutName").value = customerName;
  window.document.getElementById("checkoutPhone").value = "5512345678";
  window.document.getElementById("checkoutEmail").value = "cliente@example.com";
  window.document.getElementById("checkoutPayment").value = "Tarjeta en línea";
  click(window, "[data-confirm-order]");
  assert.match(window.document.getElementById("modalRoot").textContent, /Pago seguro · demostración/);
}

function openAdminOrders(window) {
  click(window, '[data-action="switch"]');
  click(window, '[data-role="admin"]');
  click(window, '[data-view="orders"]');
  return [...window.document.querySelectorAll("tbody tr")];
}

test("cancelled card checkout never enters the operational order list", () => {
  const dom = demo();
  startCardOrder(dom.window, "Pedido cancelado");
  click(dom.window, "[data-modal-close]");
  const rows = openAdminOrders(dom.window);
  assert.equal(rows.length, 4);
  assert.equal(rows.some((row) => row.textContent.includes("Pedido cancelado")), false);
  dom.window.close();
});

test("approved card checkout creates one paid order for administration", () => {
  const dom = demo();
  startCardOrder(dom.window, "Pedido pagado");
  click(dom.window, "[data-simulate-card-payment]");
  assert.match(dom.window.document.getElementById("modalRoot").textContent, /Pago aprobado/);
  click(dom.window, "[data-modal-close]");
  const rows = openAdminOrders(dom.window);
  assert.equal(rows.length, 5);
  assert.match(rows[0].textContent, /Pedido pagado/);
  assert.match(rows[0].textContent, /Tarjeta en línea/);
  assert.match(rows[0].textContent, /Pago confirmado/);
  dom.window.close();
});

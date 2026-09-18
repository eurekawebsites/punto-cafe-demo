const products = [
  {
    id: "americano", name: "Café Americano", price: 65, category: "espresso", label: "Con espresso",
    description: "Una dosis delicada de cafeína con mucho carácter.",
    image: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvNmEwNmFjMjQ1MmVhN2U2MGJlZmU4Y2JmNmViM2M2ODcvYTE2ODFkNjdlYmU1NWM3NmMzYWY1ZjQwMTYxOWMyNzguanBlZw=="
  },
  {
    id: "latte", name: "Latte", price: 90, category: "espresso", label: "Con espresso",
    description: "Leche cremada con café.",
    image: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvZDYxN2IxYTZiNjczMTExN2I4MGJiMWVmNDMxMzc5YTEvYTE2ODFkNjdlYmU1NWM3NmMzYWY1ZjQwMTYxOWMyNzguanBlZw=="
  },
  {
    id: "capuccino", name: "Capuccino", price: 90, category: "espresso", label: "Con espresso",
    description: "Café con leche, espumoso, denso y aterciopelado.",
    image: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvNzhhZDRkNGY4Y2ZiMTYzMjJhZmZmMzFhNjgxYzM0NzIvYTE2ODFkNjdlYmU1NWM3NmMzYWY1ZjQwMTYxOWMyNzguanBlZw=="
  },
  {
    id: "chai", name: "Chai latte", price: 105, category: "sin-cafe", label: "Sin café",
    description: "Leche cremosa con un toque especiado.",
    image: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvYjZhNmRhYzI1MmRmOGMwZmI3OGJjZDczY2U5YjViMjYvYTE2ODFkNjdlYmU1NWM3NmMzYWY1ZjQwMTYxOWMyNzguanBlZw=="
  },
  {
    id: "coldbrew", name: "Cold brew Orange", price: 110, category: "espresso", label: "Cold brew",
    description: "Café de la casa infusionado en frío y servido con hielos.",
    image: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvMmYwYTVhM2QxMmVmZWY4ZTE1NWRkNDU1MzE3ZDUzOTkvYTE2ODFkNjdlYmU1NWM3NmMzYWY1ZjQwMTYxOWMyNzguanBlZw=="
  },
  {
    id: "chilaquiles", name: "Chilaquiles", price: 190, category: "desayunos", label: "Desayunos",
    description: "Totopos con salsa de la casa, crema, queso fresco y aguacate.",
    image: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvNzhkZjE4MjE3MWMyYmY4YTBjMWI3MTZmYThhYTU3YmYvYTE2ODFkNjdlYmU1NWM3NmMzYWY1ZjQwMTYxOWMyNzguanBlZw=="
  },
  {
    id: "toast", name: "Toast de Aguacate", price: 145, category: "desayunos", label: "Desayunos",
    description: "Pan de masa madre, aguacate, arúgula, queso feta y jitomate cherry.",
    image: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvMWI5Y2JmOTA0ODNjY2QwY2YxZjNhZGRhZDVjOTAyZDcvYTE2ODFkNjdlYmU1NWM3NmMzYWY1ZjQwMTYxOWMyNzguanBlZw=="
  },
  {
    id: "enchiladas", name: "Enchiladas de Pollo", price: 185, category: "desayunos", label: "Desayunos",
    description: "Tres enchiladas en salsa verde o roja con crema, queso y aguacate.",
    image: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvODJlZWYzOTUyMzdlN2I0MTJiZmVhOTJiOTdlZDlhMDUvYTE2ODFkNjdlYmU1NWM3NmMzYWY1ZjQwMTYxOWMyNzguanBlZw=="
  },
  {
    id: "pesto", name: "Sandwich de Pechuga al Pesto", price: 225, category: "sandwiches", label: "Sandwiches",
    description: "Pechuga a la plancha, pesto de la casa, queso de cabra y arúgula.",
    image: "https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC9pbWFnZS1wcm9jL3Byb2Nlc3NlZF9pbWFnZXMvNjc5NTFhYzY3ZjhkZDc4YTVlNGY1ZWYxNGExOWQwYjkvYTE2ODFkNjdlYmU1NWM3NmMzYWY1ZjQwMTYxOWMyNzguanBlZw=="
  }
];

const money = value => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);
const cart = new Map();
const grid = document.querySelector("#product-grid");
const cartPanel = document.querySelector(".cart-panel");
const scrim = document.querySelector("[data-scrim]");
const pickupTime = document.querySelector("#pickup-time");
const dialog = document.querySelector("#checkout-dialog");

function renderProducts(category = "todos") {
  const visible = category === "todos" ? products : products.filter(product => product.category === category);
  grid.innerHTML = visible.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-body">
        <span class="product-category">${product.label}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <span class="product-price">${money(product.price)}</span>
          <button class="add-button" type="button" data-add="${product.id}" aria-label="Agregar ${product.name}">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

function cartTotals() {
  let quantity = 0;
  let total = 0;
  cart.forEach((qty, id) => {
    const product = products.find(item => item.id === id);
    quantity += qty;
    total += product.price * qty;
  });
  return { quantity, total };
}

function renderCart() {
  const { quantity, total } = cartTotals();
  const entries = [...cart.entries()];
  document.querySelectorAll("[data-cart-count]").forEach(node => { node.textContent = quantity; });
  document.querySelectorAll("[data-subtotal]").forEach(node => { node.textContent = money(total); });
  document.querySelectorAll("[data-total], [data-mobile-total], [data-dialog-total]").forEach(node => { node.textContent = `${money(total)} MXN`; });
  document.querySelector("[data-cart-empty]").hidden = quantity > 0;
  document.querySelector("[data-cart-checkout]").hidden = quantity === 0;
  document.querySelector(".mobile-cart-bar").hidden = quantity === 0;
  document.querySelector("[data-cart-items]").innerHTML = entries.map(([id, qty]) => {
    const product = products.find(item => item.id === id);
    return `
      <div class="cart-item">
        <div><h3>${product.name}</h3><span class="cart-item-price">${money(product.price * qty)}</span></div>
        <div class="quantity">
          <button type="button" data-qty="${id}" data-delta="-1" aria-label="Quitar uno">−</button>
          <span>${qty}</span>
          <button type="button" data-qty="${id}" data-delta="1" aria-label="Agregar uno">+</button>
        </div>
      </div>`;
  }).join("");
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function openCart() {
  if (window.innerWidth >= 900) {
    cartPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  cartPanel.classList.add("open");
  scrim.hidden = false;
  document.body.classList.add("cart-open");
}

function closeCart() {
  cartPanel.classList.remove("open");
  scrim.hidden = true;
  document.body.classList.remove("cart-open");
}

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) {
    const id = add.dataset.add;
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    showToast(`${products.find(item => item.id === id).name} se agregó al pedido`);
  }

  const quantityButton = event.target.closest("[data-qty]");
  if (quantityButton) {
    const id = quantityButton.dataset.qty;
    const next = (cart.get(id) || 0) + Number(quantityButton.dataset.delta);
    if (next <= 0) cart.delete(id); else cart.set(id, next);
    renderCart();
  }

  const tab = event.target.closest("[data-category]");
  if (tab) {
    document.querySelectorAll("[data-category]").forEach(button => {
      const selected = button === tab;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", selected);
    });
    renderProducts(tab.dataset.category);
  }

  if (event.target.closest("[data-open-cart]")) openCart();
  if (event.target.closest("[data-close-cart]") || event.target === scrim) closeCart();
  if (event.target.closest("[data-checkout]")) {
    closeCart();
    dialog.showModal();
  }
  if (event.target.closest("[data-finish]")) {
    dialog.close();
    showToast("Demostración completada · No se envió ningún pedido");
  }
});

pickupTime.addEventListener("change", () => {
  document.querySelector("[data-summary-time]").textContent = pickupTime.value;
});

document.querySelectorAll("input[name='payment']").forEach(input => {
  input.addEventListener("change", () => {
    document.querySelectorAll(".payment-option").forEach(label => label.classList.toggle("selected", label.contains(input)));
  });
});

renderProducts();
renderCart();

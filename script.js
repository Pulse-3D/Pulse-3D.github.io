const products = [
  {
    id: "orbital-stand",
    name: "Orbital Phone Stand",
    category: "Desk accessory",
    price: "£8.00",
    description: "A clean, futuristic stand designed for fast printing and a premium desk setup.",
    file: "assets/stl/orbital-phone-stand.stl",
    paymentUrl: "https://example.com/checkout/orbital-phone-stand",
  },
  {
    id: "grid-lamp",
    name: "Grid Lamp Shade",
    category: "Home decor",
    price: "£12.00",
    description: "A geometric lamp shade STL that turns a standard light into a statement piece.",
    file: "assets/stl/grid-lamp-shade.stl",
    paymentUrl: "https://example.com/checkout/grid-lamp-shade",
  },
  {
    id: "modular-hook",
    name: "Modular Wall Hook",
    category: "Utility print",
    price: "£5.00",
    description: "A compact wall hook system for entryways, studios, and workshop storage.",
    file: "assets/stl/modular-wall-hook.stl",
    paymentUrl: "https://example.com/checkout/modular-wall-hook",
  },
];

const storageKey = "pulse3d-purchases";
const grid = document.getElementById("product-grid");
const productCount = document.getElementById("product-count");
const dialog = document.getElementById("purchase-dialog");
const dialogTitle = document.getElementById("dialog-title");
const dialogCopy = document.getElementById("dialog-copy");
const paymentLink = document.getElementById("payment-link");
const confirmPayment = document.getElementById("confirm-payment");

let activeProduct = null;

function readPurchases() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) ?? {};
  } catch {
    return {};
  }
}

function writePurchases(purchases) {
  localStorage.setItem(storageKey, JSON.stringify(purchases));
}

function isOwned(productId) {
  return Boolean(readPurchases()[productId]);
}

function unlockProduct(productId) {
  const purchases = readPurchases();
  purchases[productId] = true;
  writePurchases(purchases);
}

function createPreviewLabel(product) {
  const label = document.createElement("span");
  label.className = "preview-ribbon";
  label.textContent = `${product.category} · STL`;
  return label;
}

function createCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const preview = document.createElement("div");
  preview.className = "product-preview";
  preview.appendChild(createPreviewLabel(product));

  const meta = document.createElement("div");
  meta.className = "product-meta";

  const category = document.createElement("span");
  category.className = "pill";
  category.textContent = product.category;

  const price = document.createElement("span");
  price.className = "price-pill";
  price.textContent = product.price;

  meta.append(category, price);

  const title = document.createElement("h3");
  title.textContent = product.name;

  const description = document.createElement("p");
  description.textContent = product.description;

  const actions = document.createElement("div");
  actions.className = "product-actions";

  const buyButton = document.createElement("button");
  buyButton.type = "button";
  buyButton.className = "secondary-btn";
  buyButton.textContent = isOwned(product.id) ? "Purchased" : "Buy now";

  const downloadButton = document.createElement("button");
  downloadButton.type = "button";
  downloadButton.className = "primary-btn";
  downloadButton.textContent = isOwned(product.id) ? "Download STL" : "Unlock download";

  buyButton.addEventListener("click", () => openPurchaseDialog(product));
  downloadButton.addEventListener("click", () => {
    if (isOwned(product.id)) {
      startDownload(product.file, product.name);
      return;
    }

    openPurchaseDialog(product);
  });

  actions.append(buyButton, downloadButton);
  card.append(preview, meta, title, description, actions);

  return card;
}

function renderProducts() {
  grid.innerHTML = "";
  products.forEach((product) => {
    grid.appendChild(createCard(product));
  });

  productCount.textContent = String(products.length);
}

function openPurchaseDialog(product) {
  activeProduct = product;
  dialogTitle.textContent = product.name;
  dialogCopy.textContent = `Price: ${product.price}. Connect this button to your payment provider, then unlock the STL download for buyers.`;
  paymentLink.href = product.paymentUrl || "#";
  paymentLink.textContent = product.paymentUrl ? "Open payment link" : "Set a payment link first";
  confirmPayment.disabled = !product.paymentUrl;

  if (!dialog.open) {
    dialog.showModal();
  }
}

function startDownload(file, name) {
  const link = document.createElement("a");
  link.href = file;
  link.download = `${name}.stl`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

dialog.addEventListener("close", () => {
  activeProduct = null;
});

document.getElementById("purchase-form").addEventListener("submit", (event) => {
  event.preventDefault();

  if (!activeProduct) {
    dialog.close();
    return;
  }

  unlockProduct(activeProduct.id);
  dialog.close();
  renderProducts();
});

renderProducts();

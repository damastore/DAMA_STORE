// ============================================
 // DAMA STORE
 // Products + Search + Categories + Favorites
 // Product Gallery + Cart + Toast + Firebase
 // Discounts + Order Confirmation
 // ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getDatabase,
  ref,
  push
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: "AIzaSyBoIHMObJyJ7ehdPX5pfSwb3QYzxL0QO-Q",
  authDomain: "dama-store-7fd69.firebaseapp.com",
  databaseURL: "https://dama-store-7fd69-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dama-store-7fd69",
  storageBucket: "dama-store-7fd69.firebasestorage.app",
  messagingSenderId: "1076285666524",
  appId: "1:1076285666524:web:15e9b02fcd7ea67ecdb019"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// كنستناو تسجيل الدخول قبل ما نسيفطو الطلب
const authReady = signInAnonymously(auth)
  .then(({ user }) => {
    console.log("Firebase connecté ✅");
    return user;
  })
  .catch(error => {
    console.error("Erreur Firebase Auth:", error);
    return null;
  });

/* ================= PRODUCTS ================= */

const products = [
  {
    id: 1,
    name: "ROLEX DATEJUST",
    price: 170.00,
    category: "montres",
    description: "ساعة أنيقة للاستعمال اليومي",
    images: ["images/01.jpg", "images/r1.jpeg", "images/r blu.jpeg", "images/aa.jpeg", "images/r vert.jpeg"]
  },
  {
    id: 2,
    name: "BRACLET LACOSTE",
    price: 119.00,
    category: "bracelets",
    description: "سوار لاكوست أنيق بلمسة رياضية راقية، مناسب لجميع إطلالاتك اليومية.",
    images: ["images/888.png", "images/2.jpg", "images/3.jpg"]
  },
  {
    id: 3,
    name: "ROLEX SPRITE BATMAN",
    price: 170.00,
    category: "montres",
    description: "ساعة روليكس فخمة وأنيقةقمة الفخامة والدقة الميكانيكية",
    images: ["images/rool01.jpeg", "images/rool1.jpeg"]
  },
  {
    id: 4,
    name: "PORTEFEUILLE GOYARO",
    price: 119.00,
    category: "accessoires",
    description: "لمسة أنيقة لكل يوم",
    images: ["images/0001.jpg", "images/0002.jpg", "images/0003.jpg"]
  },
  {
    id: 5,
    name: "AUDEMARS PIGUET ROYAL OAK",
    price: 170.00,
    category: "montres",
    description: "ساعة فخمة بتصميم راقٍ يليق بكل المناسبات.",
    images: ["images/00001.jpg", "images/00002.jpg", "images/00003.jpg"]
  },
  {
    id: 6,
    name: "TISSOT ACIER ",
    price: 170.00,
    category: "montres",
    description: "قمة الفخامة والدقة الميكانيكية",
    images: ["images/tiso.jpeg"]
  },
  {
    id: 7,
    name: "CASIO CARRE",
    price: 170.00,
    category: "montres",
    description: "ساعة كلاسيكية فاخرة",
    images: ["images/11.png", "images/22.png", "images/33.png"]
  },
  {
    id: 8,
    name: "EMPORIO ARMANI",
    price: 150.00,
    category: "montres",
    description: "لمسة أنيقة خفيفة",
    images: ["images/hhh.jpeg"]
  }
];

// الثمن القديم = الثمن الحالي + 50 DH
function getOldPrice(product) {
  return Number(product.price) + 50;
}

/* ================= ELEMENTS ================= */

const productGrid = document.getElementById("product-grid");
const productSearch = document.getElementById("product-search");

const productsPrevButton = document.getElementById("products-prev");
const productsNextButton = document.getElementById("products-next");

const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountElement = document.getElementById("cart-count");
const cartTotalElement = document.getElementById("cart-total");

const openCartButton = document.getElementById("open-cart");
const closeCartButton = document.getElementById("close-cart");
const checkoutButton = document.getElementById("checkout-button");

const orderForm = document.getElementById("order-form");
const orderMessage = document.getElementById("order-message");

const productModal = document.getElementById("product-modal");
const closeProductButton = document.getElementById("close-product");

const productDetailImage = document.getElementById("product-detail-image");
const productDetailName = document.getElementById("product-detail-name");
const productDetailPrice = document.getElementById("product-detail-price");
const productDetailDescription = document.getElementById("product-detail-description");

const detailMinus = document.getElementById("detail-minus");
const detailPlus = document.getElementById("detail-plus");
const detailQuantity = document.getElementById("detail-quantity");

const detailBuyNow = document.getElementById("detail-buy-now");
const detailAddCart = document.getElementById("detail-add-cart");

/* ================= STATE ================= */

let cart = [];
let selectedProduct = null;
let selectedQuantity = 1;
let currentImageIndex = 0;

let productSlots = [1, 2, 3, 4, 5, 6, 7, 8];

/* ================= FAVORITES ================= */

const FAVORITES_KEY = "dama-favorites";

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");

    return Array.isArray(saved)
      ? saved.map(Number).filter(Number.isFinite)
      : [];
  } catch (error) {
    console.warn("Impossible de charger les favoris:", error);
    return [];
  }
}

let favorites = loadFavorites();

function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.warn("Impossible de sauvegarder les favoris:", error);
  }
}

function isFavorite(productId) {
  return favorites.includes(Number(productId));
}

function toggleFavorite(productId) {
  productId = Number(productId);

  if (isFavorite(productId)) {
    favorites = favorites.filter(id => id !== productId);
    showToast("Produit retiré des favoris !");
  } else {
    favorites.push(productId);
    showToast("Produit ajouté aux favoris !");
  }

  saveFavorites();
  renderProducts();
  applySearch();
}

/* ================= TOAST ================= */

let toastTimer;

function showToast(message) {
  let toast = document.getElementById("dama-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "dama-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* ================= CATEGORY FILTERS ================= */

let activeCategory = "all";

function renderCategoryFilters() {
  const searchContainer = document.querySelector(".product-search");

  if (!searchContainer || document.getElementById("dama-category-filters")) {
    return;
  }

  const filters = document.createElement("div");
  filters.id = "dama-category-filters";
  filters.className = "dama-category-filters";

  const categories = [
    { id: "all", label: "Tous les produits" },
    { id: "montres", label: "Montres" },
    { id: "bracelets", label: "Bracelets" },
    { id: "accessoires", label: "Accessoires" },
    { id: "favorites", label: "Favoris ♥️" }
  ];

  categories.forEach(category => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "dama-filter-button";
    button.dataset.category = category.id;
    button.textContent = category.label;

    if (category.id === activeCategory) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      activeCategory = category.id;

      filters.querySelectorAll(".dama-filter-button").forEach(item => {
        item.classList.toggle(
          "active",
          item.dataset.category === activeCategory
        );
      });

      applySearch();
    });

    filters.appendChild(button);
  });

  searchContainer.insertAdjacentElement("afterend", filters);
}

/* ================= PRODUCT IMAGES ================= */

function getProductImages(product) {
  if (Array.isArray(product.images) && product.images.length) {
    return product.images.filter(Boolean);
  }

  if (product.image) {
    return [product.image];
  }

  return [];
}

function getProductImage(product) {
  const images = getProductImages(product);

  if (!images.length) {
    return `<div class="empty-image">Image du produit</div>`;
  }

  return `
    <img
      src="${images[0]}"
      alt="${product.name}"
      loading="lazy"
    >
  `;
}

/* ================= RENDER PRODUCTS ================= */

function renderProducts() {
  if (!productGrid) return;

  productGrid.innerHTML = productSlots.map((productId, slotIndex) => {
    const product = products.find(item => item.id === productId);

    if (!product) return "";

    const favorite = isFavorite(product.id);

    return `
      <article
        class="product-card"
        data-product-id="${product.id}"
        data-slot-index="${slotIndex}"
      >
        <div class="product-image">
          ${getProductImage(product)}

          <button
            type="button"
            class="dama-favorite-btn ${favorite ? "is-favorite" : ""}"
            data-favorite-id="${product.id}"
            aria-label="${favorite ? "Retirer des favoris" : "Ajouter aux favoris"}"
            aria-pressed="${favorite}"
            title="${favorite ? "Retirer des favoris" : "Ajouter aux favoris"}"
          >
            <span aria-hidden="true">${favorite ? "♥️" : "♡"}</span>
          </button>
        </div>

        <div class="product-info">
          <h3>${product.name}</h3>

          ${
            product.price > 0
              ? `
                <div class="dama-price-line">
                  <strong class="dama-current-price">${Number(product.price).toFixed(2)} DH</strong>
                  <del class="dama-old-price">${getOldPrice(product)} DH</del>
                </div>
                <p class="dama-free-delivery">Livraison gratuite</p>
              `
              : `<strong>Prix bientôt disponible</strong>`
          }
        </div>
      </article>
    `;
  }).join("");
}

/* ================= PRODUCT NAVIGATION ================= */

function nextProducts() {
  if (productSlots.length < 2) return;

  const firstProduct = productSlots.shift();
  productSlots.push(firstProduct);

  renderProducts();
  applySearch();
}

function previousProducts() {
  if (productSlots.length < 2) return;

  const lastProduct = productSlots.pop();
  productSlots.unshift(lastProduct);

  renderProducts();
  applySearch();
}

if (productsPrevButton) {
  productsPrevButton.addEventListener("click", previousProducts);
}

if (productsNextButton) {
  productsNextButton.addEventListener("click", nextProducts);
}

/* ================= SEARCH + FILTER ================= */

function applySearch() {
  const searchText = productSearch
    ? productSearch.value.toLowerCase().trim()
    : "";

  const cards = document.querySelectorAll(".product-card");

  cards.forEach(card => {
    const productId = Number(card.dataset.productId);
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const text = `${product.name} ${product.description}`.toLowerCase();
    const matchesSearch = text.includes(searchText);

    let matchesCategory = true;

    if (activeCategory === "favorites") {
      matchesCategory = isFavorite(product.id);
    } else if (activeCategory !== "all") {
      matchesCategory = product.category === activeCategory;
    }

    card.style.display = matchesSearch && matchesCategory ? "" : "none";
  });
}

if (productSearch) {
  productSearch.addEventListener("input", applySearch);
}

/* ================= PRODUCT DETAILS ================= */

function openProductDetails(productId) {
  const product = products.find(item => item.id === productId);

  if (!product || !productModal) return;

  selectedProduct = product;
  selectedQuantity = 1;
  currentImageIndex = 0;

  if (productDetailImage) {
    const images = getProductImages(product);

    if (!images.length) {
      productDetailImage.innerHTML = `
        <div class="empty-image">Image du produit</div>
      `;
    } else {
      productDetailImage.innerHTML = `
        <div class="detail-gallery">
          <img
            id="detail-main-img"
            src="${images[0]}"
            alt="${product.name}"
          >

          ${
            images.length > 1
              ? `
                <button
                  class="gallery-arrow gallery-prev"
                  type="button"
                  aria-label="Image précédente"
                >‹</button>

                <button
                  class="gallery-arrow gallery-next"
                  type="button"
                  aria-label="Image suivante"
                >›</button>
              `
              : ""
          }

          ${
            images.length > 1
              ? `
                <div class="gallery-counter">
                  <span id="gallery-current">1</span> / ${images.length}
                </div>
              `
              : ""
          }
        </div>
      `;
    }
  }

  if (productDetailName) {
    productDetailName.textContent = product.name;
  }

  if (productDetailPrice) {
    if (product.price > 0) {
      productDetailPrice.innerHTML = `
        <strong class="dama-current-price">${product.price} DH</strong>
        <del class="dama-old-price">${getOldPrice(product)} DH</del>
        <p class="dama-free-delivery">Livraison gratuite</p>
      `;
    } else {
      productDetailPrice.textContent = "Prix bientôt disponible";
    }
  }

  if (productDetailDescription) {
    productDetailDescription.textContent = product.description;
  }

  if (detailQuantity) {
    detailQuantity.textContent = selectedQuantity;
  }

  productModal.classList.add("active");
  productModal.setAttribute("aria-hidden", "false");
}

function closeProductDetails() {
  if (!productModal) return;

  productModal.classList.remove("active");
  productModal.setAttribute("aria-hidden", "true");
}

function changeDetailImage(direction) {
  if (!selectedProduct) return;

  const images = getProductImages(selectedProduct);

  if (images.length < 2) return;

  currentImageIndex =
    (currentImageIndex + direction + images.length) % images.length;

  const mainImage = document.getElementById("detail-main-img");
  const counter = document.getElementById("gallery-current");

  if (mainImage) {
    mainImage.src = images[currentImageIndex];
  }

  if (counter) {
    counter.textContent = currentImageIndex + 1;
  }
}

if (closeProductButton) {
  closeProductButton.addEventListener("click", closeProductDetails);
}

if (productModal) {
  productModal.addEventListener("click", event => {
    if (event.target === productModal) {
      closeProductDetails();
    }
  });
}

/* ================= QUANTITY ================= */

if (detailMinus) {
  detailMinus.addEventListener("click", () => {
    if (selectedQuantity > 1) {
      selectedQuantity--;
    }

    if (detailQuantity) {
      detailQuantity.textContent = selectedQuantity;
    }
  });
}

if (detailPlus) {
  detailPlus.addEventListener("click", () => {
    selectedQuantity++;

    if (detailQuantity) {
      detailQuantity.textContent = selectedQuantity;
    }
  });
}

/* ================= CART ================= */

function addToCart(productId, quantity = 1) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  if (product.price <= 0) {
    alert("Ce produit n'est pas encore disponible.");
    return;
  }

  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity
    });
  }

  renderCart();
  showToast("🛒 Produit ajouté au panier !");
}

function changeQuantity(productId, amount) {
  const item = cart.find(product => product.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

function getCartTotal() {
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

function getCartQuantity() {
  return cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
}

/* ================= RENDER CART ================= */

function renderCart() {
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Votre panier est vide.</p>";
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>

            <p>
              <strong>${item.price} DH</strong>
              <del class="dama-old-price">${getOldPrice(item)} DH</del>
              × ${item.quantity}
            </p>

            <strong>${item.price * item.quantity} DH</strong>
            <p class="dama-free-delivery">Livraison gratuite</p>
          </div>

          <div class="cart-item-actions">
            <button
              type="button"
              data-action="decrease"
              data-product-id="${item.id}"
              aria-label="Diminuer la quantité"
            >−</button>

            <span>${item.quantity}</span>

            <button
              type="button"
              data-action="increase"
              data-product-id="${item.id}"
              aria-label="Augmenter la quantité"
            >+</button>

            <button
              type="button"
              data-action="remove"
              data-product-id="${item.id}"
            >Supprimer</button>
          </div>
        </div>
      `).join("");
    }
  }

  if (cartCountElement) {
    cartCountElement.textContent = getCartQuantity();
  }

  if (cartTotalElement) {
    cartTotalElement.textContent = getCartTotal();
  }
}

/* ================= CART MODAL ================= */

function openCart() {
  if (!cartModal) return;

  cartModal.classList.add("active");
  cartModal.setAttribute("aria-hidden", "false");
}

function closeCart() {
  if (!cartModal) return;

  cartModal.classList.remove("active");
  cartModal.setAttribute("aria-hidden", "true");
}

if (openCartButton) {
  openCartButton.addEventListener("click", openCart);
}

if (closeCartButton) {
  closeCartButton.addEventListener("click", closeCart);
}

if (cartModal) {
  cartModal.addEventListener("click", event => {
    if (event.target === cartModal) {
      closeCart();
    }
  });
}

/* ================= GLOBAL CLICK ================= */

document.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite-id]");

  if (favoriteButton) {
    event.preventDefault();
    event.stopPropagation();

    toggleFavorite(Number(favoriteButton.dataset.favoriteId));
    return;
  }

  const galleryArrow = event.target.closest(".gallery-arrow");

  if (galleryArrow) {
    event.stopPropagation();

    if (galleryArrow.classList.contains("gallery-next")) {
      changeDetailImage(1);
    } else {
      changeDetailImage(-1);
    }

    return;
  }

  const productCard = event.target.closest(".product-card");

  if (productCard && !event.target.closest("button")) {
    const productId = Number(productCard.dataset.productId);

    openProductDetails(productId);
    return;
  }

  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) return;

  const productId = Number(actionButton.dataset.productId);
  const action = actionButton.dataset.action;

  if (action === "increase") {
    changeQuantity(productId, 1);
  }

  if (action === "decrease") {
    changeQuantity(productId, -1);
  }

  if (action === "remove") {
    removeFromCart(productId);
  }
});

/* ================= ADD CART BUTTON ================= */

if (detailAddCart) {
  detailAddCart.addEventListener("click", () => {
    if (!selectedProduct) return;

    addToCart(selectedProduct.id, selectedQuantity);

    closeProductDetails();
    openCart();
  });
}

/* ================= BUY NOW ================= */

if (detailBuyNow) {
  detailBuyNow.addEventListener("click", () => {
    if (!selectedProduct) return;

    addToCart(selectedProduct.id, selectedQuantity);

    closeProductDetails();
    openCart();

    setTimeout(() => {
      if (checkoutButton) {
        checkoutButton.click();
      }
    }, 100);
  });
}

/* ================= CHECKOUT ================= */

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Votre panier est vide. Ajoutez un produit d'abord.");
      return;
    }

    if (!orderForm) {
      alert("Le formulaire de commande est introuvable.");
      return;
    }

    orderForm.hidden = false;
    orderForm.style.display = "block";

    orderForm.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}

/* ================= ORDER CONFIRMATION ================= */

function showOrderConfirmation(order, orderId) {
  let confirmation = document.getElementById("dama-order-confirmation");

  if (!confirmation) {
    confirmation = document.createElement("section");
    confirmation.id = "dama-order-confirmation";

    Object.assign(confirmation.style, {
      position: "fixed",
      inset: "0",
      zIndex: "99999",
      background: "#f7f6f3",
      overflowY: "auto",
      padding: "24px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    });

    document.body.appendChild(confirmation);
  }

  confirmation.replaceChildren();

  const card = document.createElement("div");

  Object.assign(card.style, {
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "28px 22px",
    textAlign: "center",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    color: "#202020",
    fontFamily: "Arial, sans-serif"
  });

  const check = document.createElement("div");
  check.textContent = "✓";

  Object.assign(check.style, {
    width: "68px",
    height: "68px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "#e8f5e9",
    color: "#23833b",
    fontSize: "42px",
    lineHeight: "68px",
    fontWeight: "bold"
  });

  const heading = document.createElement("h2");
  heading.textContent = "Commande confirmée !";

  const description = document.createElement("p");
  description.textContent =
    "Merci pour votre commande chez DAMA STORE. Nous avons bien reçu votre demande.";

  const number = document.createElement("p");
  number.textContent = `Référence de commande : ${orderId}`;

  const customer = document.createElement("div");
  customer.style.textAlign = "left";
  customer.style.marginTop = "22px";

  const customerHeading = document.createElement("h3");
  customerHeading.textContent = "Informations de livraison";
  customer.appendChild(customerHeading);

  [
    `Nom : ${order.customer.name}`,
    `Téléphone : ${order.customer.phone}`,
    `Ville : ${order.customer.city}`,
    `Adresse : ${order.customer.address}`
  ].forEach(text => {
    const line = document.createElement("p");
    line.textContent = text;
    customer.appendChild(line);
  });

  const productsHeading = document.createElement("h3");
  productsHeading.textContent = "Récapitulatif";
  productsHeading.style.textAlign = "left";
  productsHeading.style.marginTop = "22px";

  const productsList = document.createElement("div");
  productsList.style.textAlign = "left";

  order.products.forEach(item => {
    const line = document.createElement("p");
    line.textContent =
      `${item.name} — ${item.quantity} × ${item.price} DH = ${item.subtotal} DH`;
    productsList.appendChild(line);
  });

  const total = document.createElement("h3");
  total.textContent = `Total : ${order.total} DH`;
  total.style.marginTop = "18px";

  const delivery = document.createElement("p");
  delivery.textContent = "Livraison : Gratuite";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Retour à la boutique";

  Object.assign(closeButton.style, {
    marginTop: "22px",
    padding: "13px 24px",
    border: "none",
    borderRadius: "10px",
    background: "#b88b5a",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
  });

  closeButton.addEventListener("click", () => {
    confirmation.remove();

    if (cartModal) {
      cartModal.classList.remove("active");
      cartModal.setAttribute("aria-hidden", "true");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  card.append(
    check,
    heading,
    description,
    number,
    customer,
    productsHeading,
    productsList,
    total,
    delivery,
    closeButton
  );

  confirmation.appendChild(card);
}

/* ================= ORDER SUBMISSION ================= */

if (orderForm) {
  orderForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    const nameInput = orderForm.querySelector('[name="name"]');
    const phoneInput = orderForm.querySelector('[name="phone"]');
    const cityInput = orderForm.querySelector('[name="city"]');
    const addressInput = orderForm.querySelector('[name="address"]');

    if (!nameInput || !phoneInput || !cityInput || !addressInput) {
      alert("Le formulaire est incomplet. Vérifiez les champs HTML.");
      console.error("Un ou plusieurs champs de livraison sont introuvables.");
      return;
    }

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const city = cityInput.value.trim();
    const address = addressInput.value.trim();

    if (!name || !phone || !city || !address) {
      alert("عافاك عمّر جميع معلومات التوصيل.");
      return;
    }

    const order = {
      customer: {
        name,
        phone,
        city,
        address
      },

      products: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        oldPrice: getOldPrice(item),
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),

      total: getCartTotal(),
      delivery: "Gratuite",
      status: "nouvelle",
      createdAt: new Date().toISOString()
    };

    const submitButton = orderForm.querySelector('[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Envoi en cours...";
    }

    if (orderMessage) {
      orderMessage.textContent = "";
    }

    try {
      // 1. نتأكدو أن Firebase Auth خدام
      const user = await authReady;

      if (!user) {
        throw new Error(
          "Connexion Firebase impossible. Vérifiez Anonymous Authentication."
        );
      }

      // 2. نسجلو الطلب مرة وحدة فقط
      const ordersRef = ref(db, "orders");
      const result = await push(ordersRef, order);

      console.log("Commande enregistrée dans Firebase ✅", result.key);

      // 3. نعرضو صفحة التأكيد من بعد نجاح التسجيل
      showOrderConfirmation(order, result.key);

      if (orderMessage) {
        orderMessage.textContent =
          "✅ Votre commande a été envoyée avec succès !";
      }

      // 4. نفرغو السلة والفورم
      cart = [];
      renderCart();

      orderForm.reset();
      orderForm.hidden = true;
      orderForm.style.display = "none";

    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la commande:", error);

      let message =
        "❌ Impossible d'envoyer la commande. Veuillez réessayer.";

      if (
        error?.code === "PERMISSION_DENIED" ||
        error?.code === "PERMISSION_DENIED: Permission denied"
      ) {
        message =
          "❌ Accès refusé par Firebase. Vérifiez les règles de Realtime Database.";
      } else if (error?.message?.includes("Anonymous Authentication")) {
        message =
          "❌ Activez Anonymous Authentication dans Firebase Authentication.";
      } else if (error?.message) {
        console.error("Détail de l'erreur:", error.message);
      }

      if (orderMessage) {
        orderMessage.textContent = message;
      }

      alert(message);

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent =
          originalButtonText || "Confirmer la commande";
      }
    }
  });
}

/* ================= START ================= */

renderProducts();
renderCart();
renderCategoryFilters();
applySearch();
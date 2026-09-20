// ============================================
// DAMA STORE
// 8 Products + Search + Product Gallery + Cart + Firebase
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

signInAnonymously(auth)
  .then(() => {
    console.log("Firebase connecté ✅");
  })
  .catch(error => {
    console.error("Erreur Firebase:", error);
  });


/* ================= PRODUCTS ================= */

const products = [

  {
    id: 1,
    name: "Montre Rolexe",
    price: 189,
    description: "ساعة أنيقة للاستعمال اليومي",

    // بدّل هاد المسارات بمسارات الصور ديالك
    images: [
      "images/003.jpg",
      "images/002.jpg",
      "images/001.jpg"
    ]
  },

  {
    id: 2,
    name: "Braclet lacoste",
    price: 129,
    description: "سوار لاكوست أنيق بلمسة رياضية راقية، مناسب لجميع إطلالاتك اليومية.",


    images: [
      "images/1.jpg",
      "images/2.jpg",
      "images/3.jpg"
    ]
  },

  {
    id: 3,
    name: "Montre Rolex",
    price: 189,
    description: "ساعة روليكس فخمةوأنيقة",
    images: [
      "images/01.jpg",
      "images/02.jpg",
      "images/03.jpg"
    ]
  },

  {
    id: 4,
    name: "portefeuille Goyaro",
    price: 139,
    description: "لمسة أنيقة لكل يوم",
    images: [
      "images/0001.jpg",
      "images/0002.jpg",
      "images/0003.jpg"
    ]
  },

  {
    id: 5,
    name: "Montre odmarre piguet",
    price: 189,
    description: "ساعة فخمة بتصميم راقٍ يليق بكل المناسبات.",
    images: [
      "images/00001.jpg",
      "images/00002.jpg",
      "images/00003.jpg"
    ]
  },

  {
    id: 6,
    name: "Audemars piguet royal",
    price: 269,
    description: "قمة الفخامة والدقة الميكانيكية",
    images: [
      "images/000001.jpg",
      "images/000002.jpg",
      "images/000003.jpg"
    ]
  },

  {
    id: 7,
    name: "Montre Casio",
    price: 189,
    description: "ساعة كلاسيكية فاخرة",
    images: [
      "images/22.jpg",
      "images/21.jpg",
    ]
  },

  {
    id: 8,
    name: "gourmette homme",
    price: 129,
    description: "لمسة أنيقة خفيفة",
    images:  [
      "images/12.jpg",
      "images/222.jpg",
    ]
  }

];


/* ================= ELEMENTS ================= */

const productGrid =
  document.getElementById("product-grid");

const productSearch =
  document.getElementById("product-search");

const cartModal =
  document.getElementById("cart-modal");

const cartItemsContainer =
  document.getElementById("cart-items");

const cartCountElement =
  document.getElementById("cart-count");

const cartTotalElement =
  document.getElementById("cart-total");

const openCartButton =
  document.getElementById("open-cart");

const closeCartButton =
  document.getElementById("close-cart");

const checkoutButton =
  document.getElementById("checkout-button");

const orderForm =
  document.getElementById("order-form");

const orderMessage =
  document.getElementById("order-message");

const productModal =
  document.getElementById("product-modal");

const closeProductButton =
  document.getElementById("close-product");

const productDetailImage =
  document.getElementById("product-detail-image");

const productDetailName =
  document.getElementById("product-detail-name");

const productDetailPrice =
  document.getElementById("product-detail-price");

const productDetailDescription =
  document.getElementById("product-detail-description");

const detailMinus =
  document.getElementById("detail-minus");

const detailPlus =
  document.getElementById("detail-plus");

const detailQuantity =
  document.getElementById("detail-quantity");

const detailBuyNow =
  document.getElementById("detail-buy-now");

const detailAddCart =
  document.getElementById("detail-add-cart");


/* ================= STATE ================= */

let cart = [];
let selectedProduct = null;
let selectedQuantity = 1;

// رقم الصورة المفتوحة داخل تفاصيل المنتج
let currentImageIndex = 0;


/*
  8 خانات:
  4 فوق
  4 تحت
*/

let productSlots = [
  1, 2, 3, 4,
  5, 6, 7, 8
];


/* ================= PRODUCT IMAGES ================= */

// ترجع جميع صور المنتج.
// إلا كان المنتج قديم وعندو image فقط، كتستعملها كصورة واحدة.

function getProductImages(product) {

  if (Array.isArray(product.images) && product.images.length) {
    return product.images.filter(Boolean);
  }

  if (product.image) {
    return [product.image];
  }

  return [];
}


// الصورة الرئيسية اللي كتبان فبطاقة المنتج

function getProductImage(product) {

  const images = getProductImages(product);

  if (!images.length) {
    return `
      <div class="empty-image">
        Image du produit
      </div>
    `;
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

  productGrid.innerHTML =
    productSlots.map((productId, slotIndex) => {

      const product =
        products.find(item => item.id === productId);

      if (!product) return "";

      return `

        <article
          class="product-card"
          data-product-id="${product.id}"
          data-slot-index="${slotIndex}"
        >

          <div class="product-image">

            ${getProductImage(product)}

            <button
              class="next-product"
              type="button"
              data-next-slot="${slotIndex}"
              title="Produit suivant"
              aria-label="Produit suivant"
            >
              ›
            </button>

          </div>

          <div class="product-info">

            <h3>${product.name}</h3>

            ${
              product.price > 0
                ? `<strong>${product.price} DH</strong>`
                : `<strong>Prix bientôt disponible</strong>`
            }

          </div>

        </article>

      `;

    }).join("");
}


/* ================= NEXT PRODUCT ARROW ================= */

function nextProduct(slotIndex) {

  const currentId = productSlots[slotIndex];

  let currentIndex =
    products.findIndex(product => product.id === currentId);

  if (currentIndex === -1) return;

  currentIndex++;

  if (currentIndex >= products.length) {
    currentIndex = 0;
  }

  productSlots[slotIndex] =
    products[currentIndex].id;

  renderProducts();
  applySearch();
}


/* ================= SEARCH ================= */

function applySearch() {

  if (!productSearch) return;

  const searchText =
    productSearch.value.toLowerCase().trim();

  const cards =
    document.querySelectorAll(".product-card");

  cards.forEach(card => {

    const productId =
      Number(card.dataset.productId);

    const product =
      products.find(item => item.id === productId);

    if (!product) return;

    const text =
      `${product.name} ${product.description}`.toLowerCase();

    card.style.display =
      text.includes(searchText) ? "" : "none";

  });
}


if (productSearch) {
  productSearch.addEventListener("input", applySearch);
}


/* ================= PRODUCT DETAILS ================= */

function openProductDetails(productId) {

  const product =
    products.find(item => item.id === productId);

  if (!product || !productModal) return;

  selectedProduct = product;
  selectedQuantity = 1;
  currentImageIndex = 0;

  if (productDetailImage) {

    const images = getProductImages(product);

    if (!images.length) {

      productDetailImage.innerHTML = `
        <div class="empty-image">
          Image du produit
        </div>
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
    productDetailPrice.textContent =
      product.price > 0
        ? `${product.price} DH`
        : "Prix bientôt disponible";
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


// تبديل الصورة داخل نافذة تفاصيل المنتج

function changeDetailImage(direction) {

  if (!selectedProduct) return;

  const images = getProductImages(selectedProduct);

  if (images.length < 2) return;

  currentImageIndex =
    (currentImageIndex + direction + images.length) % images.length;

  const mainImage =
    document.getElementById("detail-main-img");

  const counter =
    document.getElementById("gallery-current");

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

  const product =
    products.find(item => item.id === productId);

  if (!product) return;

  if (product.price <= 0) {
    alert("Ce produit n'est pas encore disponible.");
    return;
  }

  const existingItem =
    cart.find(item => item.id === productId);

  if (existingItem) {

    existingItem.quantity += quantity;

  } else {

    cart.push({
      ...product,
      quantity
    });

  }

  renderCart();
}


function changeQuantity(productId, amount) {

  const item =
    cart.find(product => product.id === productId);

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

      cartItemsContainer.innerHTML =
        "<p>Votre panier est vide.</p>";

    } else {

      cartItemsContainer.innerHTML =
        cart.map(item => `

          <div class="cart-item">

            <div>

              <strong>${item.name}</strong>

              <p>
                ${item.price} DH × ${item.quantity}
              </p>

              <strong>
                ${item.price * item.quantity} DH
              </strong>

            </div>

            <div class="cart-item-actions">

              <button
                type="button"
                data-action="decrease"
                data-product-id="${item.id}"
              >−</button>

              <span>${item.quantity}</span>

              <button
                type="button"
                data-action="increase"
                data-product-id="${item.id}"
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

  // أسهم تبديل الصور داخل تفاصيل المنتج

  const galleryArrow =
    event.target.closest(".gallery-arrow");

  if (galleryArrow) {

    event.stopPropagation();

    if (galleryArrow.classList.contains("gallery-next")) {
      changeDetailImage(1);
    } else {
      changeDetailImage(-1);
    }

    return;
  }


  // سهم تبديل المنتج داخل البطاقة

  const nextButton =
    event.target.closest(".next-product");

  if (nextButton) {

    event.stopPropagation();

    const slotIndex =
      Number(nextButton.dataset.nextSlot);

    nextProduct(slotIndex);

    return;
  }


  // فتح تفاصيل المنتج

  const productCard =
    event.target.closest(".product-card");

  if (productCard && !event.target.closest("button")) {

    const productId =
      Number(productCard.dataset.productId);

    openProductDetails(productId);

    return;
  }


  // أزرار السلة

  const actionButton =
    event.target.closest("[data-action]");

  if (!actionButton) return;

  const productId =
    Number(actionButton.dataset.productId);

  const action =
    actionButton.dataset.action;

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


/* ================= ADD CART ================= */

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


/* ================= ORDER ================= */

if (orderForm) {

  orderForm.addEventListener("submit", async event => {

    event.preventDefault();

    if (cart.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    const name =
      orderForm.querySelector('[name="name"]').value.trim();

    const phone =
      orderForm.querySelector('[name="phone"]').value.trim();

    const city =
      orderForm.querySelector('[name="city"]').value.trim();

    const address =
      orderForm.querySelector('[name="address"]').value.trim();

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
        quantity: item.quantity,
        subtotal: item.price * item.quantity

      })),

      total: getCartTotal(),
      status: "nouvelle",
      createdAt: new Date().toISOString()

    };

    try {

      const ordersRef = ref(db, "orders");

      await push(ordersRef, order);

      console.log("Commande enregistrée dans Firebase ✅");

      if (orderMessage) {
        orderMessage.textContent =
          "✅ Votre commande a été envoyée avec succès !";
      }

      alert("Commande confirmée ✅");

      cart = [];
      renderCart();

      orderForm.reset();
      orderForm.hidden = true;
      orderForm.style.display = "none";

    } catch (error) {

      console.error("Erreur lors de l'enregistrement:", error);

      if (orderMessage) {
        orderMessage.textContent =
          "❌ Une erreur est survenue. Veuillez réessayer.";
      }

      alert("Impossible d'envoyer la commande.");

    }

  });

}


/* ================= START ================= */

renderProducts();
renderCart();
applySearch();
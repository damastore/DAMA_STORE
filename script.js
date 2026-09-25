// ============================================
// DAMA STORE
// Products + Search + Categories + Favorites
// Product Gallery + Colors + Back Button
// Cart + Firebase
// Dedicated Order Page
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
  apiKey: "AIzaSyBoIHMObJyJ7ehdPX5pfSw3bQYzxL0QO-Q",
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
    price: 169.00,
    category: "montres",
    description: "ساعة أنيقة للاستعمال اليومي",
    images: [
      "images/01.jpg",
      "images/r1.jpeg",
      "images/r blu.jpeg",
      "images/aa.jpeg",
      "images/r vert.jpeg"
    ],
  },

  {
    id: 2,
    name: "ROLEX DAY-DATE 40",
    price: 179.00,
    category: "montres",
    description: "ROLEXE TABLEAU BLEU CIEL",
    images: [
      "images/sala.png",
      "images/spa.png",
    ]
  },

  {
    id: 3,
    name: "ROLEX SPRITE BATMAN",
    price: 169.00,
    category: "montres",
    description: "ساعة روليكس فخمة وأنيقة، قمة الفخامة والدقة الميكانيكية",
    images: [
      "images/rool01.jpeg",
      "images/rool1.jpeg"
    ],
  },

  {
    id: 4,
    name: "PORTEFEUILLE GOYARO",
    price: 119.00,
    category: "accessoires",
    description: "لمسة أنيقة لكل يوم",
    images: [
      "images/0001.jpg",
      "images/0002.jpg",
      "images/0003.jpg"
    ]
  },

  {
    id: 5,
    name: "AUDEMARS PIGUET ROYAL OAK",
    price: 169.00,
    category: "montres",
    description: "ساعة فخمة بتصميم راقٍ يليق بكل المناسبات.",
    images: [
      "images/00001.jpg",
      "images/00002.jpg",
      "images/00003.jpg"
    ]
  },

  {
    id: 6,
    name: "TISSOT ACIER",
    price: 169.00,
    category: "montres",
    description: "قمة الفخامة والدقة الميكانيكية",
    images: [
      "images/lj.png",
      "images/lk.png",
      "images/ln.png"
    ]
  },

  {
    id: 7,
    name: "CASIO CARRE",
    price: 169.00,
    category: "montres",
    description: "ساعة كلاسيكية فاخرة",
    images: [
      "images/11.png",
      "images/22.png",
      "images/33.png"
    ]
  },

  {
    id: 8,
    name: "D1 MILANO POLYCARBON",
    price: 149.00,
    category: "montres",
    description: "لمسة أنيقة  عربـــية",
    images: [
      "images/lo.png",
      "images/li.png",
    ]
  },
  {
    id: 9,
    name: "EMPORIO ARMANI",
    price: 149.00,
    category: "montres",
    description: "لمسة أنيقة خفيفة",
    images: [
      "images/hhh.jpeg",
    ]
  },

];


/* ================= OLD PRICE ================= */

function getOldPrice(product) {
  return Number(product.price) + 50;
}


/* ================= ELEMENTS ================= */

const productGrid =
  document.getElementById("product-grid");

const productSearch =
  document.getElementById("product-search");

const productsPrevButton =
  document.getElementById("products-prev");

const productsNextButton =
  document.getElementById("products-next");

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

let selectedColor = null;

let currentImageIndex = 0;

let productSlots = [
  1, 2, 3, 4, 5, 6, 7, 8, 9
];


/* ================= FAVORITES ================= */

const FAVORITES_KEY =
  "dama-favorites";


function loadFavorites() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          FAVORITES_KEY
        ) || "[]"
      );

    return Array.isArray(saved)
      ? saved.map(Number).filter(Number.isFinite)
      : [];

  } catch (error) {

    console.warn(
      "Impossible de charger les favoris:",
      error
    );

    return [];
  }
}


let favorites =
  loadFavorites();


function saveFavorites() {

  try {

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );

  } catch (error) {

    console.warn(
      "Impossible de sauvegarder les favoris:",
      error
    );
  }
}


function isFavorite(productId) {

  return favorites.includes(
    Number(productId)
  );
}


function toggleFavorite(productId) {

  productId =
    Number(productId);

  if (isFavorite(productId)) {

    favorites =
      favorites.filter(
        id => id !== productId
      );

    showToast(
      "Produit retiré des favoris !"
    );

  } else {

    favorites.push(productId);

    showToast(
      "Produit ajouté aux favoris !"
    );
  }

  saveFavorites();

  renderProducts();

  applySearch();
}


/* ================= TOAST ================= */

let toastTimer;


function showToast(message) {

  let toast =
    document.getElementById(
      "dama-toast"
    );

  if (!toast) {

    toast =
      document.createElement(
        "div"
      );

    toast.id =
      "dama-toast";

    Object.assign(
      toast.style,
      {
        position: "fixed",
        bottom: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#202020",
        color: "#ffffff",
        padding: "12px 20px",
        borderRadius: "10px",
        zIndex: "999999",
        fontSize: "14px",
        opacity: "0",
        transition: "opacity .3s ease",
        pointerEvents: "none"
      }
    );

    document.body.appendChild(
      toast
    );
  }

  toast.textContent =
    message;

  toast.style.opacity =
    "1";

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(
      () => {
        toast.style.opacity =
          "0";
      },
      500
    );
}


/* ================= CATEGORY FILTERS ================= */

let activeCategory =
  "all";


function renderCategoryFilters() {

  const searchContainer =
    document.querySelector(
      ".product-search"
    );

  if (
    !searchContainer ||
    document.getElementById(
      "dama-category-filters"
    )
  ) {
    return;
  }

  const filters =
    document.createElement(
      "div"
    );

  filters.id =
    "dama-category-filters";

  filters.className =
    "dama-category-filters";


  const categories = [

    {
      id: "all",
      label: "Tous les produits"
    },

    {
      id: "montres",
      label: "Montres"
    },

    {
      id: "bracelets",
      label: "Bracelets"
    },

    {
      id: "accessoires",
      label: "Accessoires"
    },

    {
      id: "favorites",
      label: "Favoris ♥️"
    }

  ];


  categories.forEach(
    category => {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "dama-filter-button";

      button.dataset.category =
        category.id;

      button.textContent =
        category.label;


      if (
        category.id ===
        activeCategory
      ) {

        button.classList.add(
          "active"
        );
      }


      button.addEventListener(
        "click",
        () => {

          activeCategory =
            category.id;

          filters
            .querySelectorAll(
              ".dama-filter-button"
            )
            .forEach(
              item => {

                item.classList.toggle(
                  "active",
                  item.dataset.category ===
                    activeCategory
                );

              }
            );

          applySearch();

        }
      );


      filters.appendChild(
        button
      );

    }
  );


  searchContainer.insertAdjacentElement(
    "afterend",
    filters
  );
}


/* ================= PRODUCT IMAGES ================= */

function getProductImages(product) {

  if (
    Array.isArray(product.images) &&
    product.images.length
  ) {

    return product.images.filter(
      Boolean
    );
  }

  if (product.image) {

    return [
      product.image
    ];
  }

  return [];
}


function getProductImage(product) {

  const images =
    getProductImages(
      product
    );

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

  if (!productGrid)
    return;

  productGrid.innerHTML =
    productSlots
      .map(
        (
          productId,
          slotIndex
        ) => {

          const product =
            products.find(
              item =>
                item.id ===
                productId
            );

          if (!product)
            return "";

          const favorite =
            isFavorite(
              product.id
            );


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
                  class="dama-favorite-btn ${
                    favorite
                      ? "is-favorite"
                      : ""
                  }"
                  data-favorite-id="${product.id}"
                  aria-label="${
                    favorite
                      ? "Retirer des favoris"
                      : "Ajouter aux favoris"
                  }"
                  aria-pressed="${favorite}"
                >
                  <span aria-hidden="true">
                    ${
                      favorite
                        ? "♥️"
                        : "♡"
                    }
                  </span>
                </button>

              </div>


              <div class="product-info">

                <h3>
                  ${product.name}
                </h3>


                ${
                  product.price > 0
                    ? `

                      <div
                        class="dama-price-line"
                      >

                        <strong
                          class="dama-current-price"
                        >
                          ${
                            Number(
                              product.price
                            ).toFixed(2)
                          } DH
                        </strong>

                        <del
                          class="dama-old-price"
                        >
                          ${
                            getOldPrice(
                              product
                            )
                          } DH
                        </del>

                      </div>


                      <p
                        class="dama-free-delivery"
                      >
                        Livraison gratuite
                      </p>

                    `
                    : `

                      <strong>
                        Prix bientôt disponible
                      </strong>

                    `
                }

              </div>

            </article>

          `;

        }
      )
      .join("");
}


/* ================= SEARCH ================= */

function applySearch() {

  const searchText =
    productSearch
      ? productSearch.value
          .toLowerCase()
          .trim()
      : "";


  const cards =
    document.querySelectorAll(
      ".product-card"
    );


  cards.forEach(
    card => {

      const productId =
        Number(
          card.dataset.productId
        );


      const product =
        products.find(
          item =>
            item.id ===
            productId
        );


      if (!product)
        return;


      const text =
        `${product.name} ${product.description}`
          .toLowerCase();


      const matchesSearch =
        text.includes(
          searchText
        );


      let matchesCategory =
        true;


      if (
        activeCategory ===
        "favorites"
      ) {

        matchesCategory =
          isFavorite(
            product.id
          );

      } else if (
        activeCategory !==
        "all"
      ) {

        matchesCategory =
          product.category ===
          activeCategory;
      }


      card.style.display =
        matchesSearch &&
        matchesCategory
          ? ""
          : "none";

    }
  );
}


if (productSearch) {

  productSearch.addEventListener(
    "input",
    applySearch
  );
}


/* ================= PRODUCT NAVIGATION ================= */

function nextProducts() {

  if (
    productSlots.length < 2
  )
    return;

  const firstProduct =
    productSlots.shift();

  productSlots.push(
    firstProduct
  );

  renderProducts();

  applySearch();
}


function previousProducts() {

  if (
    productSlots.length < 2
  )
    return;

  const lastProduct =
    productSlots.pop();

  productSlots.unshift(
    lastProduct
  );

  renderProducts();

  applySearch();
}


if (productsPrevButton) {

  productsPrevButton.addEventListener(
    "click",
    previousProducts
  );
}


if (productsNextButton) {

  productsNextButton.addEventListener(
    "click",
    nextProducts
  );
}


/* ================= BACK BUTTON ================= */

function createBackButton() {

  if (!productModal)
    return;


  if (
    document.getElementById(
      "dama-product-back-button"
    )
  ) {

    return;
  }


  const backButton =
    document.createElement(
      "button"
    );


  backButton.id =
    "dama-product-back-button";


  backButton.type =
    "button";


  backButton.innerHTML = `
    <span
      style="
        font-size:22px;
        line-height:1;
      "
    >
      ←
    </span>

    <span>
      Retour
    </span>
  `;


  Object.assign(
    backButton.style,
    {
      position: "absolute",
      top: "15px",
      left: "15px",
      zIndex: "20",
      display: "flex",
      alignItems: "center",
      gap: "7px",
      padding: "9px 13px",
      border: "1px solid rgba(184,139,90,.35)",
      borderRadius: "10px",
      background: "#202020",
      color: "#b88b5a",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(0,0,0,.15)"
    }
  );


  backButton.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      closeProductDetails();

    }
  );


  productModal.appendChild(
    backButton
  );
}


createBackButton();


/* ================= COLORS ================= */

function createColorSelector(product) {

  const oldSelector =
    document.getElementById(
      "dama-color-selector"
    );


  if (oldSelector) {

    oldSelector.remove();
  }


  selectedColor =
    null;


  if (
    !product.colors ||
    !Array.isArray(product.colors) ||
    product.colors.length === 0
  ) {

    return;
  }


  const selector =
    document.createElement(
      "div"
    );


  selector.id =
    "dama-color-selector";


  Object.assign(
    selector.style,
    {
      marginTop: "18px",
      marginBottom: "18px",
      width: "100%"
    }
  );


  const title =
    document.createElement(
      "div"
    );


  title.textContent =
    "Choisissez une couleur";


  Object.assign(
    title.style,
    {
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "10px",
      color: "#202020"
    }
  );


  const colorsContainer =
    document.createElement(
      "div"
    );


  Object.assign(
    colorsContainer.style,
    {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap"
    }
  );


  product.colors.forEach(
    (color, index) => {

      const colorButton =
        document.createElement(
          "button"
        );


      colorButton.type =
        "button";


      colorButton.dataset.color =
        color.name;


      colorButton.setAttribute(
        "aria-label",
        color.name
      );


      colorButton.title =
        color.name;


      Object.assign(
        colorButton.style,
        {
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          border:
            "2px solid #dddddd",
          background:
            color.value,
          cursor: "pointer",
          boxShadow:
            "0 2px 8px rgba(0,0,0,.15)",
          position: "relative"
        }
      );


      if (
        color.value.toLowerCase() ===
        "#ffffff"
      ) {

        colorButton.style.border =
          "2px solid #cccccc";
      }


      colorButton.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          selectedColor =
            color.name;


          colorsContainer
            .querySelectorAll(
              "button"
            )
            .forEach(
              button => {

                button.style.border =
                  button ===
                  colorButton
                    ? "3px solid #b88b5a"
                    : "2px solid #dddddd";

              }
            );


          showToast(
            `Couleur : ${color.name}`
          );

        }
      );


      colorsContainer.appendChild(
        colorButton
      );

    }
  );


  selector.appendChild(
    title
  );

  selector.appendChild(
    colorsContainer
  );


  if (productDetailDescription) {

    productDetailDescription.insertAdjacentElement(
      "afterend",
      selector
    );
  }
}


/* ================= PRODUCT DETAILS ================= */

function openProductDetails(
  productId
) {

  const product =
    products.find(
      item =>
        item.id ===
        productId
    );


  if (
    !product ||
    !productModal
  )
    return;


  selectedProduct =
    product;


  selectedQuantity =
    1;


  selectedColor =
    null;


  currentImageIndex =
    0;


  createBackButton();


  if (productDetailImage) {

    const images =
      getProductImages(
        product
      );


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
            draggable="false"
          >

          ${
            images.length > 1
              ? `

                <button
                  class="gallery-arrow gallery-prev"
                  type="button"
                  aria-label="Image précédente"
                >
                  ‹
                </button>

                <button
                  class="gallery-arrow gallery-next"
                  type="button"
                  aria-label="Image suivante"
                >
                  ›
                </button>

              `
              : ""
          }

          ${
            images.length > 1
              ? `

                <div
                  class="gallery-counter"
                >

                  <span
                    id="gallery-current"
                  >
                    1
                  </span>

                  /
                  ${images.length}

                </div>

              `
              : ""
          }

        </div>

      `;


      const prevButton =
        productDetailImage.querySelector(
          ".gallery-prev"
        );


      const nextButton =
        productDetailImage.querySelector(
          ".gallery-next"
        );


      if (prevButton) {

        prevButton.style.touchAction =
          "manipulation";


        prevButton.addEventListener(
          "click",
          event => {

            event.preventDefault();

            event.stopPropagation();

            changeDetailImage(
              -1
            );

          }
        );
      }


      if (nextButton) {

        nextButton.style.touchAction =
          "manipulation";


        nextButton.addEventListener(
          "click",
          event => {

            event.preventDefault();

            event.stopPropagation();

            changeDetailImage(
              1
            );

          }
        );
      }

    }
  }


  if (productDetailName) {

    productDetailName.textContent =
      product.name;
  }


  if (productDetailPrice) {

    if (product.price > 0) {

      productDetailPrice.innerHTML = `

        <strong
          class="dama-current-price"
        >
          ${
            Number(
              product.price
            ).toFixed(2)
          } DH
        </strong>

        <del
          class="dama-old-price"
        >
          ${
            getOldPrice(
              product
            )
          } DH
        </del>

        <p
          class="dama-free-delivery"
        >
          Livraison gratuite
        </p>

      `;

    } else {

      productDetailPrice.textContent =
        "Prix bientôt disponible";
    }
  }


  if (productDetailDescription) {

    productDetailDescription.textContent =
      product.description;
  }


  createColorSelector(
    product
  );


  if (detailQuantity) {

    detailQuantity.textContent =
      selectedQuantity;
  }


  productModal.classList.add(
    "active"
  );


  productModal.setAttribute(
    "aria-hidden",
    "false"
  );
}


/* ================= CLOSE PRODUCT ================= */

function closeProductDetails() {

  if (!productModal)
    return;


  productModal.classList.remove(
    "active"
  );


  productModal.setAttribute(
    "aria-hidden",
    "true"
  );
}


/* ================= CHANGE IMAGE ================= */

function changeDetailImage(
  direction
) {

  if (!selectedProduct)
    return;


  const images =
    getProductImages(
      selectedProduct
    );


  if (images.length < 2)
    return;


  currentImageIndex =
    (
      currentImageIndex +
      direction +
      images.length
    ) %
    images.length;


  const mainImage =
    document.getElementById(
      "detail-main-img"
    );


  const counter =
    document.getElementById(
      "gallery-current"
    );


  if (mainImage) {

    mainImage.src =
      images[
        currentImageIndex
      ];
  }


  if (counter) {

    counter.textContent =
      currentImageIndex + 1;
  }
}


if (closeProductButton) {

  closeProductButton.addEventListener(
    "click",
    closeProductDetails
  );
}


if (productModal) {

  productModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        productModal
      ) {

        closeProductDetails();
      }

    }
  );
}


/* ================= QUANTITY ================= */

if (detailMinus) {

  detailMinus.addEventListener(
    "click",
    () => {

      if (
        selectedQuantity > 1
      ) {

        selectedQuantity--;
      }


      if (detailQuantity) {

        detailQuantity.textContent =
          selectedQuantity;
      }

    }
  );
}


if (detailPlus) {

  detailPlus.addEventListener(
    "click",
    () => {

      selectedQuantity++;


      if (detailQuantity) {

        detailQuantity.textContent =
          selectedQuantity;
      }

    }
  );
}


/* ================= CART ================= */

function addToCart(
  productId,
  quantity = 1,
  color = null
) {

  const product =
    products.find(
      item =>
        item.id ===
        productId
    );


  if (!product)
    return;


  if (product.price <= 0) {

    alert(
      "Ce produit n'est pas encore disponible."
    );

    return;
  }


  const existingItem =
    cart.find(
      item =>
        item.id === productId &&
        item.color === color
    );


  if (existingItem) {

    existingItem.quantity +=
      quantity;

  } else {

    cart.push({

      ...product,

      quantity,

      color

    });
  }


  renderCart();


  showToast(
    color
      ? `🛒 ${product.name} — ${color}`
      : "🛒 Produit ajouté au panier !"
  );
}


/* ================= CART QUANTITY ================= */

function changeQuantity(
  productId,
  amount,
  color = null
) {

  const item =
    cart.find(
      product =>
        product.id === productId &&
        product.color === color
    );


  if (!item)
    return;


  item.quantity +=
    amount;


  if (item.quantity <= 0) {

    cart =
      cart.filter(
        product =>
          !(
            product.id === productId &&
            product.color === color
          )
      );
  }


  renderCart();
}


/* ================= REMOVE ================= */

function removeFromCart(
  productId,
  color = null
) {

  cart =
    cart.filter(
      item =>
        !(
          item.id === productId &&
          item.color === color
        )
    );


  renderCart();
}


/* ================= TOTAL ================= */

function getCartTotal() {

  return cart.reduce(
    (
      total,
      item
    ) =>
      total +
      Number(item.price) *
      Number(item.quantity),
    0
  );
}


function getCartQuantity() {

  return cart.reduce(
    (
      total,
      item
    ) =>
      total +
      Number(item.quantity),
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
        cart
          .map(
            item => `

              <div
                class="cart-item"
              >

                <div>

                  <strong>
                    ${item.name}
                  </strong>


                  ${
                    item.color
                      ? `

                        <p
                          style="
                            margin:5px 0;
                            color:#b88b5a;
                            font-size:13px;
                          "
                        >
                          Couleur :
                          ${item.color}
                        </p>

                      `
                      : ""
                  }


                  <p>

                    <strong>
                      ${item.price} DH
                    </strong>

                    <del
                      class="dama-old-price"
                    >
                      ${
                        getOldPrice(
                          item
                        )
                      } DH
                    </del>

                    ×
                    ${item.quantity}

                  </p>


                  <strong>
                    ${
                      Number(
                        item.price
                      ) *
                      Number(
                        item.quantity
                      )
                    } DH
                  </strong>


                  <p
                    class="dama-free-delivery"
                  >
                    Livraison gratuite
                  </p>

                </div>


                <div
                  class="cart-item-actions"
                >

                  <button
                    type="button"
                    data-action="decrease"
                    data-product-id="${item.id}"
                    data-color="${item.color || ""}"
                  >
                    −
                  </button>


                  <span>
                    ${item.quantity}
                  </span>


                  <button
                    type="button"
                    data-action="increase"
                    data-product-id="${item.id}"
                    data-color="${item.color || ""}"
                  >
                    +
                  </button>


                  <button
                    type="button"
                    data-action="remove"
                    data-product-id="${item.id}"
                    data-color="${item.color || ""}"
                  >
                    Supprimer
                  </button>

                </div>

              </div>

            `
          )
          .join("");
    }
  }


  if (cartCountElement) {

    cartCountElement.textContent =
      getCartQuantity();
  }


  if (cartTotalElement) {

    cartTotalElement.textContent =
      getCartTotal();
  }
}


/* ================= CART MODAL ================= */

function openCart() {

  if (!cartModal)
    return;


  cartModal.classList.add(
    "active"
  );


  cartModal.setAttribute(
    "aria-hidden",
    "false"
  );
}


function closeCart() {

  if (!cartModal)
    return;


  cartModal.classList.remove(
    "active"
  );


  cartModal.setAttribute(
    "aria-hidden",
    "true"
  );
}


if (openCartButton) {

  openCartButton.addEventListener(
    "click",
    openCart
  );
}


if (closeCartButton) {

  closeCartButton.addEventListener(
    "click",
    closeCart
  );
}


if (cartModal) {

  cartModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        cartModal
      ) {

        closeCart();
      }

    }
  );
}


/* ================= GLOBAL CLICK ================= */

document.addEventListener(
  "click",
  event => {

    const favoriteButton =
      event.target.closest(
        "[data-favorite-id]"
      );


    if (favoriteButton) {

      event.preventDefault();

      event.stopPropagation();


      toggleFavorite(
        Number(
          favoriteButton.dataset
            .favoriteId
        )
      );


      return;
    }


    const productCard =
      event.target.closest(
        ".product-card"
      );


    if (
      productCard &&
      !event.target.closest(
        "button"
      )
    ) {

      const productId =
        Number(
          productCard.dataset
            .productId
        );


      openProductDetails(
        productId
      );


      return;
    }


    const actionButton =
      event.target.closest(
        "[data-action]"
      );


    if (!actionButton)
      return;


    const productId =
      Number(
        actionButton.dataset
          .productId
      );


    const color =
      actionButton.dataset.color ||
      null;


    const action =
      actionButton.dataset.action;


    if (
      action ===
      "increase"
    ) {

      changeQuantity(
        productId,
        1,
        color
      );
    }


    if (
      action ===
      "decrease"
    ) {

      changeQuantity(
        productId,
        -1,
        color
      );
    }


    if (
      action ===
      "remove"
    ) {

      removeFromCart(
        productId,
        color
      );
    }

  }
);


/* ================= ORDER PAGE ================= */

function goToOrderPage() {

  if (
    cart.length === 0
  ) {

    alert(
      "Votre panier est vide. Ajoutez un produit d'abord."
    );

    return;
  }


  try {

    localStorage.setItem(
      "dama-order-cart",
      JSON.stringify(
        cart
      )
    );


    window.location.href =
      "commande.html";

  } catch (error) {

    console.error(
      "Erreur sauvegarde panier:",
      error
    );

    alert(
      "Impossible d'ouvrir la page de commande."
    );
  }
}


/* ================= ADD CART ================= */

if (detailAddCart) {

  detailAddCart.addEventListener(
    "click",
    () => {

      if (!selectedProduct)
        return;


      if (
        selectedProduct.colors &&
        selectedProduct.colors.length &&
        !selectedColor
      ) {

        alert(
          "Veuillez choisir une couleur."
        );

        return;
      }


      addToCart(
        selectedProduct.id,
        selectedQuantity,
        selectedColor
      );


      closeProductDetails();

      openCart();

    }
  );
}


/* ================= BUY NOW ================= */

if (detailBuyNow) {

  detailBuyNow.addEventListener(
    "click",
    () => {

      if (!selectedProduct)
        return;


      if (
        selectedProduct.colors &&
        selectedProduct.colors.length &&
        !selectedColor
      ) {

        alert(
          "Veuillez choisir une couleur."
        );

        return;
      }


      addToCart(
        selectedProduct.id,
        selectedQuantity,
        selectedColor
      );


      closeProductDetails();


      setTimeout(
        () => {

          goToOrderPage();

        },
        100
      );

    }
  );
}


/* ================= CHECKOUT ================= */

if (checkoutButton) {

  checkoutButton.addEventListener(
    "click",
    () => {

      goToOrderPage();

    }
  );
}


/* ================= START ================= */

renderProducts();

renderCart();

renderCategoryFilters();

applySearch();
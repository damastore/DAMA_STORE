// ============================================
// DAMA STORE
// 8 Products + Search + Arrows + Cart + Firebase
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
    name: "Montre Élégante",
    price: 199,
    description: "ساعة أنيقة للاستعمال اليومي",
    image: ""
  },

  {
    id: 2,
    name: "Sac Moderne",
    price: 249,
    description: "حقيبة عصرية وعملية",
    image: ""
  },

  {
    id: 3,
    name: "Écouteurs Sans Fil",
    price: 149,
    description: "سماعات لاسلكية",
    image: ""
  },

  {
    id: 4,
    name: "Lunettes de Soleil",
    price: 99,
    description: "نظارات شمسية بتصميم عصري",
    image: ""
  },

  {
    id: 5,
    name: "Produit 5",
    price: 0,
    description: "Description du produit",
    image: ""
  },

  {
    id: 6,
    name: "Produit 6",
    price: 0,
    description: "Description du produit",
    image: ""
  },

  {
    id: 7,
    name: "Produit 7",
    price: 0,
    description: "Description du produit",
    image: ""
  },

  {
    id: 8,
    name: "Produit 8",
    price: 0,
    description: "Description du produit",
    image: ""
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


/*
  8 خانات:
  4 فوق
  4 تحت
*/

let productSlots = [
  1, 2, 3, 4,
  5, 6, 7, 8
];


/* ================= IMAGE ================= */

function getProductImage(product) {

  if (!product.image) {

    return `
      <div class="empty-image">
        Image du produit
      </div>
    `;

  }

  return `
    <img
      src="${product.image}"
      alt="${product.name}"
      loading="lazy"
    >
  `;
}


/* ================= RENDER PRODUCTS ================= */

function renderProducts() {

  if (!productGrid) return;

  productGrid.innerHTML =
    productSlots.map(
      (productId, slotIndex) => {

        const product =
          products.find(
            item => item.id === productId
          );

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
              >
                ›
              </button>

            </div>

            <div class="product-info">

              <h3>
                ${product.name}
              </h3>

              ${
                product.price > 0
                ? `<strong>${product.price} DH</strong>`
                : `<strong>Prix bientôt disponible</strong>`
              }

            </div>

          </article>

        `;

      }
    ).join("");
}


/* ================= NEXT ARROW ================= */

function nextProduct(slotIndex) {

  const currentId =
    productSlots[slotIndex];

  let currentIndex =
    products.findIndex(
      product => product.id === currentId
    );

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
    productSearch.value
      .toLowerCase()
      .trim();

  const cards =
    document.querySelectorAll(".product-card");

  cards.forEach(card => {

    const productId =
      Number(
        card.dataset.productId
      );

    const product =
      products.find(
        item => item.id === productId
      );

    if (!product) return;

    const text =
      `${product.name} ${product.description}`
        .toLowerCase();

    if (text.includes(searchText)) {

      card.style.display = "";

    } else {

      card.style.display = "none";

    }

  });
}


if (productSearch) {

  productSearch.addEventListener(
    "input",
    applySearch
  );

}


/* ================= PRODUCT DETAILS ================= */

function openProductDetails(productId) {

  const product =
    products.find(
      item => item.id === productId
    );

  if (!product || !productModal) return;

  selectedProduct = product;

  selectedQuantity = 1;


  if (productDetailImage) {

    productDetailImage.innerHTML =
      getProductImage(product);

  }


  if (productDetailName) {

    productDetailName.textContent =
      product.name;

  }


  if (productDetailPrice) {

    productDetailPrice.textContent =
      product.price > 0
      ? `${product.price} DH`
      : "Prix bientôt disponible";

  }


  if (productDetailDescription) {

    productDetailDescription.textContent =
      product.description;

  }


  if (detailQuantity) {

    detailQuantity.textContent =
      selectedQuantity;

  }


  productModal.classList.add("active");

  productModal.setAttribute(
    "aria-hidden",
    "false"
  );

}


function closeProductDetails() {

  if (!productModal) return;

  productModal.classList.remove("active");

  productModal.setAttribute(
    "aria-hidden",
    "true"
  );

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

      if (event.target === productModal) {
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

      if (selectedQuantity > 1) {
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
  quantity = 1
) {

  const product =
    products.find(
      item => item.id === productId
    );

  if (!product) return;

  if (product.price <= 0) {

    alert(
      "Ce produit n'est pas encore disponible."
    );

    return;
  }


  const existingItem =
    cart.find(
      item => item.id === productId
    );


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


function changeQuantity(
  productId,
  amount
) {

  const item =
    cart.find(
      product => product.id === productId
    );

  if (!item) return;

  item.quantity += amount;


  if (item.quantity <= 0) {

    cart =
      cart.filter(
        product => product.id !== productId
      );

  }


  renderCart();
}


function removeFromCart(productId) {

  cart =
    cart.filter(
      item => item.id !== productId
    );

  renderCart();
}


function getCartTotal() {

  return cart.reduce(
    (total, item) =>
      total +
      item.price *
      item.quantity,
    0
  );

}


function getCartQuantity() {

  return cart.reduce(
    (total, item) =>
      total +
      item.quantity,
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

              <strong>
                ${item.name}
              </strong>

              <p>
                ${item.price} DH ×
                ${item.quantity}
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
              >
                +
              </button>

              <button
                type="button"
                data-action="remove"
                data-product-id="${item.id}"
              >
                Supprimer
              </button>

            </div>

          </div>

        `).join("");

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

  if (!cartModal) return;

  cartModal.classList.add("active");

  cartModal.setAttribute(
    "aria-hidden",
    "false"
  );

}


function closeCart() {

  if (!cartModal) return;

  cartModal.classList.remove("active");

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

      if (event.target === cartModal) {
        closeCart();
      }

    }
  );

}


/* ================= GLOBAL CLICK ================= */

document.addEventListener(
  "click",
  event => {

    /* سهم المنتج */

    const nextButton =
      event.target.closest(
        ".next-product"
      );

    if (nextButton) {

      event.stopPropagation();

      const slotIndex =
        Number(
          nextButton.dataset.nextSlot
        );

      nextProduct(slotIndex);

      return;
    }


    /* Product card */

    const productCard =
      event.target.closest(
        ".product-card"
      );

    if (
      productCard &&
      !event.target.closest("button")
    ) {

      const productId =
        Number(
          productCard.dataset.productId
        );

      openProductDetails(
        productId
      );

      return;
    }


    /* Cart */

    const actionButton =
      event.target.closest(
        "[data-action]"
      );

    if (!actionButton) return;


    const productId =
      Number(
        actionButton.dataset.productId
      );

    const action =
      actionButton.dataset.action;


    if (action === "increase") {

      changeQuantity(
        productId,
        1
      );

    }


    if (action === "decrease") {

      changeQuantity(
        productId,
        -1
      );

    }


    if (action === "remove") {

      removeFromCart(
        productId
      );

    }

  }
);


/* ================= ADD CART ================= */

if (detailAddCart) {

  detailAddCart.addEventListener(
    "click",
    () => {

      if (!selectedProduct) return;

      addToCart(
        selectedProduct.id,
        selectedQuantity
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

      if (!selectedProduct) return;

      addToCart(
        selectedProduct.id,
        selectedQuantity
      );

      closeProductDetails();

      openCart();

      setTimeout(
        () => {

          if (checkoutButton) {
            checkoutButton.click();
          }

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

      if (cart.length === 0) {

        alert(
          "Votre panier est vide. Ajoutez un produit d'abord."
        );

        return;
      }


      if (!orderForm) {

        alert(
          "Le formulaire de commande est introuvable."
        );

        return;
      }


      orderForm.hidden = false;

      orderForm.style.display =
        "block";

      orderForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }
  );

}


/* ================= ORDER ================= */

if (orderForm) {

  orderForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      if (cart.length === 0) {

        alert(
          "Votre panier est vide."
        );

        return;
      }


      const name =
        orderForm.querySelector(
          '[name="name"]'
        ).value.trim();

      const phone =
        orderForm.querySelector(
          '[name="phone"]'
        ).value.trim();

      const city =
        orderForm.querySelector(
          '[name="city"]'
        ).value.trim();

      const address =
        orderForm.querySelector(
          '[name="address"]'
        ).value.trim();


      if (
        !name ||
        !phone ||
        !city ||
        !address
      ) {

        alert(
          "عافاك عمّر جميع معلومات التوصيل."
        );

        return;
      }


      const order = {

        customer: {
          name,
          phone,
          city,
          address
        },

        products:
          cart.map(item => ({

            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,

            subtotal:
              item.price *
              item.quantity

          })),

        total:
          getCartTotal(),

        status:
          "nouvelle",

        createdAt:
          new Date().toISOString()

      };


      try {

        const ordersRef =
          ref(db, "orders");

        await push(
          ordersRef,
          order
        );


        console.log(
          "Commande enregistrée dans Firebase ✅"
        );


        if (orderMessage) {

          orderMessage.textContent =
            "✅ Votre commande a été envoyée avec succès !";

        }


        alert(
          "Commande confirmée ✅"
        );


        cart = [];

        renderCart();

        orderForm.reset();

        orderForm.hidden = true;

        orderForm.style.display =
          "none";


      } catch (error) {

        console.error(
          "Erreur lors de l'enregistrement:",
          error
        );


        if (orderMessage) {

          orderMessage.textContent =
            "❌ Une erreur est survenue. Veuillez réessayer.";

        }


        alert(
          "Impossible d'envoyer la commande."
        );

      }

    }
  );

}


/* ================= START ================= */

renderProducts();

renderCart();

applySearch();
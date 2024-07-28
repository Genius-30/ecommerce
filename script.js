const products = [
  {
    id: 1,
    title: "Wireless Bluetooth Headphones",
    price: 59.99,
    image: "./public/wireless-bluetooth-headset.png",
  },
  {
    id: 2,
    title: "Smartphone Stand",
    price: 19.99,
    image: "./public/smartphone-stand.png",
  },
  {
    id: 3,
    title: "Laptop Backpack",
    price: 79.99,
    image: "./public/laptop-bagpack.webp",
  },
  {
    id: 4,
    title: "Mechanical Keyboard",
    price: 89.99,
    image: "./public/keyboard.jpg",
  },
  {
    id: 5,
    title: "4K Ultra HD Monitor",
    price: 299.99,
    image: "./public/4k-monitor.png",
  },
  {
    id: 6,
    title: "Wireless Mouse",
    price: 25.99,
    image: "./public/wireless-mouse.png",
  },
  {
    id: 7,
    title: "Smart watch",
    price: 49.99,
    image: "./public/smart-watch.png",
  },
  {
    id: 8,
    title: "Smart Home Speaker",
    price: 39.99,
    image: "./public/smart-home-speaker.png",
  },
  {
    id: 9,
    title: "Fitness Tracker",
    price: 129.99,
    image: "./public/fitness-tracker.png",
  },
  {
    id: 10,
    title: "Mens t-shirt plain",
    price: 29.99,
    image: "./public/plain-t-shirt.jpeg",
  },
];

let productsContainer = document.querySelector(".products-container");

productsContainer.innerHTML = products
  .map((product) => {
    return `<div key=${product.id} class="product-card-container">
        <div>
          <img src=${product.image} class="product-image" alt=${product.title}>
        </div>
        <h4 class="product-title">${product.title}</h4>
        <p class="product-price">$ ${product.price}</p>
        <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>`;
  })
  .join("");

let cart = [];
const cartItemsContainer = document.querySelector(".cart-items");

if (cart.length == 0) {
  cartItemsContainer.innerHTML = `<li>Your cart is empty!</li>`;
}

document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const productId = parseInt(btn.dataset.id);
    addToCart(productId);
  });
});

function updateCartUI() {
  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const cartItem = document.createElement("li");
    cartItem.innerHTML = `<div class="cart-product-img-title-container">
          <div>
            <img src="${item.image}" class="cart-product-image" alt="${
      item.title
    }">
          </div>
          <h3>${item.title}</h3>
        </div>
        <div class="cart-product-quantity-container">
          <i class="fa-solid fa-square-minus dec-qty" data-id="${item.id}"></i>
          <p class="cart-product-quantity">${item.quantity}</p>
          <i class="fa-solid fa-square-plus inc-qty" data-id="${item.id}"></i>
        </div>
        <p id="cart-product-price">$ ${item.price.toFixed(2)}</p>
      `;
    cartItemsContainer.appendChild(cartItem);

    updateCartCount();
    updateCartTotal();

    attachEventListeners();
  });
}

function attachEventListeners() {
  document.querySelectorAll(".inc-qty").forEach((btn) => {
    btn.removeEventListener("click", handleIncrement);
    btn.addEventListener("click", handleIncrement);
  });

  document.querySelectorAll(".dec-qty").forEach((btn) => {
    btn.removeEventListener("click", handleDecrement);
    btn.addEventListener("click", handleDecrement);
  });
}

function handleIncrement(event) {
  const productId = event.target.dataset.id;
  changeQuantity(productId, 1);
}

function handleDecrement(event) {
  const productId = event.target.dataset.id;
  changeQuantity(productId, -1);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalItems;
}

let finalPrice;

function updateCartTotal() {
  const cartTotal = document.querySelector("#cart-total");
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  finalPrice = `$ ${totalPrice.toFixed(2)}`;
  cartTotal.textContent = finalPrice;
  document.getElementById("dialog-total").innerHTML = finalPrice;
}

function changeQuantity(productId, count) {
  const cartItem = cart.find((item) => item.id == productId);
  if (cartItem) {
    cartItem.quantity += count;
    if (cartItem.quantity <= 0) {
      cart = cart.filter((item) => item.id != productId);
    }
    updateCartUI();
  }
}

let cartIcon = document.querySelector(".cart-icon-container");
let cartContainer = document.querySelector(".cart-container");

cartIcon.addEventListener("click", () => {
  let isDisplayed = cartContainer.style.display === "flex";
  cartContainer.style.display = isDisplayed ? "none" : "flex";

  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
});

const dialog = document.getElementById("order-dialog");
const purchaseBtn = document.getElementById("purchase-btn");
const closeBtn = document.getElementById("close-dialog");
const orderElement = document.getElementById("order-id");

function generateOrderId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let orderId = "";

  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderId += characters[randomIndex];
  }

  return orderId;
}

const orderId = generateOrderId();

purchaseBtn.addEventListener("click", () => {
  if (cart.length !== 0) {
    cartContainer.style.display = "none";
    orderElement.innerHTML = orderId;
    dialog.showModal();
  }
});

const form = document.getElementById("form");
const orderDialog = document.getElementById("order-dialog");
const orderDialogContent = document.getElementById("order-dialog-content");
const orderDialogMessage = document.getElementById("order-dialog-message");
const orderMessageText = document.getElementById("order-message-text");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  orderDialogContent.classList.add("hidden");
  orderDialogMessage.classList.remove("hidden");

  orderMessageText.textContent = "Please wait...";
  orderMessageText.className = "order-message-text waiting";

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const htmlMessage = `Order Confirmation
  Thank you for your order!

  Order ID: '${orderId}'
  Total: ${finalPrice}
  Shipping Address: ${object.address}

  If you have any questions, please contact us.

  Thank you for shopping with us!`;

  const body = {
    access_key: object.access_key,
    email: object.email,
    subject: "Order Confirmation",
    message: htmlMessage,
  };
  const json = JSON.stringify(body);

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        orderMessageText.textContent = "Order placed successfully!";
        orderMessageText.className = "order-message-text success";
        cart = [];
        updateCartTotal();
        updateCartCount();
        updateCartUI();
        cartItemsContainer.innerHTML = `<li>Your cart is empty!</li>`;
      } else {
        orderMessageText.textContent = json.message;
        orderMessageText.className = "order-message-text failure";
      }
    })
    .catch((error) => {
      console.log(error);
      orderMessageText.textContent = "Something went wrong!";
      orderMessageText.className = "order-message-text failure";
    })
    .then(function () {
      form.reset();
      setTimeout(() => {
        orderDialog.close();
        orderDialogMessage.classList.add("hidden");
        orderDialogContent.classList.remove("hidden");
        orderMessageText.className = "order-message-text waiting";
      }, 3000);
    });
});

closeBtn.addEventListener("click", () => {
  dialog.close();
});

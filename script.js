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

document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const productId = parseInt(btn.dataset.id);
    addToCart(productId);
  });
});

function updateCartUI() {
  const cartItemsContainer = document.querySelector(".cart-items");
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<li class="empty-cart-message">Your cart is empty</li>`;
  } else {
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

function updateCartTotal() {
  const cartTotal = document.querySelector("#cart-total");
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  console.log(totalPrice);
  cartTotal.textContent = `$ ${totalPrice.toFixed(2)}`;
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

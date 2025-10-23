let menuItems = []
let category = []
let cart = [];

function $id(id) {return document.getElementById(id)}
function $class(className) {return document.getElementsByClassName(className)}

const menuGrid = $id("menu-grid");
const searchInput = $id("search-input");
const cartBtn = $id("cart-btn");
const cartCount = $id("cart-count");
const cartModal = $id("cart-modal");
const closeCart = $id("close-cart");
const cartItems = $id("cart-items");
const cartTotal = $id("cart-total");
const checkoutBtn = $id("checkout-btn");
const categoryBtns = document.querySelectorAll(".category-btn");
const categoryGroup = $id("category");

const user = $id("user");
const userInfo = $id("user-info");

const username = $id("username").textContent;
const userTable = $id("meja").textContent.split(" ")[1];
user.addEventListener('click', () => {
  userInfo.classList.toggle("hidden");y
});



// Render menu with quantity controls replacing Add button after adding
function renderMenu(items = menuItems) {
  menuGrid.innerHTML = "";
  if (items.length === 0) {
    menuGrid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">No items found</div>';
    return;
  }
  items.forEach((item) => {
    const inCart = cart.find((c) => c.id === item.id);
    const quantity = inCart ? inCart.quantity : 0;
    const card = document.createElement("div");
    card.className = "product-card bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 h-fit flex flex-col";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover" />
      <div class="p-4 flex flex-col justify-between flex-1">
      <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
      <p class="text-orange-500 font-medium text-lg">Rp. ${item.price}</p>
      <div class="mt-4">
            ${
              quantity === 0
                ? `<button class="add-to-cart-btn w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-all duration-300 ease-in-out" data-id="${item.id}">+ Tambah</button>`
                : `<div class="qty-control flex items-center justify-center space-x-2">
                    <button class="btn-minus bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition-all duration-200" data-id="${item.id}">-</button>
                    <input type="number" class="qty-input w-12 text-center border-0 bg-transparent font-semibold" value="${quantity}" readonly />
                    <button class="btn-plus bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded transition-all duration-200" data-id="${item.id}">+</button>
                  </div>`
            }
          </div>
        </div>
      `;
      menuGrid.appendChild(card);
  });
  // Add event listeners to add-to-cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      addToCart(id);
    });
  });
  // Add event listeners to plus/minus buttons
  document.querySelectorAll(".btn-plus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      changeQuantity(id, 1);
    });
  });
  document.querySelectorAll(".btn-minus").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      changeQuantity(id, -1);
    });
  });
}

categoryBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    // Update active button style
    categoryBtns.forEach((b) => {
      b.classList.remove("bg-orange-500", "text-white");
      b.classList.add("bg-gray-200", "text-gray-700");
    });
    this.classList.remove("bg-gray-200", "text-gray-700");
    this.classList.add("bg-orange-500", "text-white");
    renderMenuFiltered();
  });
});

// Add item to cart or increase quantity
function addToCart(id) {
  const item = menuItems.find((item) => item.id === id);
  const existingItem = cart.find((cartItem) => cartItem.id === id);
  if (existingItem) {existingItem.quantity += 1;} 
  else {cart.push({ ...item, quantity: 1 });}
  updateCartCount();
  updateCartModal();
  renderMenuFiltered();
  // Show brief confirmation
  const confirmation = document.createElement("div");
  confirmation.className = "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg";
  confirmation.textContent = `${item.name} added to cart!`;
  document.body.appendChild(confirmation);
  setTimeout(() => {
    confirmation.remove();
  }, 2000);
}

// Change quantity by delta (+1 or -1)
function changeQuantity(id, delta) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter((c) => c.id !== id);
  }
  updateCartCount();
  updateCartModal();
  renderMenuFiltered();
}

// Update cart count badge
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Update cart modal
function updateCartModal() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="text-center text-gray-500 py-10">Your cart is empty</div>';
    cartTotal.textContent = "Rp. 0";
    return;
  }
  let cartHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    cartHTML += `
      <div class="flex justify-between items-center py-3 border-b">
        <div>
          <h4 class="font-medium">${item.name}</h4>
          <p class="text-sm text-gray-500">Rp. ${item.price} × ${item.quantity}</p>
        </div>
        <div class="flex items-center">
          <button class="decrease-quantity px-2 py-1 bg-gray-200 rounded-l" data-id="${item.id}">-</button>
          <span class="px-2">${item.quantity}</span>
          <button class="increase-quantity px-2 py-1 bg-gray-200 rounded-r" data-id="${item.id}">+</button>
          <button class="remove-item ml-2 text-red-500" data-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    `;
  });
  cartItems.innerHTML = cartHTML;
  cartTotal.textContent = `Rp. ${total}`;
  // Add event listeners to cart item buttons
  document.querySelectorAll(".increase-quantity").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      changeQuantity(id, 1);
    });
  });
  document.querySelectorAll(".decrease-quantity").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      changeQuantity(id, -1);
    });
  });
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      cart = cart.filter((cartItem) => cartItem.id !== id);
      updateCartCount();
      updateCartModal();
      renderMenuFiltered();
    });
  });
}

// Filter menu items based on search and category
function filterMenu() {
  const searchTerm = searchInput.value.toLowerCase();
  const activeCategory = document.querySelector(".category-btn.bg-orange-500")?.getAttribute("data-category") || "all";
  let filteredItems = menuItems;
  // Apply category filter
  if (activeCategory !== "all") {
    filteredItems = filteredItems.filter(
      (item) => item.category === activeCategory.toLocaleLowerCase()
    );
  }
  // Apply search filter
  if (searchTerm) {
    filteredItems = menuItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
  }
  renderMenu(filteredItems);
}

// Render menu with current search and filter settings
function renderMenuFiltered() {filterMenu();}

searchInput.addEventListener("input", renderMenuFiltered);

cartBtn.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  updateCartModal();
});

closeCart.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});

$id("warning").addEventListener("click", () => {
  $id("warning").classList.add("hidden")
});

checkoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (cart.length === 0) return;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // const message = `${cart.map((item) => `- ${item.quantity}x ${item.name}\n`)} Total: Rp. ${total}`;
  // alert(message);
  const order = cart.map(item => { return {
    id: item.id,
    name: item.name,
    price: item.price,
    qty: item.quantity
  }});
  
  const data = {
    pelanggan: username,
    meja: userTable,
    order,
    total,
    status: "cooking"
  }

  const request = await fetch(`/api/order`, {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(data)
  });
  const respond = await request.json();
  if (respond) {
    window.location.href = "/order"
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetch(`/api/menus`, {method: "GET", headers: {"Content-Type":"application/json"}})
  .then(req => req.json())
  .then(data => {
    menuItems = data; 
    category = [...new Set(data.map(item => item.category))]
    renderMenu();
  });
  document.querySelector('[data-category="all"]').classList.remove("bg-gray-200", "text-gray-700");
  document.querySelector('[data-category="all"]').classList.add("bg-orange-500", "text-white");
});
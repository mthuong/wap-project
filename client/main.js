const serverUrl = "http://localhost:3000";
window.onload = function () {
  // Check user login or not
  checkLogin();

  document.getElementById("btnLogin").onclick = (event) => {
    event.preventDefault();
    login();
  };

  document.getElementById("btnLogout").onclick = (event) => {
    event.preventDefault();
    logout();
  };

  document.getElementById("placeOrderBtn").onclick = (event) => {
    event.preventDefault();
    placeCartOrder();
  };
};

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */
async function login() {
  let body = JSON.stringify({
    username: document.getElementById("inputUsername").value,
    password: document.getElementById("inputPassword").value,
  });
  let result = await fetch(`${serverUrl}/api/auth/login`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
  const json = await result.json();

  // Login failed
  if (result.status === 200 && json.status == "ok") {
    // Login success
    hideErrorMessage();

    sessionStorage.setItem("user", JSON.stringify(json));
    document.getElementById("login-form").reset();
    displayPageLogout(json.username);

    fetchProducts();
    fetchCart();
  } else {
    displayErrorMessage();
  }
}

const logout = () => {
  sessionStorage.removeItem("user");
  displayPageLogin();
  removeAllCartChild();
};

const checkLogin = () => {
  const user = getUser();
  if (!user) {
    // User has not logged in
    displayPageLogin();
  } else {
    // User logged in
    displayPageLogout(user.username);
    fetchProducts();
    fetchCart();
  }
};

function getUser() {
  try {
    let user = sessionStorage.getItem("user");
    user = JSON.parse(user);
    return user;
  } catch (error) {
    return undefined;
  }
}

function getAuthorization() {
  try {
    let user = sessionStorage.getItem("user");
    user = JSON.parse(user);
    return user.token;
  } catch (error) {
    return undefined;
  }
}

/* -------------------------------------------------------------------------- */
/*                                     UI                                     */
/* -------------------------------------------------------------------------- */
function displayPageLogin() {
  document.getElementById("welcomeMessage").style.display = "block";
  document.getElementById("logoutForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("storeContent").style.display = "none";
}

function displayPageLogout(username) {
  document.getElementById("welcomeMessage").style.display = "none";
  document.getElementById("logoutForm").style.display = "block";
  document.getElementById("username").textContent = username;
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("storeContent").style.display = "block";
}

const displayErrorMessage = () => {
  document.getElementById("errorMessage").style.display = "block";
};

const hideErrorMessage = () => {
  document.getElementById("errorMessage").style.display = "none";
};

/* -------------------------------------------------------------------------- */
/*                                Product List                                */
/* -------------------------------------------------------------------------- */
async function fetchProducts() {
  let result = await fetch(`${serverUrl}/api/products`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
  });
  const json = await result.json();

  if (result.status == 200) {
    displayProducts(json);
  } else {
    handleError(result.status, json);
  }
}

function displayProducts(products) {
  const table = document.getElementById("productsTbl");

  // Remove all child element if have
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  {
    // Add header
    const tr = document.createElement("tr");

    const thName = document.createElement("th");
    thName.textContent = "Name";
    const thPrice = document.createElement("th");
    thPrice.textContent = "Price";
    const thImage = document.createElement("th");
    thImage.textContent = "Image";
    const thStock = document.createElement("th");
    thStock.textContent = "Stock";
    const thActions = document.createElement("th");
    thActions.textContent = "Actions";

    tr.appendChild(thName);
    tr.appendChild(thPrice);
    tr.appendChild(thImage);
    tr.appendChild(thStock);
    tr.appendChild(thActions);

    table.appendChild(tr);
  }

  products.forEach((prod) => {
    const tr = document.createElement("tr");

    const name = document.createElement("td");
    name.textContent = prod.name;

    const price = document.createElement("td");
    price.textContent = `$${prod.price}`;

    const image = document.createElement("td");
    const img = document.createElement("img");
    img.src = prod.image;
    img.classList = "product-image";
    image.appendChild(img);
    image.style.textAlign = "center";

    const stock = document.createElement("td");
    stock.textContent = prod.stock;

    const actions = document.createElement("td");
    const cartIcon = document.createElement("i");
    if (prod.stock == 0) {
      cartIcon.className = "bi bi-cart-plus btn-add-cart-disable";
    } else {
      cartIcon.className = "bi bi-cart-plus btn-add-cart";
    }
    cartIcon.dataset.id = prod.id;
    cartIcon.onclick = function () {
      addProductToCart(prod);
    };
    cartIcon.style.fontSize = "2rem";
    actions.appendChild(cartIcon);
    actions.style.textAlign = "center";

    tr.appendChild(name);
    tr.appendChild(price);
    tr.appendChild(image);
    tr.appendChild(stock);
    tr.appendChild(actions);
    table.appendChild(tr);
  });
}

async function addProductToCart(prod) {
  if (prod.stock == 0) {
    return;
  }

  const body = JSON.stringify({
    id: prod.id,
  });
  let result = await fetch(`${serverUrl}/api/cart`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
    body,
  });
  const json = await result.json();

  if (result.status == 200) {
    // Update cart
    updateCartItem(json.item);
    updateTotalCart(json.total);
    showShoppingCart(json.total > 0);
  } else if (result.status == 212) {
    // Reload data
    fetchProducts();
    fetchCart();
    handleError(result.status, json);
  } else {
    handleError(result.status, json);
  }
}

/* -------------------------------------------------------------------------- */
/*                                Shopping Cart                               */
/* -------------------------------------------------------------------------- */
function showShoppingCart(isShow) {
  if (!isShow) {
    document.getElementById("emptyCartMessage").style.display = "block";
    document.getElementById("shoppingCartTable").style.display = "none";
  } else {
    document.getElementById("emptyCartMessage").style.display = "none";
    document.getElementById("shoppingCartTable").style.display = "block";
  }
}
function updateTotalCart(total) {
  const cartTotal = document.getElementById("cart-total");
  cartTotal.textContent = `Total: $${(Math.round(total * 100) / 100).toFixed(
    2
  )}`;
}

function updateCartItem(item) {
  const { id } = item;
  let tr = document.getElementById(`cart-item-id-${id}`);
  if (tr) {
    if (item.quantity == 0) {
      // Remove cart item in cart
      const table = document.getElementById("cartTbl");
      table.removeChild(tr);
      return;
    }
    // Update quantity and total
    const name = document.getElementById(`cart-item-name-${id}`);
    name.textContent = item.name;
    const price = document.getElementById(`cart-item-price-${id}`);
    price.textContent = `$${item.price}`;
    const total = document.getElementById(`cart-item-total-${id}`);
    total.textContent = `$${(Math.round(item.total * 100) / 100).toFixed(2)}`;
    const quantity = document.getElementById(`cart-item-quantity-${id}`);
    quantity.textContent = item.quantity;

    const add = document.getElementById(`cart-item-add-${item.id}`);
    if (item.quantity >= item.product.stock) {
      add.classList = "bi bi-plus-circle-fill btn-add btn-disable";
    } else {
      add.classList = "bi bi-plus-circle-fill btn-add";
    }
    add.onclick = function () {
      addQuantity(item);
    };

  } else {
    renderCartItem(item);
  }
}

async function fetchCart() {
  let result = await fetch(`${serverUrl}/api/cart`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
  });

  if (result.status == 200) {
    const json = await result.json();
    if (json.total == 0) {
      showShoppingCart(false);
    } else {
      showShoppingCart(true);

      updateTotalCart(json.total);

      renderCart(json.items);
    }
  } else {
    // Handle error
    handleError(result.status, json);
  }
}

function removeAllCartChild() {
  const table = document.getElementById("cartTbl");

  // Remove all child element if have
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

function renderCart(items) {
  const table = document.getElementById("cartTbl");

  removeAllCartChild();

  {
    // Add header
    const tr = document.createElement("tr");

    const thName = document.createElement("th");
    thName.textContent = "Name";
    thName.classList = "th-cart";
    const thPrice = document.createElement("th");
    thPrice.textContent = "Price";
    thPrice.classList = "th-cart";
    const thTotal = document.createElement("th");
    thTotal.textContent = "Total";
    thTotal.classList = "th-cart";
    const thQuantity = document.createElement("th");
    thQuantity.textContent = "Quantity";
    thQuantity.classList = "th-cart";

    tr.appendChild(thName);
    tr.appendChild(thPrice);
    tr.appendChild(thTotal);
    tr.appendChild(thQuantity);

    table.appendChild(tr);
  }

  items.forEach((prod) => {
    renderCartItem(prod);
  });
}

function renderCartItem(prod) {
  const table = document.getElementById("cartTbl");

  const tr = document.createElement("tr");
  tr.id = `cart-item-id-${prod.id}`;

  const name = document.createElement("td");
  name.id = `cart-item-name-${prod.id}`;
  name.textContent = prod.name;

  const price = document.createElement("td");
  price.id = `cart-item-price-${prod.id}`;
  price.textContent = `$${prod.price}`;

  const total = document.createElement("td");
  total.id = `cart-item-total-${prod.id}`;
  total.textContent = `$${(Math.round(prod.total * 100) / 100).toFixed(2)}`;

  const quantity = document.createElement("td");
  quantity.classList = "quantity";
  const minus = document.createElement("i");
  minus.classList = "bi bi-dash-circle-fill btn-minus";
  minus.style.fontSize = "2rem";
  minus.id = `cart-item-minus-${prod.id}`;
  minus.onclick = function () {
    reduceQuantity(prod);
  };
  quantity.appendChild(minus);

  const input = document.createElement("div");
  input.id = `cart-item-quantity-${prod.id}`;
  input.classList = "cart-item-quantity";
  input.textContent = prod.quantity;
  quantity.appendChild(input);

  const add = document.createElement("i");
  if (prod.quantity >= prod.product.stock) {
    add.classList = "bi bi-plus-circle-fill btn-add btn-disable";
  } else {
    add.classList = "bi bi-plus-circle-fill btn-add";
  }
  add.id = `cart-item-add-${prod.id}`;
  add.style.fontSize = "2rem";
  add.onclick = function () {
    addQuantity(prod);
  };
  quantity.appendChild(add);

  tr.appendChild(name);
  tr.appendChild(price);
  tr.appendChild(total);
  tr.appendChild(quantity);

  table.appendChild(tr);
}

async function reduceQuantity(cartItem) {
  const body = JSON.stringify({
    quantity: -1,
  });
  let result = await fetch(`${serverUrl}/api/cart/${cartItem.id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
    body,
  });
  const json = await result.json();

  if (result.status == 200) {
    // Update cart
    updateCartItem(json.item);
    updateTotalCart(json.total);
    showShoppingCart(json.total > 0);
  } else {
    handleError(result.status, json);
  }
}

function canAddMoreQuantity(cartItem) {
  return cartItem.quantity < cartItem.product.stock;
}

async function addQuantity(cartItem) {
  if (!canAddMoreQuantity(cartItem)) {
    return;
  }

  const body = JSON.stringify({
    quantity: 1,
  });
  let result = await fetch(`${serverUrl}/api/cart/${cartItem.id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
    body,
  });
  const json = await result.json();

  if (result.status == 200) {
    // Update cart
    updateCartItem(json.item);
    updateTotalCart(json.total);
    showShoppingCart(json.total > 0);
  } else if (result.status == 213) {
    fetchCart();
    fetchProducts();
    handleError(result.status, json);
  } else {
    handleError(result.status, json);
  }
}

async function placeCartOrder() {
  let result = await fetch(`${serverUrl}/api/cart/place-order`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthorization(),
    },
  });
  const json = await result.json();

  if (result.status == 200) {
    updateTotalCart(0);
    renderCart([]);
    showShoppingCart(false);
    alert(json.message);
    fetchProducts();
  } else if (result.status == 211 || result.status == 210) {
    // Place order failed, reload data
    alert(json.message);
    fetchProducts();
    fetchCart();
  } else {
    handleError(result.status, json);
  }
}

/* -------------------------------------------------------------------------- */
/*                                Handle error                                */
/* -------------------------------------------------------------------------- */
function handleError(status, error) {
  if (status == 211) {
    // Place order failed
    alert(error.message);
  } else if (status == 401) {
    alert(error.message || "Un Authorization");
    logout();
  } else {
    alert(error.message || "Unknown error");
  }
}

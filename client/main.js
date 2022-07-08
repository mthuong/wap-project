const serverUrl = 'http://localhost:3000'
window.onload = function() {
  // Check user login or not
  checkLogin();

  document.getElementById('btnLogin').onclick = (event) => {
    event.preventDefault();
    login();
  }

  document.getElementById('btnLogout').onclick = (event) => {
    event.preventDefault();
    logout();
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */
const login = async () => {
  let body = JSON.stringify({
    username: document.getElementById('inputUsername').value,
    password: document.getElementById('inputPassword').value
  });
  let result = await fetch(`${serverUrl}/api/auth/login`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  });
  const json = await result.json();

  // Login failed
  if (json.status == 'error') {
    displayErrorMessage();
  } else {
    // Login success
    hideErrorMessage();

    sessionStorage.setItem('user', JSON.stringify(json));
    document.getElementById('login-form').reset();
    displayPageLogout(json.username);

    getProducts();
  }
}

const logout = () => {
  sessionStorage.removeItem('user');
  displayPageLogin();
}

const checkLogin = () => {
  let user = sessionStorage.getItem('user');
  user = JSON.parse(user);
  if (!user) {
    // User has not logged in
    displayPageLogin();
  } else {
    // User logged in
    displayPageLogout(user.username);
    getProducts();
  }
}

function getAuthorization() {
  let user = sessionStorage.getItem('user');
  user = JSON.parse(user);
  return user.token;
}

/* -------------------------------------------------------------------------- */
/*                                     UI                                     */
/* -------------------------------------------------------------------------- */
function displayPageLogin() {
  document.getElementById('welcomeMessage').style.display = 'block';
  document.getElementById('logoutForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

function displayPageLogout(username) {
  document.getElementById('welcomeMessage').style.display = 'none';
  document.getElementById('logoutForm').style.display = 'block';
  document.getElementById('username').textContent = username;
  document.getElementById('loginForm').style.display = 'none';
}

const displayErrorMessage = () => {
  document.getElementById('errorMessage').style.display = 'block';
}

const hideErrorMessage = () => {
  document.getElementById('errorMessage').style.display = 'none';
}

/* -------------------------------------------------------------------------- */
/*                                Product List                                */
/* -------------------------------------------------------------------------- */
const getProducts = async () => {
  let result = await fetch(`${serverUrl}/api/products`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthorization(),
    },
  });
  const json = await result.json();

  displayProducts(json);
}

function displayProducts(products) {
  const table = document.getElementById('productsTbl');

  products.forEach(prod => {
    const tr = document.createElement('tr');

    const name = document.createElement('td');
    name.textContent = prod.name;

    const price = document.createElement('td');
    price.textContent = `$${prod.price}`;

    const image = document.createElement('td');
    const img = document.createElement('img');
    img.src = prod.image;
    img.height = 50;
    image.appendChild(img);
    image.style.textAlign = 'center';

    const stock = document.createElement('td');
    stock.textContent = prod.stock;

    const actions = document.createElement('td');
    const cartIcon = document.createElement('i');
    cartIcon.className = "bi bi-cart-plus";
    cartIcon.style.fontSize = '2rem';
    actions.appendChild(cartIcon);
    actions.style.textAlign = 'center';

    tr.appendChild(name);
    tr.appendChild(price);
    tr.appendChild(image);
    tr.appendChild(stock);
    tr.appendChild(actions);
    table.appendChild(tr);
  });
}
let cart = JSON.parse(localStorage.getItem('myCart')) || [];
let allProducts = [];

function updateNavbarCount() {
    const el = document.getElementById('cart-count');
    if (el) el.innerText = cart.length;

    const user = JSON.parse(localStorage.getItem('user'));
    const isAuth = localStorage.getItem('auth');
    const greet = document.getElementById('user-greeting');
    const loginBtn = document.getElementById('login-nav');
    const logoutBtn = document.getElementById('logout-btn');

    if (isAuth && user && greet) {
        greet.innerText = `Hi, ${user.name}`;
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('auth');
    window.location.reload();
}

async function getProducts() {
    const list = document.getElementById('product-list');
    if (!list) return;

    try {
        const res = await fetch('**https**://fakestoreapi.com/products');
        allProducts = await res.json();
        renderProducts(allProducts);
    } catch (e) {
        list.innerHTML = "<h4 class='text-center w-100'>Error connecting to API.</h4>";
    }
}

function renderProducts(products) {
    const list = document.getElementById('product-list');
    if (products.length === 0) {
        list.innerHTML = "<h3 class='text-center w-100 py-5'>No matching products found.</h3>";
        return;
    }
    list.innerHTML = products.map(p => `
        <div class="col-12 col-md-6 col-lg-3">
            <div class="card h-100 p-3 shadow-sm bg-white">
                <img src="${p.image}" class="card-img-top p-2" style="height:160px; object-fit:contain;">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-truncate">${p.title}</h6>
                    <p class="text-primary fw-bold mb-3">$${p.price}</p>
                    <div class="mt-auto">
                        <a href="product-details.html?id=${p.id}" class="btn btn-sm btn-outline-dark w-100 mb-2">View Product</a>
                        <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.image}')" class="btn btn-sm btn-primary w-100">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>`).join('');
}

const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p =>
            p.title.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
        );
        renderProducts(filtered);
    });
}

function addToCart(id, title, price, image) {
    cart.push({ id, title, price, image });
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateNavbarCount();
    alert("Added to cart!");
}

getProducts();
updateNavbarCount();

// Obtener elementos del DOM
const productContainer = document.getElementById('product-list');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const btnBuyElement = document.getElementById('btn-buy');
const totalCartCountElement = document.getElementById('total-products');
const categoryFilter = document.getElementById('category-filter');
const searchInput = document.getElementById('search');

let carrito = []; // Inicialización del carrito

// Renderizar productos en pantalla
function renderProductos(productList = products) {
    productContainer.innerHTML = productList.length
        ? productList.map(product => `
                <div class="col">
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column justify-content-end">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">S/ ${parseFloat(product.price).toFixed(2)}</p>
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">Añadir al carrito</button>
                </div>
            </div>
            </div>
        `).join('')
        : '<p class="text-center text-muted">No se encontraron productos.</p>';
}

// Manejo del clic en "Añadir al carrito"
productContainer.addEventListener('click', event => {
    if (!event.target.classList.contains('add-to-cart')) return;
    const productId = event.target.dataset.id;
    const product = products.find(p => p.id == productId);
    addToCarritoItem(product);

    // Mostrar alerta de producto añadido
    const addAlert = document.getElementById('add-alert');
    addAlert.classList.remove('hide');
    setTimeout(() => addAlert.classList.add('hide'), 3000);
});

// Agregar producto al carrito
function addToCarritoItem(product) {
    const existingProduct = carrito.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        carrito.push({ ...product, price: parseFloat(product.price), quantity: 1 });
    }
    updateCartUI();
}

// Manejo de cambios en cantidad y eliminación de productos
document.querySelector('.tbody').addEventListener('click', event => {
    const button = event.target;
    const productId = parseInt(button.dataset.id);
    const product = carrito.find(item => item.id === productId);
    if (!product) return;

    if (button.classList.contains('increase')) product.quantity++;
    if (button.classList.contains('decrease') && product.quantity > 1) product.quantity--;
    if (button.classList.contains('remove-item')) {
        carrito = carrito.filter(item => item.id !== productId);
        showRemoveAlert();
    }

    updateCartUI();
});

// Alerta de eliminación de producto
function showRemoveAlert() {
    const removeAlert = document.getElementById('remove-alert');
    removeAlert.classList.remove('hide');
    setTimeout(() => removeAlert.classList.add('hide'), 3000);
}

// Actualizar UI del carrito
function updateCartUI() {
    const tbody = document.querySelector('.tbody');
    tbody.innerHTML = carrito.map((item, index) => `
        <tr class="item" data-id="${item.id}">
            <th scope="row">${index + 1}</th>
            <td>
                <img src="${item.image}" width="50" height="50">
                <p class="lh-1 my-1">${item.name}</p>
                <span>S/ ${item.price.toFixed(2)}</span>
            </td>
            <td class="align-middle">S/ ${(item.price * item.quantity).toFixed(2)}</td>
            <td class="align-middle">
                <div class="d-flex">
                    <button class="btn btn-sm btn-secondary decrease" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input form-control form-control-sm text-center mx-1" data-id="${item.id}" value="${item.quantity}" min="1" style="width: 40px">
                    <button class="btn btn-sm btn-secondary increase" data-id="${item.id}">+</button>
                </div>
            </td>
            <td class="align-middle">
                <a class="btn btn-sm btn-danger remove-item bi bi-trash-fill" data-id="${item.id}"></a>
            </td>
        </tr>
    `).join('');

    const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    
    cartCountElement.textContent = totalItems;
    cartTotalElement.textContent = totalPrice;
    totalCartCountElement.textContent = totalItems;
}

// Filtrar productos por categoría
categoryFilter.addEventListener('change', event => {
    const categoryId = event.target.value;
    const filteredProducts = categoryId === "all" ? products : products.filter(product => product.category == categoryId);
    renderProductos(filteredProducts);
});

// Búsqueda de productos en tiempo real
searchInput.addEventListener('input', event => {
    const query = event.target.value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
    renderProductos(filteredProducts);
});

// Comprar (mostrar resumen)
btnBuyElement.addEventListener('click', () => {
    if (!carrito.length) {
        alert("El carrito está vacío.");
        return;
    }

    let productDetails = carrito.map(item => 
        `Producto: ${item.name}\nCantidad: ${item.quantity}\nPrecio: S/ ${item.price.toFixed(2)}`
    ).join("\n\n");

    alert(`Detalles de la compra:\n\n${productDetails}\n\nTotal: S/ ${cartTotalElement.textContent}`);
});

// Cargar categorías dinámicamente
function loadCategories() {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    renderProductos();
    updateCartUI();
});

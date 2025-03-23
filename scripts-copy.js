// Obtener el contenedor de productos y el contador del carrito
const productContainer = document.getElementById('product-list');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const btnBuyElement = document.getElementById('btn-buy');

const totalCartCountElement = document.getElementById('total-products');

// Inicialización del carrito
let carrito = [];

// Función para renderizar productos dinámicamente
function renderProductos() {
    productContainer.innerHTML = ''; // Limpiar el contenedor

    // Recorrer el array de productos
    products.forEach(product => {
        const card = document.createElement('div');
        // Crear el contenido de la tarjeta
        card.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body d-flex flex-column justify-content-end">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">S/ ${parseFloat(product.price).toFixed(2)}</p>
                    <button class="btn btn-primary add-to-cart" data-id="${product.id}">Añadir al carrito</button>
                </div>
            </div>
        `;

        // Añadir la tarjeta al contenedor de productos
        productContainer.appendChild(card);
    });
}

// Función para manejar el click en "Añadir al carrito"
function handleAddToCart(event) {
    if (!event.target.classList.contains('add-to-cart')) return;

    const productId = event.target.dataset.id;
    const product = products.find(p => p.id == productId);
    addToCarritoItem(product);

    // Mostrar la alerta de "Producto Añadido"
    const addAlert = document.getElementById('add-alert');
    addAlert.classList.remove('hide');
    setTimeout(() => {
        addAlert.classList.add('hide');
    }, 3000); // La alerta se oculta después de 3 segundos
}

// Función para agregar un producto al carrito
function addToCarritoItem(product) {
    const newItem = {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        image: product.image
    };

    // Verificar si el producto ya está en el carrito
    const existingProduct = carrito.find(item => item.id === newItem.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        carrito.push(newItem);
    }

    updateCartUI();
    renderCartItems(); // Renderizar los productos del carrito
}

// Función para manejar los clics en los botones de incrementar y decrementar la cantidad
function handleQuantityChange(event) {
    const button = event.target;

    // Asegurarnos que sea uno de los botones que queremos (incrementar o decrementar)
    if (button.classList.contains('increase') || button.classList.contains('decrease')) {
        const productId = button.dataset.id;
        const product = carrito.find(item => item.id === parseInt(productId));

        if (!product) return; // Si el producto no se encuentra, no hacemos nada

        if (button.classList.contains('increase')) {
            // Aumentar la cantidad en 1
            product.quantity++;
        } else if (button.classList.contains('decrease') && product.quantity > 1) {
            // Disminuir la cantidad en 1 (no permitir menos de 1)
            product.quantity--;
        }

        // Actualizar la UI
        updateCartUI();
        renderCartItems();
    }
}

// Función para manejar la actualización de la cantidad desde el input
function handleQuantityInput(event) {
    const input = event.target;
    const productId = input.dataset.id;
    let quantity = parseInt(input.value, 10);

    // Validamos que la cantidad sea un número válido y mayor a 0
    if (isNaN(quantity) || quantity <= 0) {
        // Si la cantidad es inválida, restauramos la cantidad original
        const product = carrito.find(item => item.id === parseInt(productId));
        if (product) {
            input.value = product.quantity; // Restaurar valor anterior
        }
        return;
    }

    // Actualizar cantidad en el carrito
    const product = carrito.find(item => item.id === parseInt(productId));
    if (product) {
        product.quantity = quantity;
    }

    // Actualizar la UI del carrito
    updateCartUI();
    renderCartItems();
}


// Función para eliminar un producto del carrito
function handleRemoveItem(event) {
  const button = event.target.closest('.remove-item'); // Asegura que el clic es en el botón remove-item

  if (!button) return; // Si el clic no es sobre el botón remove-item, no hace nada

  const productId = button.dataset.id; // Obtener el ID del producto desde el dataset

  // Eliminar el producto del carrito
  carrito = carrito.filter(item => item.id !== parseInt(productId));

  // Actualizar la UI
  updateCartUI();
  renderCartItems(); // Volver a renderizar los productos del carrito

  // Mostrar la alerta de "Producto removido"
  const removeAlert = document.getElementById('remove-alert');
  removeAlert.classList.remove('hide');
  setTimeout(() => {
      removeAlert.classList.add('hide');
  }, 3000); // La alerta se oculta después de 3 segundos
}

// Agregar el evento de eliminar
document.addEventListener('click', (event) => {
  // Si el clic es en un botón de eliminar
  if (event.target.closest('.remove-item')) {
      handleRemoveItem(event);
  }
});


// Función para renderizar los productos en el carrito
function renderCartItems() {
    const tbody = document.querySelector('.tbody');
    tbody.innerHTML = ''; // Limpiar la tabla

    carrito.forEach((item, index) => {
        const row = document.createElement('tr');
        row.classList.add('item');
        row.dataset.id = item.id;

        row.innerHTML = `
            <th scope="row" class="align-middle">${index + 1}</th>
            <td>
              <img src="${item.image}" alt="${item.name}" width="50" height="50">
              <p class="lh-1 my-1">${item.name}</p>
              <span>S/ ${item.price.toFixed(2)}</span>
            </td>
            <td class="align-middle">S/ ${(item.price * item.quantity).toFixed(2)}</td>
            <td class="align-middle">
              <div class="d-flex w-50">
                <button class="btn btn-sm btn-secondary decrease" data-id="${item.id}">-</button>
                <input type="number" class="quantity-input form-control form-control-sm text-center mx-1" data-id="${item.id}" value="${item.quantity}" min="1" style="width: 50px;">
                <button class="btn btn-sm btn-secondary increase" data-id="${item.id}">+</button>
              </div>
            </td>
            <td class="align-middle">
              <button class="btn btn-sm btn-danger remove-item" data-id="${item.id}"><i class="bi bi-trash-fill"></i></button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Actualizar el total y el contador
    updateCartUI();

    // Delegación de eventos para cambios en el input de cantidad (cuando pierde el foco o presiona Enter)
    document.querySelector('.tbody').addEventListener('blur', handleQuantityInput, true);
    document.querySelector('.tbody').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleQuantityInput(event);
            event.target.blur(); // Forzar que el input pierda el foco tras Enter
        }
    });

}

// Función para actualizar la interfaz del carrito
function updateCartUI() {
    const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

    // Actualizar el contador de productos y el total
    cartCountElement.textContent = totalItems;
    cartTotalElement.textContent = totalPrice;
    totalCartCountElement.textContent= totalItems;
}

// Función para finalizar la compra
btnBuyElement.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let productDetails = carrito.map(item => {
        return `Producto: ${item.name}\nCantidad: ${item.quantity}\nPrecio: S/ ${item.price.toFixed(2)}` ;
    }).join("\n\n");

    alert(`Detalles de la compra:\n\n${productDetails}\n\nTotal: S/${cartTotalElement.textContent}`);
});

// Delegación de eventos para el carrito: Incremento, decremento y eliminación
document.querySelector('.tbody').addEventListener('click', (event) => {
    if (event.target.classList.contains('increase') || event.target.classList.contains('decrease')) {
        handleQuantityChange(event);
    }
    
    if (event.target.classList.contains('remove-item')) {
        handleRemoveItem(event);
    }
});

// Delegación de eventos para el contenedor de productos (añadir al carrito)
productContainer.addEventListener('click', handleAddToCart);

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    renderProductos(); // Renderizar los productos
    updateCartUI(); // Actualizar la interfaz del carrito
});





const categoryFilter = document.getElementById('category-filter');

// Función para llenar dinámicamente el select de categorías
function loadCategories() {
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

// Función para renderizar productos según la categoría seleccionada
function renderFilteredProducts(categoryId) {
    productContainer.innerHTML = ''; // Limpiar la lista de productos

    let filteredProducts = categoryId === "all" 
        ? products // Si es "Todos", mostramos todos los productos
        : products.filter(product => product.category == categoryId); // Filtrar productos por categoría

    // Renderizar los productos filtrados
    if (filteredProducts.length === 0) {
        productContainer.innerHTML = '<p class="text-center text-muted">No hay productos en esta categoría.</p>';
    } else {
        filteredProducts.forEach(product => {
            const card = document.createElement('div');

            card.innerHTML = `
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column justify-content-end">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">S/ ${parseFloat(product.price).toFixed(2)}</p>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Añadir al carrito</button>
                    </div>
                </div>
            `;

            productContainer.appendChild(card);
        });
    }
}

// Evento para filtrar productos cuando cambia la categoría seleccionada
categoryFilter.addEventListener('change', (event) => {
    renderFilteredProducts(event.target.value);
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();  // Llenar el select de categorías
    renderFilteredProducts("all"); // Mostrar todos los productos al inicio
});




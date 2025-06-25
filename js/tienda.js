// =====================================================
// Archivo: tienda.js
// Descripción: Lógica principal de la página de inicio de la tienda ADS Store.
// Carga productos, banners, maneja eventos de navegación y muestra productos destacados.
// Autor: [Tu Nombre o Equipo]
// Fecha: [Fecha de última edición]
// =====================================================

/**
 * Variable global que almacena los productos en el carrito (solo para compatibilidad).
 * @type {Array<Object>}
 */
let cart = [];

/**
 * Referencia al elemento del contador de carrito en la interfaz.
 * @type {HTMLElement}
 */
const cartCount = document.getElementById('cart-count');

/**
 * Clase que representa el carrito de compras y su lógica asociada.
 * Maneja almacenamiento en localStorage, actualización de la interfaz y notificaciones.
 */
class Carrito {
    /**
     * Inicializa el carrito desde localStorage o vacío.
     * Actualiza el contador visual.
     */
    constructor() {
        this.items = JSON.parse(localStorage.getItem('carrito')) || [];
        this.updateCartCount();
    }

    /**
     * Agrega un producto al carrito. Si ya existe, incrementa la cantidad.
     * @param {Object} producto - Objeto con los datos del producto (id, nombre, descripcion, precio, imagen).
     * @returns {void}
     * @example
     * carrito.addItem({id: 'abc', nombre: 'Producto', precio: 1000, imagen: 'img.jpg'})
     */
    addItem(producto) {
        const existingItem = this.items.find(item => item.id === producto.id);
        if (existingItem) {
            existingItem.cantidad += 1;
        } else {
            this.items.push({...producto, cantidad: 1});
        }
        this.save();
        this.updateCartCount();
        this.showNotification('Producto agregado al carrito');
    }

    /**
     * Guarda el carrito en localStorage.
     * @returns {void}
     */
    save() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    /**
     * Actualiza el contador visual del carrito en la interfaz.
     * @returns {void}
     */
    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.cantidad, 0);
        document.getElementById('cart-count').textContent = count;
    }

    /**
     * Muestra una notificación flotante en pantalla.
     * @param {string} message - Mensaje a mostrar.
     * @returns {void}
     */
    showNotification(message) {
        // Crear el elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;

        // Añadir la notificación al body
        document.body.appendChild(notification);

        // Mostrar la notificación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Ocultar y eliminar la notificación después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// =============================
// Inicialización global del carrito
// =============================
/**
 * Instancia global del carrito para toda la tienda.
 * @type {Carrito}
 */
const carrito = new Carrito();

/**
 * Muestra una notificación flotante simple (no usada por la clase Carrito).
 * @param {string} message - Mensaje a mostrar.
 * @returns {void}
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Filtra y muestra productos según el texto de búsqueda.
 * Oculta las tarjetas que no coinciden con el texto.
 * @param {string} query - Texto de búsqueda.
 * @returns {void}
 */
function searchProducts(query) {
    const products = document.querySelectorAll('.card');
    query = query.toLowerCase();

    products.forEach(product => {
        const title = product.querySelector('.card-title').textContent.toLowerCase();
        const description = product.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// =============================
// Event Listeners y lógica de UI
// =============================
document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    // Agregar eventos a los botones de carrito
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Busca la tarjeta de producto asociada al botón
            const card = e.target.closest('.card');
            // Extrae los datos del producto de la tarjeta
            const producto = {
                id: card.dataset.id || Math.random().toString(36).substr(2, 9),
                nombre: card.querySelector('.card-title').textContent,
                descripcion: card.querySelector('.card-text').textContent,
                precio: parseFloat(card.querySelector('.h5.mb-0').textContent.replace('$', '').replace('.', '')),
                imagen: card.querySelector('.card-img-top').src
            };
            carrito.addItem(producto);
        });
    });

    // Evento para la búsqueda
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');

    searchButton.addEventListener('click', () => {
        searchProducts(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts(searchInput.value);
        }
    });
});

// =============================
// Estilos para las notificaciones (inserta CSS dinámicamente)
// =============================
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #2c3e50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateY(100%);
        opacity: 0;
        transition: all 0.3s ease;
    }

    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification i {
        color: #2ecc71;
        font-size: 1.2em;
    }
`;
document.head.appendChild(style);

/**
 * Carga el carrito desde localStorage y actualiza el contador global.
 * @returns {void}
 */
function loadCart() {
    const savedCart = localStorage.getItem('carrito');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

/**
 * Actualiza el contador visual del carrito en la interfaz (variable global cart).
 * @returns {void}
 */
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);
    cartCount.textContent = totalItems;
}

/**
 * Guarda el carrito en localStorage (variable global cart).
 * @returns {void}
 */
function saveCart() {
    localStorage.setItem('carrito', JSON.stringify(cart));
} 
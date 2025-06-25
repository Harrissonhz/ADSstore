// =====================================================
// Archivo: carrito.js
// Descripción: Lógica para gestionar el carrito de compras en ADS Store.
// Permite agregar, eliminar, modificar productos, calcular totales y manejar el almacenamiento en localStorage.
// Autor: [Tu Nombre o Equipo]
// Fecha: [Fecha de última edición]
// =====================================================

/**
 * Clase para manejar el carrito de compras.
 * Gestiona el almacenamiento, renderizado y lógica de negocio del carrito.
 */
class Carrito {
    /**
     * Inicializa el carrito desde localStorage o vacío y renderiza la vista.
     * @constructor
     */
    constructor() {
        /**
         * @type {Array<Object>} Lista de productos en el carrito.
         */
        this.items = JSON.parse(localStorage.getItem('carrito')) || [];
        this.render();
        this.updateCartCount();
    }

    /**
     * Agrega un producto al carrito. Si ya existe, incrementa la cantidad.
     * @param {Object} producto - Objeto con los datos del producto.
     * @param {string} producto.id - ID único del producto.
     * @param {string} producto.nombre - Nombre del producto.
     * @param {number} producto.precio - Precio unitario.
     * @param {string} producto.imagen - URL de la imagen.
     * @returns {void}
     */
    addItem(producto) {
        const existingItem = this.items.find(item => item.id === producto.id);
        if (existingItem) {
            existingItem.cantidad += 1;
        } else {
            this.items.push({...producto, cantidad: 1});
        }
        this.save();
        this.render();
        this.updateCartCount();
    }

    /**
     * Elimina un producto del carrito por su ID.
     * @param {string} id - ID del producto a eliminar.
     * @returns {void}
     */
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
        this.render();
        this.updateCartCount();
    }

    /**
     * Actualiza la cantidad de un producto en el carrito.
     * @param {string} id - ID del producto.
     * @param {number} cantidad - Nueva cantidad (mínimo 1).
     * @returns {void}
     */
    updateQuantity(id, cantidad) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.cantidad = Math.max(1, cantidad);
            this.save();
            this.render();
            this.updateCartCount();
        }
    }

    /**
     * Guarda el carrito en localStorage.
     * @returns {void}
     */
    save() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    /**
     * Calcula el subtotal de la compra (sin envío).
     * @returns {number} Subtotal en pesos.
     */
    calculateSubtotal() {
        return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    /**
     * Calcula el costo de envío.
     * @returns {number} Valor del envío (fijo si hay productos, 0 si no hay).
     */
    calculateShipping() {
        return this.items.length > 0 ? 5000 : 0; // $5,000 de envío si hay productos
    }

    /**
     * Calcula el total de la compra (subtotal + envío).
     * @returns {number} Total en pesos.
     */
    calculateTotal() {
        return this.calculateSubtotal() + this.calculateShipping();
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
     * Renderiza los items del carrito en la vista y actualiza los totales.
     * Si el carrito está vacío, muestra un mensaje y oculta los totales.
     * @returns {void}
     */
    render() {
        const cartItems = document.getElementById('cart-items');
        const subtotal = document.getElementById('subtotal');
        const shipping = document.getElementById('shipping');
        const total = document.getElementById('total');

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Tu carrito está vacío</p>
                    <a href="index.html" class="btn btn-primary">Continuar Comprando</a>
                </div>
            `;
            subtotal.textContent = '$0.00';
            shipping.textContent = '$0.00';
            total.textContent = '$0.00';
            return;
        }

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item mb-3 p-3 border-bottom">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.imagen}" class="img-fluid rounded" alt="${item.nombre}" style="max-height: 80px; object-fit: cover;">
                    </div>
                    <div class="col-md-3">
                        <h5 class="mb-0">${item.nombre}</h5>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group">
                            <button class="btn btn-outline-secondary" type="button" onclick="carrito.updateQuantity('${item.id}', ${item.cantidad - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="text" class="form-control text-center" value="${item.cantidad}" readonly style="width: 50px;">
                            <button class="btn btn-outline-secondary" type="button" onclick="carrito.updateQuantity('${item.id}', ${item.cantidad + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2 text-end">
                        <h5 class="mb-0">$${(item.precio * item.cantidad).toLocaleString()}</h5>
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-danger" onclick="carrito.removeItem('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        subtotal.textContent = `$${this.calculateSubtotal().toLocaleString()}`;
        shipping.textContent = `$${this.calculateShipping().toLocaleString()}`;
        total.textContent = `$${this.calculateTotal().toLocaleString()}`;
    }

    /**
     * Prepara los datos y redirige a la página de pago.
     * Valida que el carrito no esté vacío antes de proceder.
     * @returns {void}
     */
    checkout() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        const checkoutData = {
            items: this.items.map(item => ({
                id: item.id,
                title: item.nombre,
                price: `$${item.precio.toLocaleString()}`,
                quantity: item.cantidad,
                image: item.imagen
            })),
            subtotal: this.calculateSubtotal(),
            taxes: 0, // No se calculan impuestos en este carrito
            total: this.calculateTotal()
        };

        localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
        window.location.href = 'pago.html';
    }
}

/**
 * Instancia global del carrito para la página del carrito.
 * @type {Carrito}
 */
const carrito = new Carrito();

// =============================
// Event Listener para el botón de pago
// =============================
document.getElementById('checkout-btn').addEventListener('click', function() {
    carrito.checkout();
}); 
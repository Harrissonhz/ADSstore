// =====================================================
// Archivo: carrito-pago.js
// Descripción: Lógica específica para la página de pago del carrito en ADS Store.
// Muestra el resumen de la compra y gestiona el proceso de pago.
// Autor: [Tu Nombre o Equipo]
// Fecha: [Fecha de última edición]
// =====================================================

/**
 * Carga y muestra el resumen de la compra desde localStorage en la página de pago.
 * Valida la existencia de datos antes de renderizar.
 * Efectos secundarios: Manipula el DOM para mostrar los productos y totales.
 * @returns {void}
 */
function cargarResumenCompra() {
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
    if (!checkoutData) return;

    // Mostrar items en el carrito
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        cartItems.innerHTML = checkoutData.items.map(item => `
            <div class="cart-item d-flex align-items-center mb-3 p-3 border-bottom">
                <div class="item-image me-3" style="width: 80px; height: 80px; overflow: hidden;">
                    <img src="${item.image}" alt="${item.title}" class="img-fluid" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="item-details flex-grow-1">
                    <h6 class="mb-1">${item.title}</h6>
                    <div class="d-flex justify-content-between">
                        <span class="text-muted">Cantidad: ${item.quantity}</span>
                        <span>${item.price}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Mostrar resumen de compra
    const subtotalElement = document.getElementById('subtotal');
    const taxesElement = document.getElementById('taxes');
    const totalElement = document.getElementById('total');
    if (subtotalElement) subtotalElement.textContent = `$${checkoutData.subtotal.toLocaleString('es-CO')} COP`;
    if (taxesElement) taxesElement.textContent = `$${checkoutData.taxes.toLocaleString('es-CO')} COP`;
    if (totalElement) totalElement.textContent = `$${checkoutData.total.toLocaleString('es-CO')} COP`;
}

// =============================
// Lógica de UI y eventos de métodos de pago
// =============================
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Asigna eventos a los métodos de pago para mostrar el detalle correspondiente.
     */
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            // Remover clase active de todos los métodos
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            // Agregar clase active al método seleccionado
            method.classList.add('active');
            // Ocultar todos los detalles de pago
            document.querySelectorAll('.payment-detail').forEach(detail => detail.style.display = 'none');
            // Mostrar el detalle correspondiente
            const methodType = method.getAttribute('data-method');
            const detailElement = document.getElementById(`${methodType}Detail`);
            if (detailElement) {
                detailElement.style.display = 'block';
            }
        });
    });

    /**
     * Lógica para copiar la llave al portapapeles en el método de pago "Llave Bancolombia".
     */
    const copyBtn = document.querySelector('#llaveDetail .btn-outline-secondary');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const input = document.querySelector('#llaveDetail .input-group input');
            if (input) {
                input.select();
                document.execCommand('copy');
            }
        });
    }

    cargarResumenCompra();
}); 
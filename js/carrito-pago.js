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
function actualizarTotalConEnvio() {
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData'));
    if (!checkoutData) return;
    const subtotal = checkoutData.subtotal || 0;
    const taxes = checkoutData.taxes || 0;
    // Obtener valor de envío seleccionado
    const shippingOption = document.querySelector('input[name="shippingOption"]:checked');
    let shippingValue = 0;
    let shippingText = '';
    if (shippingOption) {
        shippingValue = parseInt(shippingOption.value, 10);
        if (shippingOption.id === 'envioMetro') {
            shippingText = '$10.000 COP';
        } else if (shippingOption.id === 'envioPais') {
            shippingText = '$18.000 COP';
        } else if (shippingOption.id === 'retiroTienda') {
            shippingText = 'SIN COSTO';
        } else if (shippingOption.id === 'productoDigital') {
            shippingText = 'SIN COSTO';
        } else if (shippingOption.id === 'contraEntrega') {
            shippingText = 'El costo depende de la transportadora';
        }
    }
    // Actualizar todos los spans de shippingCost
    document.querySelectorAll('#shippingCost').forEach(span => {
        span.textContent = shippingText;
    });
    // Calcular y mostrar el total
    const total = subtotal + taxes + shippingValue;
    const totalElement = document.getElementById('total');
    if (totalElement) totalElement.textContent = `$${total.toLocaleString('es-CO')} COP`;
}

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
    if (subtotalElement) subtotalElement.textContent = `$${checkoutData.subtotal.toLocaleString('es-CO')} COP`;
    if (taxesElement) taxesElement.textContent = `$${checkoutData.taxes.toLocaleString('es-CO')} COP`;
    // El total ahora se calcula con el envío
    actualizarTotalConEnvio();
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

    // Evento para actualizar el total cuando se cambia la opción de envío
    document.querySelectorAll('input[name="shippingOption"]').forEach(radio => {
        radio.addEventListener('change', actualizarTotalConEnvio);
    });

    cargarResumenCompra();
}); 
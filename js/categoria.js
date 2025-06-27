// =====================================================
// Archivo: categoria.js
// Descripción: Lógica para filtrar y mostrar productos por categoría en ADS Store.
// Obtiene los datos desde productos.json y la categoría desde la URL.
// Autor: [Tu Nombre o Equipo]
// Fecha: [Fecha de última edición]
// =====================================================

/**
 * Obtiene el valor de un parámetro de la URL.
 * @param {string} param - Nombre del parámetro a buscar.
 * @returns {string|null} Valor del parámetro o null si no existe.
 * @example
 * // Si la URL es ...?categoria=Hombres
 * getQueryParam('categoria'); // 'Hombres'
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Formatea un número como precio en pesos colombianos (COP).
 * @param {number} valor - Valor numérico a formatear.
 * @returns {string} Precio formateado.
 * @example
 * formatearPrecio(10000); // "$10.000"
 */
function formatearPrecio(valor) {
    return valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
}

// Variable global para almacenar los productos cargados
/**
 * @type {Array<Object>} Lista de productos cargados desde el JSON.
 */
let productosCargados = [];

/**
 * Crea el HTML de una tarjeta de producto.
 * @param {Object} producto - Objeto con los datos del producto.
 * @param {string} producto.id - ID único del producto.
 * @param {string} producto.nombre - Nombre del producto.
 * @param {string} producto.descripcion - Descripción corta.
 * @param {number} producto.precio - Precio original.
 * @param {number} [producto.descuento] - Precio con descuento (opcional).
 * @param {Array<string>} [producto.imagenes] - Imágenes del producto.
 * @returns {string} HTML de la tarjeta.
 */
function crearTarjetaProducto(producto) {
    const tieneDescuento = producto.descuento && producto.descuento < producto.precio;
    let cardHTML = `
    <div class="col-md-4">
        <div class="card h-100">
            <img src="${producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : 'img/no-image.png'}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.descripcion.substring(0, 80)}...</p>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    ${tieneDescuento
                        ? `<span class='text-muted text-decoration-line-through me-2'>${formatearPrecio(producto.precio)}</span>
                           <span class='text-danger fw-bold'>Oferta: ${formatearPrecio(producto.descuento)}</span>`
                        : `<span class="h5 mb-0 text-primary">${formatearPrecio(producto.precio)}</span>`
                    }
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.id}')">Agregar al Carrito</button>
                    <a href="producto-detalle.html?id=${producto.id}" class="btn btn-outline-secondary ms-2">Ver</a>
                </div>
            </div>
        </div>
    </div>
    `;

    if (producto.agotado) {
        cardHTML += '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Agotado</span>';
        cardHTML = cardHTML.replace('<button class="btn btn-primary" onclick="agregarAlCarrito(\'' + producto.id + '\')">Agregar al Carrito</button>', '<button class="btn btn-secondary disabled">Agotado</button>');
    }

    return cardHTML;
}

/**
 * Agrega un producto al carrito usando la lógica de tienda.js.
 * Valida la existencia del producto antes de agregarlo.
 * @param {string} idProducto - ID del producto a agregar.
 * @returns {void}
 */
function agregarAlCarrito(idProducto) {
    // Buscar el producto en la lista cargada
    const producto = productosCargados.find(p => p.id == idProducto);
    if (!producto) {
        alert('Producto no encontrado.');
        return;
    }
    // Preparar el objeto producto para el carrito
    const productoCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.descuento && producto.descuento < producto.precio ? producto.descuento : producto.precio,
        imagen: (producto.imagenes && producto.imagenes.length > 0) ? producto.imagenes[0] : 'img/no-image.png'
    };
    // Usar la instancia global de carrito de tienda.js
    carrito.addItem(productoCarrito);
}

/**
 * Carga y muestra los productos filtrados por categoría.
 * Obtiene la categoría de la URL y filtra los productos del JSON.
 * Si no hay productos, muestra un mensaje adecuado.
 * @returns {Promise<void>}
 */
async function mostrarProductosPorCategoria() {
    const categoria = getQueryParam('categoria');
    if (!categoria) {
        document.getElementById('categoria-titulo').textContent = 'Categoría no especificada';
        document.getElementById('titulo-productos').textContent = 'No hay productos para mostrar';
        return;
    }
    document.getElementById('categoria-titulo').textContent = categoria;
    document.getElementById('titulo-productos').textContent = `Productos en "${categoria}"`;

    try {
        const response = await fetch('js/productos.json');
        const productos = await response.json();
        // Guardar productos cargados globalmente
        productosCargados = productos;
        // Filtrar productos por categoría
        const productosFiltrados = productos.filter(p => Array.isArray(p.categorias) && p.categorias.includes(categoria));
        const contenedor = document.getElementById('productos-categoria');
        if (productosFiltrados.length === 0) {
            contenedor.innerHTML = '<div class="col-12"><p class="text-center">No hay productos en esta categoría.</p></div>';
            return;
        }
        contenedor.innerHTML = productosFiltrados.map(crearTarjetaProducto).join('');
    } catch (error) {
        document.getElementById('productos-categoria').innerHTML = '<div class="col-12"><p class="text-danger text-center">Error al cargar los productos.</p></div>';
    }
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', mostrarProductosPorCategoria); 
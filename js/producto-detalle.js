// =====================================================
// Archivo: producto-detalle.js
// Descripción: Lógica de la página de detalle de producto en ADS Store.
// Carga datos del producto, gestiona el carrusel de imágenes, selector de cantidad y botón de agregar al carrito.
// Autor: [Tu Nombre o Equipo]
// Fecha: [Fecha de última edición]
// =====================================================

/**
 * Obtiene el valor de un parámetro de la URL.
 * @param {string} param - Nombre del parámetro a buscar.
 * @returns {string|null} Valor del parámetro o null si no existe.
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// =============================
// Lógica principal de la página de detalle
// =============================
document.addEventListener('DOMContentLoaded', async function() {
    /**
     * Obtiene el ID del producto desde la URL y valida su existencia.
     */
    const id = getQueryParam('id');
    if (!id) {
        document.getElementById('titulo-producto').textContent = 'Producto no encontrado';
        return;
    }

    // =============================
    // Carga los productos desde el archivo JSON
    // =============================
    let productos = [];
    try {
        const res = await fetch('js/productos.json');
        productos = await res.json();
    } catch (e) {
        document.getElementById('titulo-producto').textContent = 'Error cargando productos';
        return;
    }

    /**
     * Busca el producto correspondiente por ID.
     */
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        document.getElementById('titulo-producto').textContent = 'Producto no encontrado';
        return;
    }

    // =============================
    // Renderiza los datos del producto en la página
    // =============================
    document.getElementById('titulo-producto').textContent = producto.nombre;
    // Mostrar selectores de color y diseño si hay varias opciones
    const selectoresDiv = document.getElementById('selectores-producto');
    let selectoresHTML = '';
    // Color
    if (Array.isArray(producto.color) && producto.color.length > 1) {
        selectoresHTML += `<div class='mb-2'><label for='color-select' class='form-label me-2'>Color:</label><select id='color-select' class='form-select d-inline-block w-auto'>`;
        producto.color.forEach(c => {
            selectoresHTML += `<option value='${c}'>${c}</option>`;
        });
        selectoresHTML += `</select></div>`;
    } else if (Array.isArray(producto.color) && producto.color.length === 1) {
        selectoresHTML += `<span class='badge bg-secondary me-2'>Color: ${producto.color[0]}</span>`;
    }
    // Diseño
    if (Array.isArray(producto.diseño) && producto.diseño.length > 1) {
        selectoresHTML += `<div class='mb-2'><label for='diseno-select' class='form-label me-2'>Diseño:</label><select id='diseno-select' class='form-select d-inline-block w-auto'>`;
        producto.diseño.forEach(d => {
            selectoresHTML += `<option value='${d}'>${d}</option>`;
        });
        selectoresHTML += `</select></div>`;
    } else if (Array.isArray(producto.diseño) && producto.diseño.length === 1) {
        selectoresHTML += `<span class='badge bg-info text-dark me-2'>Diseño: ${producto.diseño[0]}</span>`;
    }
    selectoresDiv.innerHTML = selectoresHTML;

    // Precio y descuento
    const precioEl = document.getElementById('precio-producto');
    const descuentoEl = document.getElementById('descuento-producto');
    if (producto.descuento && producto.descuento < producto.precio) {
        precioEl.innerHTML = `<span style='text-decoration:line-through;'>$${producto.precio.toLocaleString()}</span>`;
        descuentoEl.style.display = '';
        descuentoEl.innerHTML = `<i class='fas fa-tag'></i> Oferta: $${producto.descuento.toLocaleString()}`;
    } else {
        precioEl.textContent = `$${producto.precio.toLocaleString()}`;
        descuentoEl.style.display = 'none';
    }

    document.getElementById('descripcion-producto').textContent = producto.descripcion;

    // Características
    const ul = document.getElementById('caracteristicas-producto');
    ul.innerHTML = '';
    producto.caracteristicas.forEach(carac => {
        const li = document.createElement('li');
        li.textContent = carac;
        ul.appendChild(li);
    });

    // Carrusel de imágenes
    const carousel = document.getElementById('carousel-imagenes');
    const indicadores = document.getElementById('carousel-indicadores');
    carousel.innerHTML = '';
    indicadores.innerHTML = '';
    // Guardar imágenes para navegación en el modal
    window.imagenesProducto = producto.imagenes;
    window.imagenActualModal = 0;
    producto.imagenes.forEach((img, idx) => {
        // Indicadores
        if (producto.imagenes.length > 1) {
            indicadores.innerHTML += `<button type='button' data-bs-target='#carouselProducto' data-bs-slide-to='${idx}'${idx === 0 ? ' class="active" aria-current="true"' : ''} aria-label='Slide ${idx+1}'></button>`;
        }
        // Imágenes sin lupa
        const div = document.createElement('div');
        div.className = 'carousel-item' + (idx === 0 ? ' active' : '');
        div.innerHTML = `
            <div class='position-relative'>
                <img src="${img}" class="d-block w-100 imagen-carrusel-producto" alt="Imagen ${idx+1}" style="cursor:zoom-in;">
            </div>
        `;
        carousel.appendChild(div);
    });

    // Evento para ampliar imagen (doble clic)
    setTimeout(() => {
        document.querySelectorAll('.imagen-carrusel-producto').forEach((imgEl, idx) => {
            imgEl.ondblclick = function() {
                window.imagenActualModal = idx;
                mostrarImagenModal(idx);
            };
        });
    }, 100);

    // Función para mostrar imagen en el modal y actualizar navegación
    function mostrarImagenModal(idx) {
        const imgSrc = window.imagenesProducto[idx];
        document.getElementById('imagen-ampliada').src = imgSrc;
        const modal = new bootstrap.Modal(document.getElementById('modalImagenAmpliada'));
        modal.show();
        actualizarFlechasModal();
    }
    // Función para actualizar el estado de las flechas
    function actualizarFlechasModal() {
        document.getElementById('modal-flecha-prev').disabled = (window.imagenActualModal === 0);
        document.getElementById('modal-flecha-next').disabled = (window.imagenActualModal === window.imagenesProducto.length - 1);
    }
    // Eventos de navegación en el modal
    setTimeout(() => {
        document.getElementById('modal-flecha-prev').onclick = function() {
            if (window.imagenActualModal > 0) {
                window.imagenActualModal--;
                mostrarImagenModal(window.imagenActualModal);
            }
        };
        document.getElementById('modal-flecha-next').onclick = function() {
            if (window.imagenActualModal < window.imagenesProducto.length - 1) {
                window.imagenActualModal++;
                mostrarImagenModal(window.imagenActualModal);
            }
        };
    }, 200);

    // Video
    document.getElementById('video-producto').src = producto.video;

    // Lógica agregar al carrito
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    addToCartBtn.onclick = function() {
        const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
        // Obtener color y diseño seleccionados si existen
        let colorSeleccionado = '';
        let disenoSeleccionado = '';
        if (document.getElementById('color-select')) {
            colorSeleccionado = document.getElementById('color-select').value;
        } else if (Array.isArray(producto.color) && producto.color.length === 1) {
            colorSeleccionado = producto.color[0];
        }
        if (document.getElementById('diseno-select')) {
            disenoSeleccionado = document.getElementById('diseno-select').value;
        } else if (Array.isArray(producto.diseño) && producto.diseño.length === 1) {
            disenoSeleccionado = producto.diseño[0];
        }
        for(let i=0; i<cantidad; i++) {
            carrito.addItem({
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.descuento && producto.descuento < producto.precio ? producto.descuento : producto.precio,
                imagen: producto.imagenes[0],
                cantidad: 1,
                color: colorSeleccionado,
                diseno: disenoSeleccionado
            });
        }
    };

    // Miniaturas de imágenes
    const miniaturasDiv = document.getElementById('miniaturas-producto');
    if (miniaturasDiv) {
        miniaturasDiv.innerHTML = '';
        producto.imagenes.forEach((img, idx) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.alt = `Miniatura ${idx+1}`;
            thumb.className = 'img-thumbnail mb-2 miniatura-producto';
            thumb.style.cursor = 'pointer';
            thumb.style.width = '48px';
            thumb.style.height = '48px';
            thumb.onclick = function() {
                const carousel = bootstrap.Carousel.getOrCreateInstance(document.getElementById('carouselProducto'));
                carousel.to(idx);
            };
            miniaturasDiv.appendChild(thumb);
        });
    }
}); 
let catalogoProductos = [];

// Función para cargar múltiples JSON desde la carpeta "Productos"
async function cargarCatalogoDesdeCarpeta() {
    const archivosJSON = [
       "B6M880GRUA.json",
       "Lijas.json",
       "F9F717GRUA.json",
       "F9F717CAMION.json",
       "B6M-880camion.json",
       "B6H852GRUA.json",
       "B6H852CAMION.json"
    ];

    const carpeta = "../Catalogo/";

    try {
        let promesas = archivosJSON.map(async (archivo) => {
            let ruta = carpeta + archivo;
            try {
                let response = await fetch(ruta);
                if (!response.ok) {
                    throw new Error(`Error al cargar ${archivo}: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error(`Error en archivo ${archivo}:`, error);
                return null;
            }
        });

        const datos = await Promise.all(promesas);
        catalogoProductos = datos.flat().filter(producto => producto !== null);

        mostrarCatalogo(catalogoProductos);
    } catch (error) {
        console.error("Error al cargar JSON:", error);
    }
}

// Variables del modal
const modal = document.getElementById("searchModal");

// Mostrar y ocultar modal con animación
document.getElementById("openSearchModal").addEventListener("click", () => {
    modal.style.display = "flex";
    modal.classList.add("modal-activo", "fade-in");
    cargarCatalogoDesdeCarpeta();
});

document.getElementById("cerrarModal").addEventListener("click", () => {
    modal.classList.remove("fade-in");
    modal.classList.add("fade-out");
    setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("fade-out");
    }, 300);
});

// Función para mostrar los productos en el modal
function mostrarCatalogo(productos) {
    const catalogoBody = document.getElementById("catalogoBody");
    catalogoBody.innerHTML = "";

    if (!productos || productos.length === 0) {
        catalogoBody.innerHTML = "<tr><td colspan='5'>No hay productos disponibles</td></tr>";
        return;
    }

    productos.forEach(prod => {
        if (!prod.codigo || !prod.nombre || isNaN(prod.precio_venta)) {
            console.warn("Producto con datos incorrectos:", prod);
            return;
        }

        const fila = document.createElement("tr");
        fila.classList.add("fade-in");
        fila.innerHTML = `
            <td>${prod.codigo}</td>
            <td>${prod.nombre}</td>
            <td>${parseFloat(prod.precio_inicial).toFixed(2)}</td>
            <td>${parseFloat(prod.precio_venta).toFixed(2)}</td>
            <td>
                <input type="number" id="cantidad-${prod.codigo}" placeholder="Cant." style="width: 60px;">
                <input type="number" id="ajuste-${prod.codigo}" placeholder="Desc/Aum" style="width: 80px;">
                <button onclick="agregarDesdeCatalogo('${prod.codigo}')">Agregar</button>
            </td>
        `;
        catalogoBody.appendChild(fila);
    });
}

// Evento para buscar producto por código o nombre
document.getElementById("buscarProductoBtn").addEventListener("click", () => {
    const valorBusqueda = document.getElementById("buscarProductoInput").value.toLowerCase();
    const resultados = catalogoProductos.filter(prod => 
        prod.codigo.toLowerCase().includes(valorBusqueda) ||
        prod.nombre.toLowerCase().includes(valorBusqueda)
    );
    mostrarCatalogo(resultados);
});

// Agregar producto desde catálogo a la tabla principal
function agregarDesdeCatalogo(codigoProd) {
    const producto = catalogoProductos.find(p => p.codigo === codigoProd);
    if (!producto) {
        alert("Producto no encontrado.");
        return;
    }
    const cantidad = parseInt(document.getElementById(`cantidad-${codigoProd}`).value) || 0;
    const ajuste = parseFloat(document.getElementById(`ajuste-${codigoProd}`).value) || 0;

    if (cantidad <= 0) {
        alert("Ingresa una cantidad válida.");
        return;
    }

    const precioUnitario = parseFloat(producto.precio_venta) + ajuste;
    const precioFinal = precioUnitario * cantidad;

    const tabla = document.getElementById("productTable");
    const fila = document.createElement("tr");
    fila.classList.add("fade-in");
    fila.innerHTML = `
        <td>${producto.codigo}</td>
        <td>${producto.nombre}</td>
        <td>${cantidad}</td>
        <td>${precioUnitario.toFixed(2)}</td>
        <td>${precioFinal.toFixed(2)}</td>
        <td>
            <button onclick="editarFila(this)">✏️</button>
            <button onclick="eliminarFila(this)">❌</button>
        </td>
    `;
    tabla.appendChild(fila);
    actualizarTotales();
    modal.style.display = "none";
}

// Editar cantidad o precio en la tabla
function editarFila(btn) {
    const fila = btn.parentElement.parentElement;
    const cantidadActual = parseFloat(fila.children[2].textContent);
    const precioUnitarioActual = parseFloat(fila.children[3].textContent);

    const nuevaCantidad = prompt("Nueva cantidad:", cantidadActual);
    const nuevoPrecio = prompt("Nuevo precio unitario:", precioUnitarioActual);

    if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
        fila.children[2].textContent = nuevaCantidad;
        fila.children[4].textContent = (nuevoPrecio * nuevaCantidad).toFixed(2);
        actualizarTotales();
    } else {
        alert("Cantidad inválida.");
    }
}

// Eliminar fila con animación
function editarFila(btn) {
    const fila = btn.parentElement.parentElement;
    const cantidadActual = parseFloat(fila.children[2].textContent);
    const precioUnitarioActual = parseFloat(fila.children[3].textContent);

    Swal.fire({
        title: '¿Qué deseas editar?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Cantidad',
        denyButtonText: 'Precio',
        cancelButtonText: 'Descuento/Aumento',
        icon: 'question',
        background: '#f0f0f0',
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#28a745',
        cancelButtonColor: '#ffc107'
    }).then((result) => {
        if (result.isConfirmed) {
            // Editar cantidad
            Swal.fire({
                title: 'Editar cantidad',
                input: 'number',
                inputLabel: 'Nueva cantidad:',
                inputValue: cantidadActual,
                inputAttributes: { min: 1 },
                confirmButtonText: 'Actualizar',
                showCancelButton: true,
            }).then(({ value }) => {
                if (value && value > 0) {
                    fila.children[2].textContent = value;
                    fila.children[4].textContent = (precioUnitarioActual * value).toFixed(2);
                    actualizarTotales();
                }
            });
        } else if (result.isDenied) {
            // Editar precio unitario
            Swal.fire({
                title: 'Editar precio unitario',
                input: 'number',
                inputLabel: 'Nuevo precio unitario:',
                inputValue: precioUnitarioActual,
                inputAttributes: { min: 0.01, step: 0.01 },
                confirmButtonText: 'Actualizar',
                showCancelButton: true,
            }).then(({ value }) => {
                if (value && value > 0) {
                    fila.children[3].textContent = parseFloat(value).toFixed(2);
                    fila.children[4].textContent = (value * cantidadActual).toFixed(2);
                    actualizarTotales();
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Descuento o aumento
            Swal.fire({
                title: "¿Quieres descontar o aumentar?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Descontar",
                denyButtonText: "Aumentar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#d33",
                denyButtonColor: "#28a745",
                cancelButtonColor: "#aaa"
            }).then((result) => {
                if (result.isConfirmed || result.isDenied) {
                    const operacion = result.isConfirmed ? "descontar" : "aumentar";
                    Swal.fire({
                        title: `¿Cuánto deseas ${operacion}?`,
                        input: "number",
                        inputLabel: `Ingresa el monto a ${operacion}:`,
                        inputValue: 0,
                        inputAttributes: { step: 0.01 },
                        confirmButtonText: "Aplicar",
                        showCancelButton: true,
                    }).then(({ value }) => {
                        if (!isNaN(value) && value !== null) {
                            const monto = parseFloat(value);
                            const nuevoPrecio = result.isConfirmed
                                ? precioUnitarioActual - monto
                                : precioUnitarioActual + monto;
    
                            fila.children[3].textContent = nuevoPrecio.toFixed(2);
                            fila.children[4].textContent = (nuevoPrecio * cantidadActual).toFixed(2);
                            actualizarTotales();
                        }
                    });
                }
            });
        }
    });
}

function eliminarFila(btn) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el producto de la lista.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            btn.parentElement.parentElement.remove();
            actualizarTotales();
            Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
        }
    });
}
// Calcular y actualizar totales
function actualizarTotales() {
    let subtotal = 0;
    document.querySelectorAll("#productTable tr").forEach(fila => {
        const precioFinal = parseFloat(fila.children[4].textContent) || 0;
        subtotal += precioFinal;
    });
    
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    
    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("igv").textContent = igv.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}

// Adaptabilidad a dispositivos móviles
window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
        document.body.classList.add("mobile-view");
    } else {
        document.body.classList.remove("mobile-view");
    }
});

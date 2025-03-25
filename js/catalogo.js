let catalogoProductos = [];

// Función para cargar múltiples JSON desde la carpeta "Catalogo"
async function cargarCatalogoDesdeCarpeta() {
    const archivosJSON = ["Lijas.json","B6M-880 CAMION.json","B6M-880 GRUA.json","B6H-852-GRUA.json","B6H-852-CAMION.json","F9F-717 GRUA.json","F9F-717 CAMION.json"]; // Agrega más archivos según sea necesario
    const carpeta = "Catalogo/";

    try {
        let promesas = archivosJSON.map(archivo =>
            fetch(carpeta + archivo)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error al cargar ${archivo}: ${response.status}`);
                    }
                    return response.json();
                })
        );

        const datos = await Promise.all(promesas);
        catalogoProductos = datos.flat(); // Unir todos los JSON en una sola lista

        console.log("Datos cargados:", catalogoProductos);
        cargarCatalogo(catalogoProductos);
    } catch (error) {
        console.error("Error al cargar JSON:", error);
    }
}

// Mostrar y ocultar modal
document.getElementById("openSearchModal").addEventListener("click", () => {
    
    document.getElementById("searchModal").style.display = "flex";
    document.getElementById("searchModal").classList.add("modal-activo"); // Mejor animación en móviles
    
    cargarCatalogoDesdeCarpeta();
});

document.getElementById("cerrarModal").addEventListener("click", () => {
    document.getElementById("searchModal").style.display = "none";
});

// Función para mostrar los productos en el modal
function cargarCatalogo(productos) {
    const catalogoBody = document.getElementById("catalogoBody");
    catalogoBody.innerHTML = "";

    if (!productos || productos.length === 0) {
        catalogoBody.innerHTML = `<tr><td colspan="5">No hay productos disponibles</td></tr>`;
        return;
    }

    productos.forEach(prod => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${prod.codigo}</td>
            <td>${prod.nombre}</td>
            <td>${prod.precio_inicial}</td>
            <td>${prod.precio_venta}</td>
            <td>
                <input type="number" id="cantidad-${prod.codigo}" placeholder="Cant." style="width: 60px;">
                <input type="number" id="ajuste-${prod.codigo}" placeholder="Desc/Aum" style="width: 80px;">
                <button onclick="agregarDesdeCatalogo('${prod.codigo}')">Agregar</button>
            </td>
        `;
        catalogoBody.appendChild(fila);
    });
}

// Buscar producto por código o nombre
document.getElementById("buscarProductoBtn").addEventListener("click", () => {
    const valorBusqueda = document.getElementById("buscarProductoInput").value.toLowerCase();
    const resultados = catalogoProductos.filter(prod => 
        prod.codigo.toLowerCase().includes(valorBusqueda) ||
        prod.nombre.toLowerCase().includes(valorBusqueda)
    );
    cargarCatalogo(resultados);
});

// Agregar producto desde catálogo a la tabla principal
function agregarDesdeCatalogo(codigoProd) {
    const producto = catalogoProductos.find(p => p.codigo === codigoProd);
    const cantidad = parseInt(document.getElementById(`cantidad-${codigoProd}`).value);
    const ajuste = parseFloat(document.getElementById(`ajuste-${codigoProd}`).value) || 0;

    if (!cantidad || cantidad <= 0) {
        alert("Ingresa una cantidad válida.");
        return;
    }

    const precioUnitario = parseFloat(producto.precio_venta) + ajuste;
    const precioFinal = precioUnitario * cantidad;

    // Agregar a la tabla principal
    const tabla = document.getElementById("productTable");
    const fila = document.createElement("tr");
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

    // Cerrar modal
    searchModal.style.display = "none";
}

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
            // Editar Cantidad
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
            // Editar Precio Unitario
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
            // Descuento o Aumento
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
                            const ajuste = parseFloat(value);
                            const nuevoPrecio = result.isConfirmed
                                ? precioUnitarioActual - ajuste // Descontar
                                : precioUnitarioActual + ajuste; // Aumentar

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


function actualizarTotales() {
    let subtotal = 0;
    const filas = document.querySelectorAll("#productTable tr");
    filas.forEach(fila => {
        const precioFinal = parseFloat(fila.children[4].textContent);
        subtotal += precioFinal;
    });

    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("igv").textContent = igv.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}

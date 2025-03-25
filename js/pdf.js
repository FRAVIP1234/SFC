document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");
    const productTable = document.getElementById("productTable");
    const subtotalEl = document.getElementById("subtotal");
    const igvEl = document.getElementById("igv");
    const totalEl = document.getElementById("total");

    let products = [];

    function updateTable() {
        productTable.innerHTML = "";
        let subtotal = 0;

        products.forEach((product, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>S/ ${product.price.toFixed(2)}</td>
                <td>S/ ${(product.quantity * product.price).toFixed(2)}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">✏️</button>
                    <button class="delete-btn" data-index="${index}">🗑️</button>
                </td>
            `;
            productTable.appendChild(row);
            subtotal += product.quantity * product.price;
        });

        let igv = subtotal * 0.18;
        let total = subtotal + igv;

        subtotalEl.textContent = `S/ ${subtotal.toFixed(2)}`;
        igvEl.textContent = `S/ ${igv.toFixed(2)}`;
        totalEl.textContent = `S/ ${total.toFixed(2)}`;
    }

    productForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const productName = document.getElementById("productName").value;
        const productQuantity = parseInt(document.getElementById("productQuantity").value);
        const productPrice = parseFloat(document.getElementById("productPrice").value);

        if (!productName || isNaN(productQuantity) || isNaN(productPrice)) {
            alert("Todos los campos son obligatorios");
            return;
        }

        products.push({ name: productName, quantity: productQuantity, price: productPrice });
        updateTable();
        productForm.reset();
    });

    productTable.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.dataset.index;
            products.splice(index, 1);
            updateTable();
        } else if (e.target.classList.contains("edit-btn")) {
            const index = e.target.dataset.index;
            const product = products[index];
            document.getElementById("productName").value = product.name;
            document.getElementById("productQuantity").value = product.quantity;
            document.getElementById("productPrice").value = product.price;
            products.splice(index, 1);
            updateTable();
        }
    });

    document.getElementById("exportPdf").addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const logoSuperior = "https://i.postimg.cc/x8G4McbX/2.png";
        const imagenIntermedia = "https://i.postimg.cc/pdXqKmDp/Dise-o-sin-t-tulo-3.png";
        const imagenPie = "https://i.postimg.cc/63kcKCjf/PUIE-DE-PAGINA.png";

        // 1. Logo superior
        doc.addImage(logoSuperior, "PNG", 13, 6, 35 , 35);
        doc.setTextColor(259, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("SERVICES FOR CRANES OF PERU SAC", 115, 23, { align: "center" });
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text("RUC: 20603411481", 112.2, 30, { align: "center" });

        
        const numeroProforma = document.getElementById('numeroProforma').textContent || "00000";
        const textoProforma = `PROFORMA N° ${numeroProforma}`;
        const textWidth = doc.getTextWidth(textoProforma);
        const boxX = (232 - textWidth - 18) / 2;
        const boxY = 35;
        const boxWidth = textWidth + 10;
        const boxHeight = 9;

        doc.setDrawColor(0, 0, 0);
        doc.rect(boxX, boxY, boxWidth, boxHeight);
        doc.text(textoProforma, 110, boxY + 6, { align: "center" });

        let y = boxY + boxHeight + 10;
        const nombre = document.getElementById('clienteNombre').value || "";
        const ruc = document.getElementById('clienteRUC').value || "";
        const direccion = document.getElementById('clienteDireccion').value || "";
        const servicio = document.getElementById('clienteServicio').value || "";
        const lugar = document.getElementById('clienteLugar').value || "";
        const camion = document.getElementById('clienteCamion').value || "";
        const placa = document.getElementById('clientePlaca').value || "";
        const kilometraje = document.getElementById('clienteKilometraje').value || "";
        const horometro = document.getElementById('clienteHorometro').value || "";
        const maquinaria = document.getElementById('clienteMaquinaria').value || "";
        const modelo = document.getElementById('clienteModelo').value || "";
        const serie = document.getElementById('clienteSerie').value || "";
        const anio = document.getElementById('clienteAnio').value || "";
        let fecha = document.getElementById('clienteFecha').value || "";
        
        // Fecha actual si está vacía
        if (fecha === "") {
            const hoy = new Date();
            const dia = String(hoy.getDate()).padStart(2, '0');
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const anioActual = hoy.getFullYear();
            fecha = `${dia}/${mes}/${anioActual}`;
        }
        
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        
        // ORDEN DE DATOS COMO CADENAS DE TEXTO
        const datos = [
            ["CLIENTE: ", nombre],
            ["RUC: ", ruc],
            ["DIRECCIÓN: ", direccion],
            ["SERVICIO: ", servicio],
            ["LUGAR: ", lugar],
            ["CAMIÓN: ", camion],
            ["PLACA DE LA UNIDAD: ", placa],
            ["KILOMETRAJE: ", kilometraje],
            ["HORÓMETRO: ", horometro],
            ["MAQUINARIA: ", maquinaria],
            ["MODELO: ", modelo],
            ["SERIE: ", serie],
            ["AÑO: ", anio],
            ["FECHA: ", fecha]
        ];
        
        // VARIABLES DE MÁRGENES
        const xInicio = 20;
        const xFin = 180;
        const maxWidth = xFin - xInicio;
        let yCursor = y;
        const lineHeight = 6;
        let lineaActual = [];
        let anchoActual = 0;
        const lineas = [];
        
        // AGRUPA DATOS AUTOMÁTICAMENTE EN LÍNEAS
        datos.forEach(([label, valor]) => {
            const texto = label + valor;
            const anchoTexto = doc.getTextWidth(texto);
            if (anchoActual + anchoTexto <= maxWidth) {
                lineaActual.push([label, valor]);
                anchoActual += anchoTexto;
            } else {
                lineas.push(lineaActual);
                lineaActual = [[label, valor]];
                anchoActual = anchoTexto;
            }
        });
        if (lineaActual.length > 0) {
            lineas.push(lineaActual);
        }
        
        // LIMITA A SOLO 4 LÍNEAS
        const maxLineas = 4;
        const lineasFinales = lineas.slice(0, maxLineas);
        
        // DIBUJA CADA LÍNEA JUSTIFICADA
        lineasFinales.forEach(linea => {
            const totalWidth = linea.reduce((sum, [label, valor]) => {
                const text = label + valor;
                return sum + doc.getTextWidth(text);
            }, 0);
            const espacioDisponible = xFin - xInicio - totalWidth;
            const espacioEntre = linea.length > 1 ? espacioDisponible / (linea.length - 1) : 0;
        
            let xCursor = xInicio;
        
            linea.forEach(([label, valor], index) => {
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(label, xCursor, yCursor);
                xCursor += doc.getTextWidth(label);
        
                let colorValor = [0, 0, 0];
                if (label.includes("KILOMETRAJE") && valor.includes("sin registro")) {
                    colorValor = [255, 0, 0];
                } else if (label.includes("HORÓMETRO") && valor.includes("sin registro")) {
                    colorValor = [0, 128, 0];
                }
        
                doc.setFont(undefined, 'normal');
                doc.setTextColor(...colorValor);
                doc.text(valor, xCursor, yCursor);
                xCursor += doc.getTextWidth(valor);
        
                if (index < linea.length - 1) {
                    xCursor += espacioEntre;
                }
            });
        
            yCursor += lineHeight;
        });
        
        // SOLO 1 espacio hacia la tabla
        const inicioTablaY = yCursor + 1;
        

        const filasTabla = document.querySelectorAll("#productTable tr");
const tableData = [];

filasTabla.forEach((fila, index) => {
    const celdas = fila.querySelectorAll("td");
    if (celdas.length >= 5) {
        const codigo = celdas[0].textContent;
        const nombre = celdas[1].textContent;
        const cantidad = celdas[2].textContent;
        const precioUnitario = celdas[3].textContent;
        const precioFinal = celdas[4].textContent;
        tableData.push([codigo, nombre, cantidad, precioUnitario, precioFinal]);
    }
});

        doc.autoTable({
            head: [["Código", "Nombre", "Cantidad", "Precio Unitario", "Precio Final"]],
            body: tableData,
            startY: inicioTablaY,
            theme: "grid",
            styles: {
                font: "helvetica",
                fontSize: 9,
                cellPadding: 3,
                overflow: 'linebreak',  // 🔹 Ajusta altura de fila, no ancho
                valign: 'middle'
            },
            headStyles: {
                fontStyle: "bold",
                fillColor: [230, 230, 230],
                textColor: [0, 0, 0],
                halign: 'center'
            },
            // 🔸 Ancho proporcional. Se expande SOLO si el texto lo necesita.
            tableWidth: 180, // 🔹 180 mm ≈ 510 pt = 18.09 cm (fijo)
            columnStyles: {
                0: { cellWidth: 20 },  // Código
                1: { cellWidth: 80 },  // Nombre
                2: { cellWidth: 20 },  // Cantidad
                3: { cellWidth: 30 },  // Precio Unitario
                4: { cellWidth: 30 }   // Precio Final
            },
            margin: { left: 15 }  // 🔹 Alineado estable al lado izquierdo (ajustable)
        });
        margin: { left: (210 - 180) / 2 }  // Centrado en A4
        
        

        let yPosition = doc.lastAutoTable.finalY + 10;

        doc.setFont("helvetica", "bold");
        doc.setFillColor(192, 192, 192);
        doc.rect(135, yPosition, boxWidth, boxHeight, "F");
        doc.text(`Subtotal: ${subtotalEl.innerText}`, 135 + boxWidth - 2, yPosition + 5, { align: "right" });

        doc.setFillColor(173, 216, 230);
        doc.rect(135, yPosition + boxHeight + 1, boxWidth, boxHeight, "F");
        doc.text(`IGV (18%): ${igvEl.innerText}`, 135 + boxWidth - 2, yPosition + boxHeight + 1 + 5, { align: "right" });

        doc.setFillColor(255, 255, 50);
        doc.rect(135, yPosition + 2 * (boxHeight + 1), boxWidth, boxHeight, "F");
        doc.text(`Total: ${totalEl.innerText}`, 135 + boxWidth - 2, yPosition + 2 * (boxHeight + 1) + 5, { align: "right" });

        // 2. Imagen intermedia
        const imgWidthInter = 160;
        const imgHeightInter = 60;
        let imgYInter = yPosition + 2 * (boxHeight + 1) + 15;
        doc.addImage(imagenIntermedia, "PNG", 30, imgYInter, imgWidthInter, imgHeightInter);

        // 3. Imagen pie de página
        const imgWidthPie = 170;
        const imgHeightPie = 8;
        let imgYPie = imgYInter + imgHeightInter + 5;
        doc.addImage(imagenPie, "PNG", 20, imgYPie, imgWidthPie, imgHeightPie);
        // Posicionar texto debajo de la imagen pie de página
let contactoY = imgYPie + imgHeightPie + 4; // 2 unidades debajo de imagen pie

// Texto sin fondo, justificado y color negro
doc.setFont("helvetica", "normal");
doc.setFontSize(8);
doc.setTextColor(0, 0, 0); // Negro
doc.text(
    "OF. PRINCIPAL: PSJ. LAS ALMENDRAS MZ D LT 15 – YARINACOCHA / UCAYALI / CORONEL PORTILLO\n" +
    "SUC. SERVICIO 01: PR CHACUPE N° UC1024 – CHOSICA DEL NORTE / LA VICTORIA / CHICLAYO / LAMBAYEQUE\n" +
    "SUC. SERVICIO 02: MZ B LT 15 AA.HH NUEVO PACHACUTEC SCT1 / VENTANILLA / CALLAO / LIMA.\n",
    20, contactoY, { maxWidth: 170, align: "justify" }
);


      guardarPdfConNombrePersonalizado(doc, nombre, servicio, numeroProforma);

    });

    function imprimirLineaConEstilos(doc, segmentos, x, y) {
        let offsetX = x;
        segmentos.forEach(segmento => {
            doc.setFont("helvetica", segmento.bold ? "bold" : "normal");
            doc.text(segmento.text, offsetX, y);
            offsetX += doc.getTextWidth(segmento.text);
        });
    }
    // ✅ Función para actualizar el número de proforma desde el input
window.actualizarProforma = function () {
    const inputValor = document.getElementById('inputProforma').value.trim();
    const spanProforma = document.getElementById('numeroProforma');

    if (inputValor !== "") {
        spanProforma.textContent = inputValor;
        alert(`✅ Proforma actualizada a: ${inputValor}`);
    } else {
        alert("⚠️ Por favor ingresa un número de proforma válido.");
    }
};// ✅ FUNCIÓN PARA GUARDAR PDF CON NOMBRE PERSONALIZADO + MENSAJE ÉXITO + OPCIONES COMPARTIR
function guardarPdfConNombrePersonalizado(doc, nombre, servicio, numeroProforma) {
    let nombreCliente = nombre.replace(/\s+/g, "_").toUpperCase().substring(0, 20) || "CLIENTE";
    let nombreServicio = servicio.replace(/\s+/g, "_").toUpperCase().substring(0, 20) || "SERVICIO";
    let nombreArchivo = `${nombreCliente}_${nombreServicio}_PROFORMA_${numeroProforma}.pdf`;

    // 📝 Pregunta si quiere guardar así
    let nuevoNombre = prompt(
        `📝 NOMBRE SUGERIDO DEL PDF:\n\n${nombreArchivo}\n\n✏️ Puedes editarlo si deseas guardar con otro nombre.\n\n¿Deseas continuar con este nombre?`,
        nombreArchivo
    );

    if (!nuevoNombre) {
        alert("❌ Exportación cancelada.");
        return;
    }

    // 🟢 Guardar PDF
    
    setTimeout(() => {
        doc.save(nuevoNombre);
    }, 500); // Retraso para asegurar que el archivo se genere bien en móviles
    

    // ✅ Ventana de éxito con opciones de compartir
    setTimeout(() => {
        const successDiv = document.createElement("div");
        successDiv.innerHTML = `
            <div style="
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #28a745, #218838);
                color: white; padding: 20px 25px; border-radius: 12px; text-align: center;
                box-shadow: 0 0 15px rgba(0,0,0,0.3); z-index: 9999; font-family: Arial;
            ">
                ✅ <strong>Tu archivo fue exportado con éxito</strong><br>
                📤 ¿Deseas compartirlo?<br><br>
                <button onclick="window.open('https://wa.me/?text=Te%20env%C3%ADo%20una%20proforma', '_blank')" style="margin: 5px; padding: 6px 10px; border:none; background:#25D366; color:white; border-radius:6px;">WhatsApp</button>
                <button onclick="window.open('https://facebook.com/sharer/sharer.php?u=https://tu-enlace.com', '_blank')" style="margin: 5px; padding: 6px 10px; border:none; background:#4267B2; color:white; border-radius:6px;">Facebook</button>
                <button onclick="window.location.href='mailto:?subject=Proforma&body=Adjunto%20una%20proforma'" style="margin: 5px; padding: 6px 10px; border:none; background:#FF5E00; color:white; border-radius:6px;">Correo</button>
                <br><br>
                <small>Ventana se cerrará en 30 segundos...</small>
            </div>
        `;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }, 500);
}


});

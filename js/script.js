// ▶ BOTÓN MOSTRAR OPCIONES
document.getElementById("btnMostrarOpciones").addEventListener("click", function () {
    const opciones = document.getElementById("opcionesBusqueda");
    const campo = document.getElementById("campoBusqueda");
    opciones.style.display = opciones.style.display === "none" || opciones.style.display === "" ? "block" : "none";
    campo.style.display = "none"; // Oculta campo búsqueda si vuelven a mostrar opciones
});

// ▶ OPCIONES DE BÚSQUEDA
const botonesOpciones = document.querySelectorAll(".opcion-btn");
const campoBusqueda = document.getElementById("campoBusqueda");
const labelBusqueda = document.getElementById("labelBusqueda");
const inputBusqueda = document.getElementById("inputBusqueda");

botonesOpciones.forEach(btn => {
    btn.addEventListener("click", function () {
        const tipo = btn.getAttribute("data-tipo");
        let label = "", placeholder = "";

        if (tipo === "camion") {
            label = "Buscar por Placa de Camión 🚛";
            placeholder = "Ej: ABC123";
        } else if (tipo === "grua") {
            label = "Buscar por Placa de Grúa 🏗️";
            placeholder = "Ej: GRU456";
        } else if (tipo === "ruc") {
            label = "Buscar por RUC Cliente 🧾";
            placeholder = "Ej: 20123456789";
        }

        labelBusqueda.textContent = label;
        inputBusqueda.placeholder = placeholder;
        inputBusqueda.value = "";

        document.getElementById("opcionesBusqueda").style.display = "none";
        campoBusqueda.style.display = "block";
    });
});
const clientesBase = [
    {
        placaCamion: "ABC123",
        placaGrua: "GRU456",
        ruc: "20123456789",
        nombre: "Cliente A SAC",
        direccion: "Av. Principal 123",
        servicio: "Mantenimiento general",
        lugar: "Lima",
        camion: "Camión A",
        kilometraje: "5000km",
        horometro: "120h",
        maquinaria: "Grúa X",
        modelo: "GX-200",
        serie: "0001",
        anio: "2020",
        fecha: "01/01/2024"
    },
    {
        placaCamion: "B6M-880",
        placaGrua: "",
        ruc: "20103117560",
        nombre: "Electronorte S.A.",
        direccion: "Cal. San Martín N°250- Chiclayo",
        servicio: "reparación general de camion",
        lugar: "PR. Chacupe N° UC10264",
        camion: "Hyundai HD72",
        kilometraje: "sin registro por tarjeta averiada",
        horometro: "sin registro por tarjeta averiada",
        maquinaria: "Grúa de brazo articulada- SKYRITZ",
        modelo: "SKYRITZ-137L7DI",
        serie: "07,000",
        anio: "2007",
        fecha: ""
    },
    {
        placaCamion: "EAG-104",
        placaGrua: "",
        ruc: "20103117560",
        nombre: "Electronorte S.A.",
        direccion: "AV, Sáenz Peña N° 1750-Chiclayo",
        servicio: "Mantenimiento correctivo de la bomba de agua",
        lugar: "PR. CHACUPE N° 10264 -CHICLAYO",
        camion: "INTERNATIONAL-MV607 SBA",
        kilometraje: "8,572 KM",
        horometro: "",
        maquinaria: "GRUA ARTICULADA-TEREX",
        modelo: "HR-55",
        serie: "2200772073",
        anio: "2020",
        fecha: ""
    },
    {
        placaCamion: "B6M-880",
        placaGrua: "",
        ruc: "20103117560",
        nombre: "Electronorte S.A.",
        direccion: "Cal. San Martín N°250- Chiclayo",
        servicio: "reparación general de camion",
        lugar: "PR. Chacupe N° UC10264",
        camion: "Hyundai HD72",
        kilometraje: "sin registro por tarjeta averiada",
        horometro: "sin registro por tarjeta averiada",
        maquinaria: "Grúa de brazo articulada- SKYRITZ",
        modelo: "SKYRITZ-137L7DI",
        serie: "07,000",
        anio: "2007",
        fecha: ""
    },
    {
        placaCamion: "EAF-014",
        placaGrua: "",
        ruc: "20103117560",
        nombre: "Electronorte S.A.",
        direccion: "AV, Sáenz Peña N° 1750",
        servicio: "Mantenimiento correctivo de grúa",
        lugar: "Chiclayo",
        camion: "INTERNATIONAL",
        kilometraje: "",
        horometro: "",
        maquinaria: "GRUA ARTICULADA",
        modelo: "4300 SBA 4X2",
        serie: "3HAMMMMR4JL055119",
        anio: "",
        fecha: ""
    },
    {
        placaCamion: "EAF-641",
        placaGrua: "",
        ruc: "20103117560",
        nombre: "Electronorte S.A.",
        direccion: "AV, Sáenz Peña N° 1750-Chiclayo",
        servicio: "Engrase y restauración de parachoques",
        lugar: "PR. CHACUPE N° 10264 –CHICLAYO",
        camion: "INTERNATIONAL",
        kilometraje: "22256.5 KM",
        horometro: "",
        maquinaria: "GRUA ARTICULADA",
        modelo: "4300 SBA 4X2",
        serie: "3HAMMMMR6JL220443",
        anio: "2018",
        fecha: ""
    },
    {
        placaCamion: "F9F-717",
        placaGrua: "",
        ruc: "20103117560",
        nombre: "Electronorte S.A.",
        direccion: "Cal. San Martín N°250- Chiclayo",
        servicio: "Mantenimiento Correctivo",
        lugar: "Chiclayo-UC10264",
        camion: "FORDCA 1161P7K214",
        kilometraje: "INOPERATIVO",
        horometro: "NO CUENTA",
        maquinaria: "Grúa articulada- Masal",
        modelo: "MS6503",
        serie: "0234",
        anio: "1996",
        fecha: ""
    },
    {
        placaCamion: "B6H-852",
        placaGrua: "",
        ruc: "20103117560",
        nombre: "Electronorte S.A.",
        direccion: "Cal. San Martín N°250",
        servicio: "Reemplazo de muelles",
        lugar: "PR. Chacupe N° UC10264",
        camion: "Hyundai HD72",
        kilometraje: "sin registro por tarjeta averiada",
        horometro: "sin registro por tarjeta averiada",
        maquinaria: "Grúa de brazo articulada- SKYRITZ",
        modelo: "13L/DI",
        serie: "07,0004",
        anio: "2007",
        fecha: ""
    },
    {
        placaCamion: "C4R-876",
        placaGrua: "",
        ruc: "20103117560",
        nombre: "Electronorte S.A.",
        direccion: "Cal. San Martín N°250- Chiclayo",
        servicio: "",
        lugar: "Chiclayo-UC10264",
        camion: "FAW-j5-280",
        kilometraje: "141534.3",
        horometro: "775 H",
        maquinaria: "Grúa articulada- PALFINGER",
        modelo: "PK18500",
        serie: "100123623",
        anio: "2010",
        fecha: ""
    },
    {
        placaCamion: "C4S-896",
        placaGrua: "",
        ruc: "20103117560",
        nombre: "Electronorte S.A.",
        direccion: "Cal. San Martin N° 250-Chiclayo",
        servicio: "Reparación de pistón de prolonga",
        lugar: "",
        camion: "FAW-j5-280",
        kilometraje: "169664.8 KM",
        horometro: "",
        maquinaria: "Grúa articulada – PALFINGER",
        modelo: "PK18500",
        serie: "100123623",
        anio: "2010",
        fecha: ""
    },
    {
        placaCamion: "V6S-938",
        placaGrua: "",
        ruc: "20103117560",
        nombre: "Electronorte S.A.",
        direccion: "AV, Sáenz Peña N° 1750",
        servicio: "Mantenimiento correctivo",
        lugar: "Chiclayo",
        camion: "SCANIA",
        kilometraje: "",
        horometro: "",
        maquinaria: "Grúa de brazo articulada",
        modelo: "HIAB 1165 AW",
        serie: "6119",
        anio: "1980",
        fecha: ""
    }
];

document.getElementById("btnBuscarClienteFinal").addEventListener("click", function () {
    const criterio = labelBusqueda.textContent;
    const valorBusqueda = inputBusqueda.value.trim().toUpperCase();

    if (valorBusqueda === "") {
        alert("⚠️ Ingresa un valor para buscar.");
        return;
    }

    let clienteEncontrado = null;

    if (criterio.includes("Camión")) {
        clienteEncontrado = clientesBase.find(cli => cli.placaCamion.toUpperCase() === valorBusqueda);
    } else if (criterio.includes("Grúa")) {
        clienteEncontrado = clientesBase.find(cli => cli.placaGrua.toUpperCase() === valorBusqueda);
    } else if (criterio.includes("RUC")) {
        clienteEncontrado = clientesBase.find(cli => cli.ruc === valorBusqueda);
    }

    if (clienteEncontrado) {
        // ✅ RELLENAR CAMPOS
        document.getElementById("clienteNombre").value = clienteEncontrado.nombre;
        document.getElementById("clienteRUC").value = clienteEncontrado.ruc;
        document.getElementById("clienteDireccion").value = clienteEncontrado.direccion;
        document.getElementById("clienteServicio").value = clienteEncontrado.servicio;
        document.getElementById("clienteLugar").value = clienteEncontrado.lugar;
        document.getElementById("clienteCamion").value = clienteEncontrado.camion;
        document.getElementById("clientePlaca").value = clienteEncontrado.placaCamion;
        document.getElementById("clienteKilometraje").value = clienteEncontrado.kilometraje;
        document.getElementById("clienteHorometro").value = clienteEncontrado.horometro;
        document.getElementById("clienteMaquinaria").value = clienteEncontrado.maquinaria;
        document.getElementById("clienteModelo").value = clienteEncontrado.modelo;
        document.getElementById("clienteSerie").value = clienteEncontrado.serie;
        document.getElementById("clienteAnio").value = clienteEncontrado.anio;
        document.getElementById("clienteFecha").value = clienteEncontrado.fecha;

        
    Swal.fire({
        icon: "success",
        title: "Cliente encontrado",
        text: "Los datos se han cargado correctamente.",
        timer: 2000,
        showConfirmButton: false,
    });
    

    } else {
        alert("❌ Cliente NO encontrado. Verifica la información.");
    }

    // 🔄 Volver al estado normal
    campoBusqueda.style.display = "none";
    document.getElementById("opcionesBusqueda").style.display = "none";
});
const nombre = document.getElementById('clienteNombre').value || "";
// etc...

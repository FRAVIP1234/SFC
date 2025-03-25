document.addEventListener("DOMContentLoaded", function () {
    const loginPage = "loing.html"; // Corrige el nombre del archivo de login
    const homePage = "principal/index.html"; // Asegura la ruta correcta

    // Verificar si el usuario está autenticado en sessionStorage
    const isAuthenticated = sessionStorage.getItem("auth") === "true";

    // Si el usuario no está autenticado y está en index.html, redirigir al login
    if (!isAuthenticated && window.location.pathname.includes("principal/index.html")) {
        setTimeout(() => {
            window.location.replace(loginPage);
        }, 500);
    }
});

// Función para cerrar sesión
function logout() {
    sessionStorage.removeItem("auth");
    window.location.replace("loing.html"); // Redirigir al login corregido
}

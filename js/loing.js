document.addEventListener("DOMContentLoaded", () => {
  // Datos de usuario predefinidos para pruebas
  const usuarioDefecto = "servicios";
  const contrasenaDefecto = "chiclayo";

  // Guardar credenciales solo si no existen en localStorage (para evitar sobreescritura)
  if (!localStorage.getItem("usuario")) {
    localStorage.setItem("usuario", usuarioDefecto);
    localStorage.setItem("contrasena", contrasenaDefecto);
  }

  // Elementos del DOM
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const loginContainer = document.getElementById("loginContainer");
  const splash = document.getElementById("splash");
  const usernameInput = document.getElementById("username");

  // Función para mostrar u ocultar la contraseña
  togglePasswordBtn.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    togglePasswordBtn.textContent = passwordInput.type === "password" ? "👁️" : "🙈";
  });

  // Validar el inicio de sesión
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMessage.textContent = "";

    const usuarioIngresado = usernameInput.value.trim();
    const contrasenaIngresada = passwordInput.value.trim();
    const usuarioAlmacenado = localStorage.getItem("usuario");
    const contrasenaAlmacenada = localStorage.getItem("contrasena");

    if (usuarioIngresado === "" || contrasenaIngresada === "") {
      errorMessage.textContent = "Los campos no pueden estar vacíos";
      return;
    }

    if (usuarioIngresado === usuarioAlmacenado && contrasenaIngresada === contrasenaAlmacenada) {
      sessionStorage.setItem("auth", "true");
      sessionStorage.setItem("usuario", usuarioIngresado);

      // Redirigir a index.html después de 1.5 segundos
      setTimeout(() => {
        window.location.href = "principal/index.html";
      }, 1500);
    } else {
      errorMessage.textContent = "Usuario o contraseña incorrectos";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario o contraseña incorrectos",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });

  // Mostrar el login tras el splash
  window.addEventListener("load", () => {
    setTimeout(() => {
      splash.classList.add("fade-out");
      setTimeout(() => {
        splash.style.display = "none";
        loginContainer.style.display = "block";
      }, 1000);
    }, 3000);
  });
});

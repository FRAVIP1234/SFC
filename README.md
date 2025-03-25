<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SFC</title>
  <link rel="stylesheet" href="css/loing.css">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

</head>
<body>
  <!-- Splash de bienvenida -->
  <div class="splash" id="splash">
    <img src="https://i.postimg.cc/x8G4McbX/2.png" alt="Logo de la Empresa" class="logo">
    <h1>Bienvenido a Services For Cranes Of Peru SAC</h1>
  </div>

  
  <!-- Contenedor de login -->
  <div class="login-container" id="loginContainer" style="display:none;">
    <h2>Iniciar Sesión</h2>
    <form id="loginForm">
      <div class="input-group">
        <label for="username">Usuario</label>
        <input type="text" id="username" placeholder="Ingresa tu usuario" required maxlength="20">
      </div>
      <div class="input-group">
        <label for="password">Contraseña</label>
        <div class="password-wrapper">
          <input type="password" id="password" placeholder="Ingresa tu contraseña" required maxlength="20">
          <button type="button" id="togglePassword">👁️</button>
        </div>
      </div>
      <button onclick="login()" type="submit" id="loginBtn">Ingresar</button>
    </form>
    <p id="errorMessage" class="error"></p>
    <a href="#" id="forgotPassword">¿Olvidaste tu contraseña?</a>
  </div>

  <!-- Contenedor de bienvenida tras el login -->
  <div class="welcome-container" id="welcomeContainer" style="display:none;">
    <img src="https://i.postimg.cc/pdy44W3S/1.png" alt="Logo de la Empresa" class="logo-small">
    <h2>¡Bienvenido, <span id="userNameDisplay"></span>!</h2>
    <p>Has iniciado sesión correctamente.</p>
  </div>

  <script src="js/loing.js"></script>
  <script src="js/redirect.js"></script>
</body>
</html>   

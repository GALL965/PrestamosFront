const BASE_URL = "https://prestamosback-zfcp.onrender.com";

// 🔹 Función para registrar alumno
async function registrarAlumno(nombre, correo, contraseña) {
  const API_URL = `${BASE_URL}/api/usuarios`;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombre,
        correo: correo,
        matricula: generarMatriculaTemporal(),
        rol: "Estudiante",
        contraseña: contraseña
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Alumno registrado correctamente");
      window.location.href = "login.html";
    } else {
      alert("❌ Error en el registro: " + JSON.stringify(data));
    }
  } catch (err) {
    alert("❌ Error de conexión al servidor");
    console.error(err);
  }
}

// 🔹 Generador de matrícula temporal
function generarMatriculaTemporal() {
  return "TEMP" + Math.floor(Math.random() * 10000);
}

// 🔹 Función para registrar administrador
window.registrarAdministrador = async function () {
  const nombre = document.getElementById("nombre-admin").value.trim();
  const matricula = document.getElementById("matricula-admin").value.trim();
  const correo = document.getElementById("correo-admin").value.trim();
  const contraseña = document.querySelector("#form-admin input[type='password']").value.trim();

  console.log("📤 Enviando administrador:", nombre, matricula);

  try {
    const res = await fetch(`${BASE_URL}/api/usuarios/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, matricula, correo, contraseña })
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Cuenta de administrador creada");
    } else {
      alert("❌ " + data.error);
    }
  } catch (err) {
    alert("❌ Error al conectar con el servidor.");
    console.error(err);
  }
};

// 🔹 Función para login de alumno
window.loginAlumno = async function () {
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  if (!correo || !contrasena) {
    alert("❌ Llena todos los campos");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await res.json();
    console.log("🔐 Respuesta login alumno:", data);

    if (res.ok && data.rol === "alumno") {
      localStorage.setItem("idUsuario", data.id);
      localStorage.setItem("nombreUsuario", data.nombre);
      localStorage.setItem("fotoPerfilAlumno", data.foto || "");
      window.location.href = "../pantallasalumno/menualumno.html";
    } else {
      alert("❌ Credenciales incorrectas o no eres alumno");
    }
  } catch (err) {
    console.error("❌ Error de login alumno:", err);
    alert("❌ No se pudo conectar al servidor");
  }
};

// 🔹 Función para login de administrador
window.loginAdministrador = async function () {
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  if (!correo || !contrasena) {
    alert("❌ Llena todos los campos");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await res.json();
    console.log("🔐 Respuesta login admin:", data);

    if (res.ok && data.rol === "administrador") {
      localStorage.setItem("idAdmin", data.id);
      localStorage.setItem("nombreAdmin", data.nombre);
      localStorage.setItem("fotoPerfilAdmin", data.foto || "");
      window.location.href = "../pantallasadministrador/menuadministrador.html";
    } else {
      alert("❌ Credenciales incorrectas o no eres administrador");
    }
  } catch (err) {
    console.error("❌ Error de login administrador:", err);
    alert("❌ No se pudo conectar al servidor");
  }
};

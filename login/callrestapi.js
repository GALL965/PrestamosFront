const API_URL = "http://localhost:3000/api/usuarios";

async function registrarAlumno(nombre, contraseña) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombre,
        matricula: generarMatriculaTemporal(),
        rol: "Estudiante",
        contraseña: contraseña
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Alumno registrado correctamente");
    } else {
      alert("❌ Error en el registro: " + JSON.stringify(data));
    }
  } catch (err) {
    alert("❌ Error de conexión al servidor");
    console.error(err);
  }
}

function generarMatriculaTemporal() {
  return "TEMP" + Math.floor(Math.random() * 10000);
}



window.registrarAdministrador = async function () {
  const nombre = document.getElementById("nombre-admin").value.trim();
  const matricula = document.getElementById("matricula-admin").value.trim();
  const contraseña = document.querySelector("#form-admin input[type='password']").value.trim();

  console.log("📤 Enviando administrador:", nombre, matricula);

  try {
    const res = await fetch("http://localhost:3000/api/usuarios/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, matricula, contraseña })
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

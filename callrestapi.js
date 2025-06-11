const BASE_URL = "https://prestamosback-zfcp.onrender.com";

// 🔹 Función para registrar alumno

async function registrarAlumno(nombre, correo, contraseña) {
  const file = document.getElementById("foto-alumno").files[0];
  let fotoBase64 = "";

  if (file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      fotoBase64 = e.target.result;

      const API_URL = `${BASE_URL}/api/usuarios`;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo,
          matricula: generarMatriculaTemporal(),
          rol: "Estudiante",
          contraseña,
          foto: fotoBase64
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Alumno registrado correctamente");
        window.location.href = "iniciarseccion.html";
      } else {
        alert("❌ Error en el registro: " + JSON.stringify(data));
      }
    };
    reader.readAsDataURL(file);
  } else {
    // Si no subió imagen, manda vacío
    const res = await fetch(`${BASE_URL}/api/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        correo,
        matricula: generarMatriculaTemporal(),
        rol: "Estudiante",
        contraseña,
        foto: ""
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Alumno registrado correctamente");
      window.location.href = "iniciarseccion.html";
    } else {
      alert("❌ Error en el registro: " + JSON.stringify(data));
    }
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
    console.log("🔍 DEBUG loginAlumno:", data);

    // Verifica si la respuesta tiene data.usuario o data plano
    if (res.ok && data.usuario?.rol === "Estudiante") {
      localStorage.setItem("alumnoLogueado", JSON.stringify(data.usuario));
      window.location.href = "../pantallasalumno/menualumno.html";

    } else if (res.ok && data.rol === "Estudiante") {
      localStorage.setItem("alumnoLogueado", JSON.stringify(data));
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
    console.log("🔐 Respuesta login admin (raw):", data);
    console.log("🔐 Respuesta login admin:", data);
     if (res.ok && (data.rol === "administrador" || data.rol === "Proveedor")) {
  localStorage.setItem("idAdmin", data.id_usuario);
  localStorage.setItem("nombreAdmin", data.nombre);
  localStorage.setItem("fotoPerfilAdmin", data.foto || "");
  window.location.href = "../pantallasadministrador/menuadministrador.html";
}
    
 else {
      alert("❌ Credenciales incorrectas o no eres administrador");
    }
  } catch (err) {
    console.error("❌ Error de login administrador:", err);
    alert("❌ No se pudo conectar al servidor");
  }
};


// 🔹 Función para registrar artículo desde pantalla del admin
window.registrarArticulo = async function () {
  const nombre = document.getElementById("articulo").value.trim();
  const categoria = document.getElementById("categoria").value;
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const idProveedor = localStorage.getItem("idUsuario") || localStorage.getItem("idAdmin");

  if (!nombre || !categoria || !cantidad || isNaN(cantidad)) {
    alert("❌ Todos los campos son obligatorios y válidos.");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/articulos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, categoria, cantidad, id_proveedor: idProveedor })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Artículo registrado correctamente");
      document.getElementById("articulo").value = "";
      document.getElementById("cantidad").value = "";
    } else {
      alert("❌ Error en registro: " + data.error);
    }
  } catch (err) {
    console.error("❌ Error en registrarArticulo:", err);
    alert("❌ No se pudo conectar al servidor.");
  }
};


window.obtenerPrestamosAlumno = async function () {
  const alumno = JSON.parse(localStorage.getItem("alumnoLogueado"));
  if (!alumno) return alert("No se encontró sesión activa");

  try {
    const res = await fetch(`${BASE_URL}/api/prestamos/alumno/${alumno.id_usuario}`);
    const prestamos = await res.json();

    const tbody = document.getElementById("tablaPrestamos");
    tbody.innerHTML = ""; // limpia tabla

    prestamos.forEach(p => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.nombre_alumno}</td>
        <td>${p.fecha}</td>
        <td>${p.hora_inicio}</td>
        <td>${p.hora_fin}</td>
        <td>${p.nombre_articulo}</td>
        <td>${p.cantidad}</td>
        <td>Activo</td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error("❌ Error al cargar préstamos del alumno:", err);
    alert("No se pudieron cargar los préstamos.");
  }
};


window.eliminarTodosLosPrestamos = async function () {
  const alumno = JSON.parse(localStorage.getItem("alumnoLogueado"));
  if (!alumno) return alert("⚠️ No hay sesión activa");

  if (!confirm("¿Estás seguro de eliminar todos tus préstamos?")) return;

  try {
    const res = await fetch(`${BASE_URL}/api/prestamos/alumno/${alumno.id_usuario}`, {
      method: "DELETE"
    });

    const data = await res.json();
    alert(data.mensaje || "Préstamos eliminados");
    location.reload();
  } catch (err) {
    console.error("❌ Error al eliminar préstamos:", err);
    alert("Error al eliminar los préstamos.");
  }
};

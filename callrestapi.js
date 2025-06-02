const API_URL = "https://prestamosback-zfcp.onrender.com/api/usuarios";

// Función para registrar un nuevo usuario
async function registrarUsuario(nombre, matricula, rol, contraseña, correo) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, matricula, rol, contraseña, correo })
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Usuario registrado correctamente");
    } else {
      alert("❌ Error: " + JSON.stringify(data));
    }
  } catch (err) {
    console.error("Error en el fetch:", err);
  }
}

// Función para obtener lista de usuarios
async function obtenerUsuarios() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    console.log("Usuarios:", data);
    return data;
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
  }
}


async function registrarAdministrador() {
  const nombre = document.getElementById("nombre-admin").value.trim();
  const matricula = document.getElementById("matricula-admin").value.trim();
  const contraseña = document.querySelector("#form-admin input[type='password']").value.trim();
  const correo = document.getElementById("correo-admin").value.trim();

  console.log("📤 Enviando administrador:", nombre, matricula);

  try {
    const res = await fetch("http://localhost:3000/api/usuarios/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, matricula, contraseña, correo })
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
}




window.registrarArticulo = async function () {
  const categoria = document.getElementById("categoria").value;
  const nombre = document.getElementById("articulo").value.trim();
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const id_proveedor = parseInt(localStorage.getItem("idUsuario"));

  console.log("INTENTO DE REGISTRO:", { categoria, nombre, cantidad, id_proveedor });

  if (!categoria || !nombre || !cantidad || !id_proveedor) {
    alert("❌ Todos los campos son obligatorios");
    return;
  }

  const nuevoArticulo = {
    categoria,
    nombre,
    cantidad,
    id_proveedor
  };

  try {
    const res = await fetch("http://localhost:3000/api/articulos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoArticulo)
    });

    const data = await res.json();
    console.log("RESPUESTA:", data);

    if (res.ok) {
      alert("✅ Artículo registrado correctamente");
    } else {
      alert("❌ Error: " + data.error);
    }
  } catch (err) {
    console.error("❌ Error de conexión:", err);
    alert("❌ Error al conectar con el servidor");
  }
};


window.loginAdministrador = async function () {
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value.trim();

  if (!correo || !contrasena) {
    alert("❌ Llena todos los campos");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena })
    });

    const data = await res.json();
    console.log("🔐 Respuesta login:", data);

    if (res.ok && data.rol === "administrador") {
      // 👇 Aquí se guarda todo lo que necesitás
      localStorage.setItem("idAdmin", data.id); // asegúrate que el backend lo mande como 'id'
      localStorage.setItem("nombreAdmin", data.nombre);
      localStorage.setItem("fotoPerfilAdmin", data.foto || "");

      window.location.href = "../pantallasadministrador/menuadministrador.html";
    } else {
      alert("❌ Credenciales incorrectas o no eres administrador");
    }
  } catch (err) {
    console.error("❌ Error de login:", err);
    alert("❌ No se pudo conectar al servidor");
  }
};

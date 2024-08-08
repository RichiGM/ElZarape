const btnModificar = document.getElementById("btnModificar");
const btnEliminar = document.getElementById("btnEliminar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnAgregar = document.getElementById("btnAgregar");
const btnCambiarEstatus = document.getElementById("btnCambiarEstatus");

btnModificar.style.display = "none";
btnEliminar.style.display = "none";
btnCambiarEstatus.style.display = "none";

let obj = []; // Arreglo que se llenará de objetos JSON
let indexUsuarioSeleccionado;

// Cargar datos y actualizar la tabla
function cargarDatos() {
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (usuariosGuardados) {
        obj = JSON.parse(usuariosGuardados);
    } else {
        // Si localStorage está vacío, inicializar con datos predeterminados
        obj = [
            { "username": "admin", "password": "Admin@1234", "estatus": "Activo" }
        ];
        guardarDatos();
    }
    actualizaTabla();
}

function actualizaTabla() {
    let cuerpo = "";
    obj.forEach((elemento, index) => {
        let registro = `
            <tr onclick="selectUsuario(${index});">
                <td>${index + 1}</td>
                <td>${elemento.username}</td>
                <td>${elemento.password}</td>
                <td>${elemento.estatus}</td>
            </tr>`;
        cuerpo += registro;
    });
    document.getElementById("tblUsuarios").innerHTML = cuerpo;
    filtrarUsuarios();
}

// Selecciona un usuario y llena el formulario
function selectUsuario(index) {
    document.getElementById("txtUserName").value = obj[index].username;
    document.getElementById("txtPassword").value = obj[index].password;
    document.getElementById("txtConfirmPassword").value = obj[index].password;
    indexUsuarioSeleccionado = index;

    // Mostrar botones relevantes
    btnModificar.style.display = "inline-block";
    btnEliminar.style.display = "none"; // Ocultar el botón de eliminar
    btnCambiarEstatus.style.display = "inline-block";
    btnLimpiar.style.display = "inline-block";
    btnAgregar.style.display = "none";
}

// Cambia el estatus del usuario seleccionado
function cambiarEstatus() {
    if (indexUsuarioSeleccionado !== undefined) {
        let usuario = obj[indexUsuarioSeleccionado];
        usuario.estatus = (usuario.estatus === "Activo") ? "Baja" : "Activo";
        guardarDatos();
        actualizaTabla();
        selectUsuario(indexUsuarioSeleccionado);
    }
    limpiar();
}

// Limpia el formulario y oculta botones específicos
function limpiar() {
    document.getElementById("txtUserName").value = "";
    document.getElementById("txtPassword").value = "";
    document.getElementById("txtConfirmPassword").value = "";

    // Ocultar botones específicos
    btnModificar.style.display = "none";
    btnEliminar.style.display = "none";
    btnCambiarEstatus.style.display = "none";
    btnLimpiar.style.display = "inline-block";
    btnAgregar.style.display = "inline-block";
}

// Valida la contraseña
function validarPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return regex.test(password);
}

// Genera una contraseña aleatoria que cumpla con las restricciones
function generarPassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";

    while (!validarPassword(password)) {
        password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
    }

    document.getElementById("txtPassword").value = password;
    document.getElementById("txtConfirmPassword").value = password;
}

// Muestra u oculta la contraseña
function togglePasswordVisibility() {
    const passwordField = document.getElementById("txtPassword");
    const confirmPasswordField = document.getElementById("txtConfirmPassword");
    if (passwordField.type === "password") {
        passwordField.type = "text";
        confirmPasswordField.type = "text";
    } else {
        passwordField.type = "password";
        confirmPasswordField.type = "password";
    }
}

// Agrega un nuevo usuario a la lista
function agregarUsuario() {
    let username = document.getElementById("txtUserName").value;
    let password = document.getElementById("txtPassword").value;
    let confirmPassword = document.getElementById("txtConfirmPassword").value;

    if (!validarPassword(password)) {
        alert("La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 carácter especial.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    if (username && password) {
        let newUser = { username, password, estatus: "Activo" };
        obj.push(newUser);

        guardarDatos();
        limpiar();
        actualizaTabla();
    } else {
        alert("Hay campos obligatorios para agregar el Usuario");
    }
}

// Modifica un usuario existente en la lista
function modificarUsuario() {
    if (indexUsuarioSeleccionado !== undefined) {
        let username = document.getElementById("txtUserName").value;
        let password = document.getElementById("txtPassword").value;
        let confirmPassword = document.getElementById("txtConfirmPassword").value;

        if (!validarPassword(password)) {
            alert("La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 carácter especial.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        obj[indexUsuarioSeleccionado] = {
            ...obj[indexUsuarioSeleccionado],
            username,
            password,
            estatus: "Activo"
        };

        guardarDatos();
        actualizaTabla();
        selectUsuario(indexUsuarioSeleccionado);
    }
}

// Elimina el usuario seleccionado de la lista
function eliminarUsuario() {
    if (indexUsuarioSeleccionado !== undefined) {
        obj = obj.filter((_, index) => index !== indexUsuarioSeleccionado);
        guardarDatos();
        limpiar();
        actualizaTabla();
    }
}

// Normaliza el texto para la búsqueda (minúsculas y sin acentos)
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Filtra los usuarios en la tabla según el texto de búsqueda
function filtrarUsuarios() {
    const textoBusqueda = normalizarTexto(document.getElementById("buscarUsuario").value);
    const filas = document.querySelectorAll("#tblUsuarios tr");

    filas.forEach(fila => {
        const username = normalizarTexto(fila.cells[1].textContent);
        const password = normalizarTexto(fila.cells[2].textContent);
        const estatus = normalizarTexto(fila.cells[3].textContent);

        if (username.includes(textoBusqueda) || password.includes(textoBusqueda) || estatus.includes(textoBusqueda)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

// Guarda los datos en localStorage y en el servidor simulado
function guardarDatos() {
    const jsonData = JSON.stringify(obj);
    localStorage.setItem('usuarios', jsonData); // Guardar en localStorage para persistencia
    console.log('Datos guardados localmente');
}

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', cargarDatos);

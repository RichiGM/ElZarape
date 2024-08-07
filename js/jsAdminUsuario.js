/* global fetch */
// Inicializa los botones
const btnModificar = document.getElementById("btnModificar");
const btnEliminar = document.getElementById("btnEliminar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnAgregar = document.getElementById("btnAgregar");
const btnCambiarEstatus = document.getElementById("btnCambiarEstatus");

// Ocultar botones al cargar la página
btnModificar.style.display = "none";
btnEliminar.style.display = "none";
btnCambiarEstatus.style.display = "none";

let obj = []; // Arreglo que se llenará de objetos JSON
let indexUsuarioSeleccionado;

// Cargar datos y actualizar la tabla
fetch('../json/jsonUsuario.json')
    .then(response => response.json())
    .then(jasondata => {
        obj = jasondata;
        console.log(obj);
        actualizaTabla();
    });

// Actualiza la tabla con los datos de obj
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
    filtrarUsuarios(); // Aplicar el filtro al cargar la tabla
}


// Selecciona un combo y llena el formulario
function selectUsuario(index) {
    document.getElementById("txtUserName").value = obj[index].username;
    document.getElementById("txtPassword").value = obj[index].password;
    indexUsuarioSeleccionado = index;

    // Mostrar botones relevantes
    btnModificar.style.display = "inline-block";
    btnEliminar.style.display = "none";
    btnCambiarEstatus.style.display = "inline-block";
    btnLimpiar.style.display = "inline-block";
    btnAgregar.style.display = "none";
}

// Cambia el estatus del combo seleccionado
function cambiarEstatus() {
    if (indexUsuarioSeleccionado !== undefined) {
        let combo = obj[indexUsuarioSeleccionado];
        combo.estatus = (combo.estatus === "Activo") ? "Baja" : "Activo";
        actualizaTabla();
        selectUsuario(indexUsuarioSeleccionado);
    }
    limpiar();
}

// Limpia el formulario y oculta botones específicos
function limpiar() {
    document.getElementById("txtUserName").value = "";
    document.getElementById("txtPassword").value = "";

    // Ocultar botones específicos
    btnModificar.style.display = "none";
    btnEliminar.style.display = "none";
    btnCambiarEstatus.style.display = "none";
    btnLimpiar.style.display = "inline-block";
    btnAgregar.style.display = "inline-block";
}


// Agrega un nuevo combo a la lista
function agregarUsuario() {
    let username = document.getElementById("txtUserName").value;
    let password = document.getElementById("txtPassword").value;

    if (username && password) {
        let newProd = { username, password, estatus: "Activo" };
        obj.push(newProd);

        console.log(JSON.stringify(obj));
        limpiar();
        actualizaTabla();
    } else {
        alert("Hay campos obligatorios para agregar el Usuario");
    }
}

// Modifica un combo existente en la lista
function modificarUsuario() {
    if (indexUsuarioSeleccionado !== undefined) {
        let username = document.getElementById("txtUserName").value;
        let password = document.getElementById("txtPassword").value;

        obj[indexUsuarioSeleccionado] = {
            ...obj[indexUsuarioSeleccionado],
            username,
            password,
            estatus: "Activo"
        };

        console.log(obj[indexUsuarioSeleccionado].username, document.getElementById("txtUserName").value, username);
        actualizaTabla();
        selectUsuario(indexUsuarioSeleccionado);
    }
}

// Elimina el combo seleccionado de la lista
function eliminarUsuario() {
    if (indexUsuarioSeleccionado !== undefined) {
        obj = obj.filter((_, index) => index !== indexUsuarioSeleccionado);
        limpiar();
        actualizaTabla();
    }
}

// Normaliza el texto para la búsqueda (minúsculas y sin acentos)
function normalizarTexto(texto) {
    return texto
        .toLowerCase() // Convertir a minúsculas
        .normalize("NFD") // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, ""); // Eliminar marcas de acento
}

// Filtra los combos en la tabla según el texto de búsqueda
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

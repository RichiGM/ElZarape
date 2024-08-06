/* global fetch */

// Arreglo que se llenará de objetos JSON
let obj = [];

fetch("http://localhost:8080/ElZarape/json/jsonAlimento.json")
        .then(response => response.json())
        .then(jasondata => {
            obj = jasondata;
            console.log(obj);
            actualizaTabla(); // Actualiza la tabla al cargar la página
        });

function actualizaTabla() {
    let cuerpo = "";
    obj.forEach((elemento, index) => {
        let registro = `
            <tr onclick="selectAlimento(${index});">
                <td>${elemento.nombre}</td>
                <td>${elemento.descripcion}</td>
                <td>$${parseFloat(elemento.precio).toFixed(2)}</td>
                <td>${elemento.categoria}</td>
                <td><img src="${elemento.foto}" class="img-thumbnail" width="100" alt="${elemento.nombre}"></td>
            </tr>`;
        cuerpo += registro;
    });
    document.getElementById("tblAlimentos").innerHTML = cuerpo;
    filtrarAlimentos(); // Aplicar el filtro al cargar la tabla
}

function normalizarTexto(texto) {
    return texto
            .toLowerCase() // Convertir a minúsculas
            .normalize("NFD") // Descomponer caracteres acentuados
            .replace(/[\u0300-\u036f]/g, ""); // Eliminar marcas de acento
}

function filtrarTabla() {
    let input = document.getElementById("searchInput");
    let filtro = normalizarTexto(input.value);
    let filas = document.querySelectorAll("#tblAlimentos tr");

    filas.forEach(fila => {
        let nombre = normalizarTexto(fila.cells[0].textContent);
        let descripcion = normalizarTexto(fila.cells[1].textContent);
        let precio = normalizarTexto(fila.cells[2].textContent);
        let categoria = normalizarTexto(fila.cells[3].textContent);

        if (nombre.includes(filtro) || descripcion.includes(filtro) || precio.includes(filtro) || categoria.includes(filtro)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}


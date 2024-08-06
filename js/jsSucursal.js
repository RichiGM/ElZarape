/* global fetch */
// Arreglo que se llenará de objetos JSON
let obj = [];
fetch('./json/jsonSucursal.json')
        .then(response => response.json())
        .then(jasondata => {
            obj = jasondata;
            console.log(obj);
            actualizaTabla(); // Actualiza la tabla al cargar la página
        });

function actualizaTabla() {
    let cuerpo = "";
    obj.forEach(elemento => {
        if (elemento.estatus === "Activo") {
            let registro = `
                <tr>
                    <td>${elemento.nombre}</td>
                    <td>${elemento.direccion}</td>
                    <td>${elemento.latitud}</td>
                    <td>${elemento.longitud}</td>
                    <td><a href="${elemento.url}" target="_blank">${elemento.nombre}</a></td>
                    <td>${elemento.horario}</td>
                    <td><img src="${elemento.foto}" class="img-thumbnail" width="100" alt="${elemento.nombre}"></td>
                </tr>`;
            cuerpo += registro;
        }
    });
    document.getElementById("tblSucursal").innerHTML = cuerpo;
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
    let filas = document.querySelectorAll("#tblSucursal tr");

    filas.forEach(fila => {
        let nombre = normalizarTexto(fila.cells[1].textContent);
        let direccion = normalizarTexto(fila.cells[2].textContent);
        let latitud = normalizarTexto(fila.cells[3].textContent);
        let longitud = normalizarTexto(fila.cells[4].textContent);
        let url = normalizarTexto(fila.cells[5].textContent);
        let horario = normalizarTexto(fila.cells[6].textContent);

        if (nombre.includes(filtro) || direccion.includes(filtro)|| latitud.includes(filtro)|| longitud.includes(filtro)|| url.includes(filtro)|| horario.includes(filtro)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

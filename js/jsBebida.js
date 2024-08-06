/* global fetch */

// Arreglo que se llenará de objetos JSON
let obj = [];

fetch("http://localhost:8080/ElZarape/json/jsonBebida.json")
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
                    <td>${elemento.descripcion}</td>
                    <td>$${parseFloat(elemento.precio).toFixed(2)}</td>
                    <td>${elemento.categoria}</td>
                    <td><img src="${elemento.foto}" class="img-thumbnail" width="100" alt="${elemento.nombre}"></td>
                </tr>`;
            cuerpo += registro;
        }
    });
    document.getElementById("tblBebidas").innerHTML = cuerpo;
}

function normalizarTexto(texto) {
    return texto
            .toLowerCase() // Convertir a minúsculas
            .normalize("NFD") // Descomponer caracteres acentuados
            .replace(/[\u0300-\u036f]/g, ""); // Eliminar marcas de acento
}

function filtrarBebidas() {
    const textoBusqueda = normalizarTexto(document.getElementById("buscarBebida").value);
    const filas = document.querySelectorAll("#tblBebidas tr");

    filas.forEach(fila => {
        const nombre = normalizarTexto(fila.cells[0].textContent);
        const descripcion = normalizarTexto(fila.cells[1].textContent);
        const precio = normalizarTexto(fila.cells[2].textContent);
        const categoria = normalizarTexto(fila.cells[3].textContent);

        if (nombre.includes(textoBusqueda) || descripcion.includes(textoBusqueda) || precio.includes(textoBusqueda) || categoria.includes(textoBusqueda)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

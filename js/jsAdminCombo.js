/* global fetch */
const btnModificar = document.getElementById("btnModificar");
const btnEliminar = document.getElementById("btnEliminar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnAgregar = document.getElementById("btnAgregar");
const btnCambiarEstatus = document.getElementById("btnCambiarEstatus");

btnModificar.style.display = "none";
btnEliminar.style.display = "none";
btnCambiarEstatus.style.display = "none";

let obj = [];
let indexComboSeleccionado;
let fotoBase64 = "";
let alimentosSeleccionados = [];
let bebidasSeleccionadas = [];

// Cargar alimentos y bebidas en los checkboxes
fetch('../json/jsonAlimento.json')
    .then(response => response.json())
    .then(alimentos => {
        let alimentosCheckboxes = document.getElementById("alimentosCheckboxes");
        alimentos.forEach(alimento => {
            let row = document.createElement("tr");
            let checkboxCell = document.createElement("td");
            let cantidadCell = document.createElement("td");
            
            let checkbox = document.createElement("input");
            checkbox.className = "form-check-input";
            checkbox.type = "checkbox";
            checkbox.value = alimento.nombre;
            checkbox.id = `alimento-${alimento.nombre}`;
            checkbox.dataset.nombre = alimento.nombre;

            let label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = `alimento-${alimento.nombre}`;
            label.innerText = alimento.nombre;

            let inputCantidad = document.createElement("input");
            inputCantidad.type = "number";
            inputCantidad.min = "0";
            inputCantidad.value = "0";
            inputCantidad.className = "form-control cantidad-input";
            inputCantidad.dataset.nombre = alimento.nombre;

            inputCantidad.addEventListener('input', function() {
                checkbox.checked = this.value > 0;
            });

            checkboxCell.appendChild(checkbox);
            checkboxCell.appendChild(label);
            cantidadCell.appendChild(inputCantidad);
            row.appendChild(checkboxCell);
            row.appendChild(cantidadCell);
            alimentosCheckboxes.appendChild(row);
        });
    });

fetch('../json/jsonBebida.json')
    .then(response => response.json())
    .then(bebidas => {
        let bebidasCheckboxes = document.getElementById("bebidasCheckboxes");
        bebidas.forEach(bebida => {
            let row = document.createElement("tr");
            let checkboxCell = document.createElement("td");
            let cantidadCell = document.createElement("td");

            let checkbox = document.createElement("input");
            checkbox.className = "form-check-input";
            checkbox.type = "checkbox";
            checkbox.value = bebida.nombre;
            checkbox.id = `bebida-${bebida.nombre}`;
            checkbox.dataset.nombre = bebida.nombre;

            let label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = `bebida-${bebida.nombre}`;
            label.innerText = bebida.nombre;

            let inputCantidad = document.createElement("input");
            inputCantidad.type = "number";
            inputCantidad.min = "0";
            inputCantidad.value = "0";
            inputCantidad.className = "form-control cantidad-input";
            inputCantidad.dataset.nombre = bebida.nombre;

            inputCantidad.addEventListener('input', function() {
                checkbox.checked = this.value > 0;
            });

            checkboxCell.appendChild(checkbox);
            checkboxCell.appendChild(label);
            cantidadCell.appendChild(inputCantidad);
            row.appendChild(checkboxCell);
            row.appendChild(cantidadCell);
            bebidasCheckboxes.appendChild(row);
        });
    });

function generarDescripcion() {
    let descripcion = "";
    let items = [];

    if (alimentosSeleccionados.length > 0) {
        items = items.concat(alimentosSeleccionados.map(item => `${item.cantidad} ${item.nombre}`));
    }
    if (bebidasSeleccionadas.length > 0) {
        items = items.concat(bebidasSeleccionadas.map(item => `${item.cantidad} ${item.nombre}`));
    }

    if (items.length > 0) {
        descripcion = items.slice(0, -1).join(", ") + (items.length > 1 ? " y " : "") + items.slice(-1);
    }

    document.getElementById("txtDescripcion").value = descripcion;
}

// Guardar alimentos seleccionados
function guardarAlimentosSeleccionados() {
    const checkboxes = document.querySelectorAll("#alimentosCheckboxes .form-check-input:checked");
    alimentosSeleccionados = Array.from(checkboxes).map(checkbox => {
        const cantidad = document.querySelector(`#alimentosCheckboxes .cantidad-input[data-nombre="${checkbox.dataset.nombre}"]`).value;
        return { nombre: checkbox.value, cantidad: parseInt(cantidad, 10) };
    }).filter(item => item.cantidad > 0);
    actualizarSeleccionados('selectedAlimentos', alimentosSeleccionados);
    generarDescripcion();
}

// Guardar bebidas seleccionadas
function guardarBebidasSeleccionadas() {
    const checkboxes = document.querySelectorAll("#bebidasCheckboxes .form-check-input:checked");
    bebidasSeleccionadas = Array.from(checkboxes).map(checkbox => {
        const cantidad = document.querySelector(`#bebidasCheckboxes .cantidad-input[data-nombre="${checkbox.dataset.nombre}"]`).value;
        return { nombre: checkbox.value, cantidad: parseInt(cantidad, 10) };
    }).filter(item => item.cantidad > 0);
    actualizarSeleccionados('selectedBebidas', bebidasSeleccionadas);
    generarDescripcion();
}

// Actualiza la visualización de los elementos seleccionados
function actualizarSeleccionados(id, seleccionados) {
    const container = document.getElementById(id);
    container.innerHTML = seleccionados.map(item => `${item.nombre} (${item.cantidad})`).join(', ');
}

// Convierte una imagen a base64
function convertToBase64(event) {
    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    
    if (!allowedTypes.includes(file.type)) {
        alert("Formato de archivo no permitido. Por favor, sube una imagen en formato JPEG, JPG, o PNG.");
        document.getElementById("txtFotoRuta").value = "";
        return;
    }
    
    const reader = new FileReader();
    reader.onloadend = function () {
        fotoBase64 = reader.result;
        document.getElementById("txtFoto").src = fotoBase64;
    };
    reader.readAsDataURL(file);
}

// Selecciona un combo y llena el formulario
function selectCombo(index) {
    document.getElementById("txtNombre").value = obj[index].nombre;
    document.getElementById("txtDescripcion").value = obj[index].descripcion;
    document.getElementById("txtPrecio").value = obj[index].precio;
    document.getElementById("txtFoto").src = obj[index].foto;
    document.getElementById("txtFotoRuta").value = "";
    indexComboSeleccionado = index;

    btnModificar.style.display = "inline-block";
    btnEliminar.style.display = "none";
    btnCambiarEstatus.style.display = "inline-block";
    btnLimpiar.style.display = "inline-block";
    btnAgregar.style.display = "none";
}

// Cambia el estatus del combo seleccionado
function cambiarEstatus() {
    if (indexComboSeleccionado !== undefined) {
        let combo = obj[indexComboSeleccionado];
        combo.estatus = (combo.estatus === "Activo") ? "Baja" : "Activo";
        actualizaTabla();
        selectCombo(indexComboSeleccionado);
    }
    limpiar();
}

// Limpia el formulario y oculta botones específicos
function limpiar() {
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtDescripcion").value = "";
    document.getElementById("txtPrecio").value = "";
    document.getElementById("txtFoto").src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAZABkAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wgALCAPUBEUBAREA/8QAHAABAQEAAgMBAAAAAAAAAAAAAAIHBQYBAwgE/9oACAEBAAAAANuAAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAA9QAAAAAAKsAAAAAAAXAAAAAAAA9fz4AAAAAADvOnAAAAAAAC4AAAAAAAHr+fNd5QAAAAAAzr9mngAAAAAAC4AAAAAAAHr+fNw5cAAAAAAy29PAAAAAAAFwAAAAAAAPX8+bhy4AAAAABlt6eAAAAAAALgAAAAAAAev583DlwAAAAADLb08AAAAAAAXAAAAAAAA9fz5uHLgAAAAAGW3p4AAAAAAAuAAAAAAAB6/nzcOXAAAHjpPVb7p2oAGW3p4AAAAAAAuAAAAAAAB6/nzcOXAAAGZdEGp91ADLb08AAAAAAAXAAAAAAAA9fz5uHLgAAH5MEkfv3kAMtvTwAAAAAABcAAAAAAAD1/Pm4cuAAAcLiIefoSwBlt6eAAAAAAALgAAAAAAAev583DlwAAD1YJ+cc3toAZbengAAAAAAC4AAAAAAAHr+fNw5cATlfPd4AOoZTD9Oxc6AGW3p4AAAAAAAuAAAAAAAB6/nzcOXAJyrp3nT+8AHF9X9nbP2AAy29PAAAAAAAFwAAAAAAAPX8+bhy4Ccq6cedP7wAAADLb08AAAAAAAXAAAAAAAA9fz5uHLgTlXTg86d3kAB1Ds36QMtvTwAAAAAABcAAAAAAAD1/Pm4cuCcq6cB50/vAAOi5jzmx/pBlt6eAAAAAAALgAAAAAAAev583DlwnKunAHnT+8ADomZHObH+kMtvTwAAAAAABcAAAAAAAD1/Pm4cuJyrpwAedP7wA6LmIc5sf6Rlt6eAAAAAAALgAAAAAAAev583Dlycq6cAB507vIOi5iBzmx/pMtvTwAAAAAABcAAAAAAAD1/Pm4cunKunAAHnTu8jouYgHO7F+llt6eAAAAAAALgAAAAAAAev583Dl5yrpwAAedO7y6JmQAc7sX6ctvTwAAAAAABcAAAAAAAD1/Pm4crlXTgAAPOnTmQAHObHm16eAAAAAAALgAAAAAAAev5827oPTgAADz4AAOc5H9mngAAAAAAC4AAAAAAAHr+fOf6+AAAAAAO86eAAAAAAALgAAAAAAAev588AAAAAAB3nTwAAAAAABcAAAAAAAD1/PngAAAAAAO86eAAAAAAALgAAAAAAAev588AAAAAAB3nTwAAAAAABcAAAAAAAD1/PngAAAAAAO86eAAAAAAALgAAAAAAATmvgAAAAAAOwdtAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAVIAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC4AAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAXAAAAAAAAAAAAAAAAAAAAAAAuAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAC//8QARhAAAQICBQQNCgUDBQEAAAAAAQIEAAMFBhFBklBVYXAHFBYXITEyNVNxc5GxEiAwNDZydLLC0RAjQENREyIzFSRSocGB/9oACAEBAAE/ANRCL9RKL9RKL9RMu/USi/USi/USi/USi/USi/USi/UTLv1Eov1Ey79RKL9RMu/USi/USi/UTLv1Eov1Eov1Eov1Ey79RKL9RMu/USi/UTLv1Ey79RMu/USi/UTLv1Ey79RKL9RMu/USi/USi/UTLv1Ey79RKL9RKL9RKL9RKL9RKL9RMu/USi/USi/UTLvyhtlv08rGI2y36eVjEbZb9PKxiNst+nlYxG2W/TysYjbLfp5WMRtlv08rGI2y36eVjEbZb9PKxiNst+nlYxG2W/TysYjbLfp5WMRtlv08rGI2y36eVjEbZb9PKxiNst+nlYxG2W/TysYjbLfp5WMRtlv08rGI2y36eVjEbZb9PKxiNst+nlYxG2W/TysYjbLfp5WMRtlv08rGI2y36eVjEbZb9PKxiNst+nlYxG2W/TysYjbLfp5WMRtlv08rGI2y36eVjEbZb9PKxiNst+nlYxG2W/TysYjbLfp5WMRtlv08rGI2y36eVjEbZb9PKxiNst+nlYxG2W/TysYjbLfp5WMQibLmEhExCiP+KgcnovyfP9Wm+4rwgk+UeE8f8xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFuk98W6T3xbpPfFp/k98bGJJpZ7w/sD5snovye49Wm+4rwhXKPXFXKvUO5q6wnT6NbzJq5IKlqRwkxuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRuXoLNTXBG5egs1NcEbl6CzU1wRsgUe0o6mG8tm3lyEKkeUUoFgJtMbGPO73sB82T0X5PcerTfcV4QrlHriq3stRvYJyRsmc+tfh/qMbGPO73sB82T0X5PcerTfcV4QrlHriq3stRvYJyRsmc+tfh/qMbGPO73sB82T0X5PcerTfcV4QrlHriq3stRvYJyRsmc+tfh/qMbGPO73sB82T5d+T3Hq033FeEK5R64qt7LUb2CckbJnPrX4f6jGxjzu97AfNk9F+T3Hq033FeEK5R64qt7LUb2Cf06lJQkqUQlIFpJNgEU1sitGcxUijZQdTE8BmqNiAdF5ifX6sE5RKXMuUP4RLH/sNdkKnW6wZsyS4TelcsD/sWRQNeaPpiYlvPG1HSuAJWbUqOg/8Ah9Lsmc+tfh/qMbGPO73sB82T5d+T3Hq033FeEK5R64qt7LUb2Cf09fazzHDldEM5hTIlmyepJ5av+PUPMBsNo44qHWZdJSTRjxflOZSbZazxrT/B0j0myZz61+H+oxsY87vewHzZPRfk9x6tN9xXhCuUeuKrey1G9gn9NSrz/T6Jdu75MpSx12cETFqmzFTFklaiVEm8nzaFfLo2mWjtBs/pzBbpHEf+oBBAI4j6PZM59a/D/UY2Med3vYD5snovye49Wm+4rwhXKPXFVvZajewT+mrakrqpSQTx/wBK3/secgErSBxkgCJIKZEsHjCAD3ej2TOfWvw/1GNjHnd72A+bJ6L8nuPVpvuK8IVyj1xVb2Wo3sE+k4hafROm6HbSc3mciagoPURZD9lNo5/PZzk2TJSyk6dPm1TopVLVhbSvJtlS1f1Zp/hI+/F6TZM59a/D/UY2Med3vYD5snovye49Wm+4rwhXKPXFVvZajewT6Na0y0KWtQShItKibABFb65TKTmllR8xSGaD/csGwzSP/IqbXIPgijaSWA6HBKmk/wCTQdPj6KudUjTMvbrJID2Wmwp4v6o/jribJmSJqpU6WqXMSbFJULCD+LFg6pJ0hs0kqmzVcQA4tJ/gRVerkqr1H+QSFupvDOmD+f4Ggek2TOfWvw/1GNjHnd72A+bJ6L8nuPVpvuK8IVyj1xVb2Wo3sE+iWtMtClrUEoSLSomwARXGuK6WWpgwWUskmxSxwGaft+AJSQUkgjhBEVNrkHyUUbSUwByOCVNP7mg6fH0VK1eoymU/7xslS7pif7Vj/wCxP2MGalEyKQnoH8LQFfaGuxnR8tYLl5PnD/ikBIMUdRTGiZP9Ji2RJTeQOE9Z4z6XZM59a/D/AFGNjHnd72A+bJ6L8nuPVpvuK8IVyj1xVb2Wo3sE+hWtMtClrUEoSLSomwARXCuKqVWtgwWUskmxSxwGaft5gJSoKSSCOEERUyuQfJRRtJTAHQ4Jc1X7mg6fH9Tsmc+tfh/qMbGPO73sB82T0X5PcerTfcV4QrlHriq3stRvYJ9AtaZaFLWoJQkWlRNgAiuNcV0tMUwYLKWSTYpY4DNP284EpIIJBHCCLoqZXIPkoo2kl2OQLJU0/uaDp8fT1gr22oikZbRtLDkoV/uCDwJH8DTDB+2pNnLdNJgmSli0EXaDp9Bsmc+tfh/qMbGPO73sB82T0X5PcerTfcV4QrlHriq3stRvYJ89a0y0KWtQShItKibABFca4qpaYpgwWUskmxSxwGaft6AEpIIJBBtBEVNrkHwRRtJTAHIFkqaf3NB0+Ppa51zDMTKMoyYC4PBNnJ/b0DT4QSSSSbSeEkxVqsjmrz3yk2rarP5sm3j0j+DDB+2pNnLdNJgmSli0EXaDp8/ZM59a/D/UY2Med3vYD5snovye49Wm+4rwhXKPXFVvZajewT5y1ploUtaglCRaVE2ACK41xXSy1MGCylkk2KWOAzT9vRAlJBSSCDaCIqbXIPkoo2kpgDkcEqaeKZoOnx9HXOuYZiZRlGTLXB4Js5P7egafCCSSSSSTxk/jVusjmrzzyk2zGqz+bKt49I0wwftqTZS3bSYJkpYtBF2g6fO2TOfWvw/1GNjHnd72A+bJ6L8nuPVpvuK8IVyj1xVb2Wo3sE+ataZaFLWoJQkWlRNgAiuNcVUstTBgspZJNiljgM0/b0gJSoKSSCDaCLoqbXIPQijaSmAORwSpp/c0HT4+hrnXMMxMoyjJlrg/2zZyf29A0+EEkkkm0njJ82rdZHNXnvlJtW1WfzZNvHpGmGD9tSbOW6aTBMlLFoIu0HT5uyZz61+H+oxsY87vewHzZPRfk9x6tN9xXhCuUeuKrey1G9gnzFrTLQpa1BKEi0qJsAEVxriqllqYMFlLJJsUscBmn7emBKVBSSQRwgi6Km1yD4Io2kpgDkCyVNP7mg6fHz651zDMTKMoyZa4PBNnJ/b0DT4QSSSSbSeMnz6t1kc1eeeUm1bVZ/NlW8ekaYYv21JM5bprMEyUsWgi7QdPmbJnPrX4f6jGxjzu97AfNk+Xfk9x6tN9xXhCuUeuKrey1G9gn8VrTLQpa1BKEi0qJsAEVxriqlVrYMFlLJJsUscc0/b9AlRSQQSCOEEXRU2uQfBFG0lMAcgWSpp/c0HT4+bXOuYZiZRlGTLXB4Js5J/x6Bp8IJJJJNpPGT6GrVZXNXnnlC2Y1WfzZVvHpGmGL9tSTOW6aTRMlLFoIu0HT+OyZz61+H+oxsY87vewHzZPRfk9x6tN9xXhCuUeuKrey1G9gn8FrTLQpa1BKEi0qJsAEVwriqlZimDBZSySbFLHAZp+36IEpIIJBHCCLoqbXIPkoo2kpgDkCyVNUf8AJoOnx/GudcwzEyjKMmWuDwTZyT/j0DT4QSSSSbSeMn0dWqyuavPPKTbMarP5sm3j0jTDF82pJnLdNJgmSli0EXaDp/DZM59a/D/UY2Med3vYD5snovye49Wm+4rwhXKPXFVvZajewTC1ploUtaglCRaVE2ACK41xVSy1MGCylkk2KWOAzT9v0gJSoKBII4QRFTa5B8lFG0lMAdDglTVfuaDp8YrnXMMxMoyjJgLg8E2ck/49A0+EEkkkm0njJ9LVqsrmr7zyk2zGqz+bKt49I0wwftqSZy3bSYJkpYtBF2g6Y2TOfWvw/wBRjYx53e9gPmyei/J7j1ab7ivCFco9cVZWmXVOj1rUEoS3BKibABFcK4qpVamDBZSySbFLHAZp+36YEgggkEcREEkkkm0m8+nq1WVzV955SbZjVZ/Nk28ekaYr8/bUlSLF20miZKmNgQRd/ceA6Y2Med3vYD5snovye49Wm+4rwhXKPXFI1ocOaCZ0RItlN5MoJmm3hmH7ZJ2Med3vYD5snovye49Wm+4rwhXKPXkrYx53e9gPmyei/J7j1ab7ivCFco9eStjHnd72A+bJ6L8nuPVpvuK8IVyj15K2Med3vYD5snovye49Wm+4rwhXKPXkrYx53e9gPmyei/J8xPlyloHB5SSIOxg9JJ/1FvgVG9g9zi3wKjewe5xb4FRvYPc4t8Co3sHucW+BUb2D3OLfAqN7B7nFvgVG9g9zi3wKjewe5xb4FRvYPc4t8Co3sHucW+BUb2D3OLfAqN7B7nFvgVG9g9zi3wKjewe5xb4FRvYPc4t8Co3sHucW+BUb2D3OLfAqN7B7nFvgVG9g9zi3wKjewe5xb4FRvYPc4t8Co3sHucW+BUb2D3OLfAqN7B7nFvgVG9g9zi3wKjewe5xb4FRvYPc4t8Co3sHucW+BUb2D3OLfAqN7B7nFvgVG9g9zi3wKjewe5xb4FRvYPc4t8Co3sHucW+BUb2D3OLfAqN7B7nFvgVG9g9zi3wKjewe5xb4FRvYPc4t8Co3sHucW+BUb2D3OLfAqKp1RcVdeuJ851KnCbLCAEJIs4bb8nov1Eov1Eov1Eov1Ey79RKL9RMu/USi/UTLv1Eov1Ey79RKL9RKL9RMu/USi/USi/UTLv1Eov1Eov1Ey79RMu/USi/UTLv1Ey79RMu/USi/USi/USi/UTLv1Eov1Eov1Ey79RMu/UTLv1Ey79RMu/USi/USi/USi/USi/UTLv1Eov1Ey79RMu/USi/USi/USi/UTLvj/2Q==";
    document.getElementById("txtFotoRuta").value = "";
    alimentosSeleccionados = [];
    bebidasSeleccionadas = [];
    document.querySelectorAll("#alimentosCheckboxes .form-check-input").forEach(checkbox => checkbox.checked = false);
    document.querySelectorAll("#bebidasCheckboxes .form-check-input").forEach(checkbox => checkbox.checked = false);
    document.querySelectorAll("#alimentosCheckboxes .cantidad-input").forEach(input => input.value = "0");
    document.querySelectorAll("#bebidasCheckboxes .cantidad-input").forEach(input => input.value = "0");
    document.getElementById("selectedAlimentos").innerHTML = "";
    document.getElementById("selectedBebidas").innerHTML = "";

    btnModificar.style.display = "none";
    btnEliminar.style.display = "none";
    btnCambiarEstatus.style.display = "none";
    btnLimpiar.style.display = "inline-block";
    btnAgregar.style.display = "inline-block";
}

// Agrega un nuevo combo a la lista
function agregarCombo() {
    let nombre = document.getElementById("txtNombre").value;
    let descripcion = document.getElementById("txtDescripcion").value;
    let precio = document.getElementById("txtPrecio").value;
    let foto = fotoBase64;

    if (nombre && descripcion && precio && foto) {
        let newCombo = {nombre, descripcion, precio, foto, estatus: "Activo"};
        obj.push(newCombo);

        console.log(JSON.stringify(obj));
        limpiar();
        actualizaTabla();
    } else {
        alert("Hay campos obligatorios para agregar el combo");
    }
}

// Modifica un combo existente en la lista
function modificarCombo() {
    if (indexComboSeleccionado !== undefined) {
        let nombre = document.getElementById("txtNombre").value;
        let descripcion = document.getElementById("txtDescripcion").value;
        let precio = document.getElementById("txtPrecio").value;

        obj[indexComboSeleccionado] = {
            ...obj[indexComboSeleccionado],
            nombre,
            descripcion,
            precio,
            estatus: "Activo"
        };

        console.log(obj[indexComboSeleccionado].nombre, document.getElementById("txtNombre").value, nombre);
        actualizaTabla();
        selectCombo(indexComboSeleccionado);
    }
}

// Elimina el combo seleccionado de la lista
function eliminarCombo() {
    if (indexComboSeleccionado !== undefined) {
        obj = obj.filter((_, index) => index !== indexComboSeleccionado);
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

// Filtra los combos en la tabla según el texto de búsqueda
function filtrarCombos() {
    const textoBusqueda = normalizarTexto(document.getElementById("buscarCombo").value);
    const filas = document.querySelectorAll("#tblCombos tr");

    filas.forEach(fila => {
        const nombre = normalizarTexto(fila.cells[1].textContent);
        const descripcion = normalizarTexto(fila.cells[2].textContent);
        const precio = normalizarTexto(fila.cells[3].textContent);
        const estatus = normalizarTexto(fila.cells[5].textContent);

        if (nombre.includes(textoBusqueda) || descripcion.includes(textoBusqueda) || precio.includes(textoBusqueda) || estatus.includes(textoBusqueda)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

// Cargar datos y actualizar la tabla
fetch('../json/jsonCombo.json')
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
            <tr onclick="selectCombo(${index});" class="table-row">
                <td>${index + 1}</td>
                <td>${elemento.nombre}</td>
                <td>${elemento.descripcion}</td>
                <td>$${parseFloat(elemento.precio).toFixed(2)}</td>
                <td><img src="${elemento.foto}" class="img-thumbnail" width="100" alt="${elemento.nombre}"></td>
                <td>${elemento.estatus}</td>
            </tr>`;
        cuerpo += registro;
    });
    document.getElementById("tblCombos").innerHTML = cuerpo;
    filtrarCombos();
}

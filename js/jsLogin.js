/* global fetch */
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('./json/jsonUsuario.json')
    .then(response => response.json())
    .then(data => {
            // Busca el usuario en la respuesta del JSON
            const user = data.find(user => user.username === username && user.password === password);

            if (user) {
                window.location.href = 'menu.html';
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
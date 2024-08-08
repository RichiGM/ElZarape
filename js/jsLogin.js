document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Obtener los usuarios desde localStorage
    const usuariosGuardados = localStorage.getItem('usuarios');
    const data = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    // Busca el usuario en los datos obtenidos
    const user = data.find(user => user.username === username && user.password === password);

    if (user) {
        if (user.estatus === "Activo") {
            window.location.href = 'menu.html';
        } else {
            alert('Usuario en estatus de baja. No puede ingresar.');
        }
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});

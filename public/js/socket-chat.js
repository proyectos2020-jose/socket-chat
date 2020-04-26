var socket = io();

var params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')) {
    throw new Error('El nombre es oblitario');
    location.replace('/index.html')
}

socket.on('connect',  function() {
    socket.emit('agregarPersona', {nombre: params.get('nombre'), sala: params.get('sala')}, function (resp) {
        console.log('personas actualmente en el chat ', resp);
        renderizarPersonas(resp);
    })
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

socket.on('listaPersonas', function (data) {
    renderizarPersonas(data);
})

socket.on('enviarMensaje', function (mensaje) {
    renderizarMensaje(mensaje, false);
    scrollBottom();
})

socket.on('mensajePrivado', function (mensaje) {
    console.log(mensaje);
})

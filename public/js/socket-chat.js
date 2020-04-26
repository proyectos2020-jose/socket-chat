var socket = io();

let params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')) {
    throw new Error('El nombre es oblitario');
    location.replace('/index.html')
}

socket.on('connect',  function() {
    socket.emit('agregarPersona', {nombre: params.get('nombre'), sala: params.get('sala')}, function (resp) {
        console.log('personas actualmente en el chat ', resp);
    })
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

socket.on('listaPersonas', function (data) {
    console.log(data);
})

socket.on('enviarMensaje', function (mensaje) {
    console.log(mensaje)
})

socket.on('mensajePrivado', function (mensaje) {
    console.log(mensaje);
})

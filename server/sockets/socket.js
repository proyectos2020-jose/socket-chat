const { io } = require('../server');
const {Persona} = require('../classes/persona');
const {crearMensaje} = require('../utils/utils');

//Inicializamos la lista de personas conectadas al chat
let personas = new Persona();

io.on('connection', (client) => {

    client.on('agregarPersona', (data, callback) => {
        let listaPersonas = personas.agregarPersona(client.id, data.nombre, data.sala);
        client.join(data.sala);
        client.broadcast.to(data.sala).emit('listaPersonas', personas.getPersonasPorSala(data.sala));
        // Se notifica a todos las peronas de la sala que se ha conectado un usuario.
        client.broadcast.to(data.sala).emit('enviarMensaje', crearMensaje('Administrador',`El usuario ${data.nombre} se ha unido a el chat`))
        callback(listaPersonas);
    })
    client.on('disconnect', () => {
        //Borramos al usuario desconectado.
        let personaBorrada = personas.borrarPersona(client.id);
        //Una vez hemos eliminado el usuario desconectado, lo notificamos a el resto de usuarios
        client.broadcast.to(personaBorrada.sala).emit('enviarMensaje', crearMensaje('Administrador',`El usuario ${personaBorrada.nombre} ha abandonado el chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', personas.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('enviarMensaje', (data, callback) => {
        let persona = personas.getPersona(client.id);
        let mensaje = crearMensaje(data.nombre, data.mensaje);
        client.broadcast.to(data.sala).emit('enviarMensaje', mensaje);
        callback(mensaje);
    })

    client.on('mensajePrivado', (data) => {
        client.broadcast.to(data.para).emit('mensajePrivado', data.mensaje);
    })
});

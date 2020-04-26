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
        callback(listaPersonas);
    })

    client.on('disconnect', () => {
        //Borramos al usuario desconectado.
        let personaBorrada = personas.borrarPersona(client.id);
        //Una vez hemos eliminado el usuario desconectado, lo notificamos a el resto de usuarios
        client.broadcast.to(personaBorrada.sala).emit('enviarMensaje', crearMensaje('Administrador',`El usuario ${personaBorrada.nombre} ha abandonado el chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', personas.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('enviarMensaje', (mensaje) => {
        let persona = personas.getPersona(client.id);
        client.broadcast.to(persona.sala).emit('enviarMensaje', crearMensaje(persona.nombre, mensaje));
    })

    client.on('mensajePrivado', (data) => {
        client.broadcast.to(data.para).emit('mensajePrivado', data.mensaje);
    })
});

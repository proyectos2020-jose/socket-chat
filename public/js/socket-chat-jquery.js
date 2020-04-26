var params = new URLSearchParams(window.location.search);
//Referencia jquery - lista usuarios en la sala
var divUsuarios = $('#divUsuarios');
var boxMensaje = $('#boxMensaje');
var textMensaje = $('#textMensaje');
var divChatbox = $('#divChatbox');

var sala = params.get('sala');
var nombre = params.get('nombre');

function renderizarPersonas(personas) {

    var html = '';

    //Parte html con el nombre del chat
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    // Mostramos cada persona que haya en la sala. Metemos en el <a un atributo personalizado para luego hacer referencia a él.
    for(var i = 0 ; i < personas.length; i++) {
        html += '<li>';
        html += '<a data-id=' + personas[i].id + ' href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    //Le indicamos con jquery que use el html que hemos generado dentro de esa etiqueta.
    divUsuarios.html(html);
}

function renderizarMensaje(mensaje, usuarioActual) {
    var html = '';
    var date = new Date(mensaje.fecha);
    var dateTime = date.getHours() + ':' +  date.getMinutes();
    var fromAdmin = mensaje.nombre === 'Administrador';
    var classMessage = fromAdmin ? 'danger' : 'info';
    if(usuarioActual) {
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-inverse"> '+ mensaje.mensaje +' </div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + dateTime + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        //Solo se le pone foto si no es un mensaje del administrador
        if(!fromAdmin) {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '<div class="chat-content">';
        html += '<h5>' + mensaje.nombre + '</h5>';
        html += '<div class="box bg-light-' + classMessage + '">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-time">' + dateTime + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

boxMensaje.on('submit', function (e) {
    e.preventDefault();
    let mensaje = textMensaje.val().trim();
    if(!mensaje || mensaje.length === 0) {
        return
    }
    socket.emit('enviarMensaje', {sala: sala, mensaje:textMensaje.val(), nombre: nombre}, function (mensaje) {
        renderizarMensaje(mensaje, true);
        scrollBottom();
    });
    textMensaje.focus();
    textMensaje.val('');
})

//listerners jquery
//Seleccionamos todos los <a dentro de divUsuarios
divUsuarios.on('click', 'a', function () {
    //Cuando se ahce click lo que quiero es que me diga el id del usuario seleccionado.
    //Hacemos referencia al <a clickeado y obtenemos el valor del data-id definidimo anteriormente.
    var id = $(this).data('id');
    if(id) {
        console.log(id);
    }
})

//Funcion para hacer scroll hacia abajo en el chat
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

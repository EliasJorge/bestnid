$(document).ready(function(){
        //Animacion para sacar mensajes de datos actualizados
    setTimeout(function() {
        $("#alerta").slideUp('fast');
    }, 6000);


    var pasarParametrosAlModalHacerAdministrador = function (event) {
        var boton= event.relatedTarget; // Button that triggered the modal
        //le pido al boton los atributos data-idOferta y data-idUsuario
        var idUsuario = boton.getAttribute("data-idUsuario");
        var modal = $(this);
        //le  pongoo al elemento con id botonGanador los atributos
        modal.find('#idNuevoAdmin').attr('value', idUsuario);
        //modal.find('#formGanador').attr('action','/elegirGanador/' + idOferta + '/' + idUsuario);
    }



    var pasarParametrosAlModalSacarAdministrador = function (event) {
        var boton= event.relatedTarget; // Button that triggered the modal
        //le pido al boton los atributos data-idOferta y data-idUsuario
        var idUsuario = boton.getAttribute("data-idUsuario");
        var modal = $(this);
        //le  pongoo al elemento con id botonGanador los atributos
        modal.find('#idAdminEliminar').attr('value', idUsuario);
        //modal.find('#formGanador').attr('action','/elegirGanador/' + idOferta + '/' + idUsuario);
    }

    $('#agregarAdministrador').on('show.bs.modal', pasarParametrosAlModalHacerAdministrador);
    $('#sacarAdministrador').on('show.bs.modal', pasarParametrosAlModalHacerAdministrador);
});
$(document).ready(function(){
    //Funcion para validar si un usuario ya oferto
    var validarSiOferto = function(event){
        // cancels the form submission
        event.preventDefault();
        //Me fijo si el usuario ya oferto en esta publicacion
        $.get("/yaOferto/" + $(this).attr("data-idPublicacion") + '/' + $(this).attr("data-idUsuario"), function(data, status){
            if (data != 'sessionError' && data != 'dbError') {
                if (data == true) {
                    if ($(".sacar").length == 0) {
                        $("#formOfertaBody").after('<div class="col-md-12 sacar"><div class="alert alert-danger"><span>Usted ya ha ofertado en esta publicacion</span></div></div>');
                        setTimeout(function() {
                            $(".sacar").slideUp('fast', function(){
                                $(".sacar").remove();
                            });
                        }, 3000);
                    };
                } else {
                    //unbind y submit
                    $("#formOferta").unbind("submit").submit();
                };
            } else {
                if ($(".sacar").length == 0) {
                    $("#formOfertaBody").after('<div class="col-md-12 sacar"><div class="alert alert-danger"><span>Ocurrio un error, por favor intente de nuevo</span></div></div>');
                    setTimeout(function() {
                        $(".sacar").slideUp('fast', function(){
                            $(".sacar").remove();
                        });
                    }, 3000);
                };
            };
        });
    }
    $('#formOferta').bind("submit", validarSiOferto);

    //Pasa parametros al modal cuando quiero responder a una pregunta
    $('.botonResponder').click(function(){
        $('#formRespuesta').attr('data-idPregunta', $(this).attr('data-idPregunta'));
        $('#textoRespuesta').focus();
    });

    //Necesito mandar el id de la pregunta para crear la respuesta
    $('#formRespuesta').submit(function(event){
        event.preventDefault();
        $('<input id="idPregunta" name="idPregunta" />').attr('type', 'hidden')
            .attr('value', $("#formRespuesta").attr("data-idPregunta"))
            .appendTo('#formRespuesta');
        $(this).unbind("submit").submit();
    });
});
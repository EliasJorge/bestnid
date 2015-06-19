$(document).ready(function(){



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

    var pasarParametrosAModelGanador = function (event) {
        var boton= event.relatedTarget; // Button that triggered the modal
        //le pido al boton los atributos data-idOferta y data-idUsuario
        var idOferta = boton.getAttribute("data-idOferta");
        var idUsuario = boton.getAttribute("data-idUsuario");
        var modal = $(this);
        //le  pongoo al elemento con id botonGanador los atributos
        modal.find('#idUsuarioPublicador').attr('value', idUsuario);
        modal.find('#idOfertaGanadora').attr('value', idOferta );
        modal.find('#formGanador').attr('action','/elegirGanador/' + idOferta + '/' + idUsuario);
    }

    var elegirGanador = function (event) {
        
    }   

    $('#formOferta').bind("submit", validarSiOferto);

    $('.botonResponder').click(function(){
        $('#formRespuesta').attr('data-idPregunta', $(this).attr('data-idPregunta'));
        $('#textoRespuesta').focus();
    });

    $('#formRespuesta').submit(function(event){
        event.preventDefault();
        $('<input id="idPregunta" name="idPregunta" />').attr('type', 'hidden')
            .attr('value', $("#formRespuesta").attr("data-idPregunta"))
            .appendTo('#formRespuesta');
        $(this).unbind("submit").submit();
    });

    $('#elegirGanador').on('show.bs.modal', pasarParametrosAModelGanador);
});
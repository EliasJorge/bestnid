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
        //modal.find('#formGanador').attr('action','/elegirGanador/' + idOferta + '/' + idUsuario);
    }

    var pasarParametrosAModelEliminarRespuesta = function (event) {
        var boton= event.relatedTarget; // Button that triggered the modal
        //le pido al boton los atributos data-idUsuario, data-idPublicacion, data-idPregunta, data-idRespuesta
        var idPublicacion = boton.getAttribute("data-idPublicacion");
        var idPregunta = boton.getAttribute("data-idPregunta");
        var idRespuesta = boton.getAttribute("data-idRespuesta");
        var idUsuario = boton.getAttribute("data-idUsuario");
        var modal = $(this);
        //le  pongo los atributos
        modal.find('#idUsuario').attr('value', idUsuario);
        modal.find('#idPublicacion').attr('value', idPublicacion);
        modal.find('#idPregunta').attr('value', idPregunta );
        modal.find('#idRespuesta').attr('value', idRespuesta );
    }

    var elegirGanador = function (event) {
        
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

    $('#elegirGanador').on('show.bs.modal', pasarParametrosAModelGanador);

    $('#eliminarRespuesta').on('show.bs.modal', pasarParametrosAModelEliminarRespuesta);

        //Eventos para boton ver datos
    $("#botonVerDatos").click(function(){
        if($(this).attr("data-abrir") == 0){
            $(this).attr("data-abrir",1);
            $("#resultadoDatosGanador").slideDown('fast');
            var idPublicador = $(this).attr("data-idPublicador");
            $("#resultadoDatosGanador").load("/datosGanador/" + $(this).attr("data-ofertaId"), {idPublicador: idPublicador});
        }
        else{
            $("#resultadoDatosGanador").slideUp('slow');
            $(this).attr("data-abrir",0);
        }

    });
});
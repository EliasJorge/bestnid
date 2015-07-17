$(document).ready(function(){


    var validarSiExisteNombre = function(event){
        // cancels the form submission
        event.preventDefault();
        //Me fijo si eexiste el nombre de esta categoria
        $.get("/existeCategoria/" + $('#newNombreCategoria').val(), function(data, status){
            if (data != 'dbError') {

                if (data == false) {
                    //ya hay una con ese nombre
                    if ($(".sacar").length == 0) {
                        $("#formModificarBody").after('<div class="col-md-12 sacar"><div class="alert alert-danger"><span>Ya existe una categoria con este nombre</span></div></div>');
                        setTimeout(function() {
                            $(".sacar").slideUp('fast', function(){
                                $(".sacar").remove();
                            });
                        }, 3000);
                    };
                } else {
                    //unbind y submit
                    $("#formModificar").unbind("submit").submit();
                };
            } else {
                if ($(".sacar").length == 0) {
                    $("#formModificarBody").after('<div class="col-md-12 sacar"><div class="alert alert-danger"><span>Ocurrio un error, por favor intente de nuevo</span></div></div>');
                    setTimeout(function() {
                        $(".sacar").slideUp('fast', function(){
                            $(".sacar").remove();
                        });
                    }, 3000);
                };
            };
        });
    }

    var validarSiExisteNombreAgregar = function(event){
        // cancels the form submission
        event.preventDefault();
        //Me fijo si eexiste el nombre de esta categoria
        $.get("/existeCategoria/" + $('#nombreCategoria').val(), function(data, status){
            if (data != 'dbError') {
                if (data == false) {
                    //ya hay una con ese nombre
                    if ($(".sacar").length == 0) {
                        $("#formAgregarBody").after('<div class="col-md-12 sacar"><div class="alert alert-danger"><span>Ya existe una categoria con este nombre</span></div></div>');
                        setTimeout(function() {
                            $(".sacar").slideUp('fast', function(){
                                $(".sacar").remove();
                            });
                        }, 3000);
                    };
                } else {
                    //unbind y submit
                    $("#formAgregar").unbind("submit").submit();
                };
            } else {
                if ($(".sacar").length == 0) {
                    $("#formAgregarBody").after('<div class="col-md-12 sacar"><div class="alert alert-danger"><span>Ocurrio un error, por favor intente de nuevo</span></div></div>');
                    setTimeout(function() {
                        $(".sacar").slideUp('fast', function(){
                            $(".sacar").remove();
                        });
                    }, 3000);
                };
            };
        });
    }

    var pasarParametrosAModelModificar = function (event) {
        var boton= event.relatedTarget; // Button that triggered the modal
        var idCategoria = boton.getAttribute("data-idCategoria");
        var nombreCategoria = boton.getAttribute("data-nombreCategoria");
        var modal = $(this);
        //le  pongoo al elemento con id botonGanador los atributos
        modal.find('#idCategoriaModificada').attr('value', idCategoria);
        modal.find('#newNombreCategoria').attr('placeholder', nombreCategoria );
        modal.find('formModificar').attr('data-nombreCategoria', nombreCategoria );
    }


    $('#modalModificar').on('show.bs.modal', pasarParametrosAModelModificar);
    $('#formModificar').bind("submit", validarSiExisteNombre);
    $('#formAgregar').bind("submit", validarSiExisteNombreAgregar);
});
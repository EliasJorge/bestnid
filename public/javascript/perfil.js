$(function() {

	//Animacion para sacar mensajes de datos actualizados
    setTimeout(function() {
        $("#passChangedDiv").slideUp('fast');
        $("#dataChangedDiv").slideUp('fast');
    }, 3000);

    //Carga por defecto las publicaciones del usuario
    
    $("#bPublicaciones").addClass("active");
    $("#resultados").load("/perfil/" + $("#bPublicaciones").attr("data-userId") + "/publicaciones");
    
    //Eventos para cada boton
    $("#bOfertas").click(function(){
    	$("#bPublicaciones").removeClass("active");
    	$("#bPreguntas").removeClass("active");
    	$("#bEstadisticas").removeClass("active");
    	$(this).addClass("active");
    	//Limpio el div antes de cargarle datos nuevos
    	$('#resultados').html("");
    	$("#resultados").load("/perfil/" + $(this).attr("data-userId") + "/ofertas");
    });
    $("#bPublicaciones").click(function(){
    	$("#bPreguntas").removeClass("active");
    	$("#bOfertas").removeClass("active");
    	$("#bEstadisticas").removeClass("active");
    	$(this).addClass("active");
    	//Limpio el div antes de cargarle datos nuevos
    	$('#resultados').html("");
    	$("#resultados").load("/perfil/" + $(this).attr("data-userId") + "/publicaciones");
    });
    $("#bPreguntas").click(function(){
    	$("#bPublicaciones").removeClass("active");
    	$("#bOfertas").removeClass("active");
    	$("#bEstadisticas").removeClass("active");
    	$(this).addClass("active");
    });
    $("#bEstadisticas").click(function(){
    	$("#bPublicaciones").removeClass("active");
    	$("#bOfertas").removeClass("active");
    	$("#bPreguntas").removeClass("active");
    	$(this).addClass("active");
    });

    $("#formPagarBody").on('click', '.pagar', function() {
    	$("#montoPagar").text("Monto a pagar: $" + $(this).attr("data-monto"));
    });
});
$(function() {

	//Animacion para sacar mensajes de datos actualizados
    setTimeout(function() {
        $("#passChangedDiv").slideUp('fast');
        $("#dataChangedDiv").slideUp('fast');
    }, 3000);

    //Carga por defecto las publicaciones del usuario
    //Deshabilitado por ahora. Usar cuando se use AJAX en cada boton
    
    //$("#bPublicaciones").addClass("active");
    //$("#resultados").load("/perfil/1/publicaciones");
    
    //Eventos para cada boton
    $("#bOfertas").click(function(){
    	$("#bPublicaciones").removeClass("active");
    	$("#bPreguntas").removeClass("active");
    	$("#bEstadisticas").removeClass("active");
    	$(this).addClass("active");
    });
    $("#bPublicaciones").click(function(){
    	$("#bPreguntas").removeClass("active");
    	$("#bOfertas").removeClass("active");
    	$("#bEstadisticas").removeClass("active");
    	$(this).addClass("active");
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
});
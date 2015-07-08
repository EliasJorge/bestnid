$(function() {
	$(".alert").hide();
	$("#bMostrar").click(function(){
		if ($("#fechaDesde").val() != "" && $("#fechaHasta").val() != ""){
			if ($("#fechaDesde").val() > $("#fechaHasta").val()) {
				$("#alertaVacio").slideUp('fast');
				$("#alertaReves").slideDown('fast');
			} else {
				$(".alert").slideUp('fast');
				//Limpio el div antes de cargarle datos nuevos
		    	$('#resultados').html("");
		    	$("#resultados").load("/tablaPublicaciones/" + $("#idUsuario").val() + "/" + $("#fechaDesde").val() + "/" + $("#fechaHasta").val());
			};
		} else {
			$("#alertaVacio").slideDown('fast');
		};
    });
});
$(function(){
	var data = {
		idUsuario: $("#bNotificaciones").attr("data-idUsuario")
	};
	$.post("/chequearNotificaciones", data, function(res, status){
		if (res.tieneNotificaciones == 1) {
			$("#bNotificaciones").css("color", "yellow");
		} else {
			$("#bNotificaciones").css("color", "");
		}
	});
});
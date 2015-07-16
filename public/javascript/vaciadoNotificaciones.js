$(function(){
	var data = {
		idUsuario: $("#bNotificaciones").attr("data-idUsuario")
	};
	$.post("/vaciarNotificaciones", data, function(res, status){
		if (res.affectedRows == 1) {
			$("#bNotificaciones").css("color", "");
		} else {
			$("#bNotificaciones").css("color", "yellow");
		}
	});
});
var conn = require('./dbConnection');

var modeloPregunta = {};

modeloPregunta.insertarPregunta = function(pregunta,callback){
	if (conn) {
		var query = 'INSERT INTO pregunta (textoPregunta, fechaPregunta, idUsuario, idPublicacion) VALUES (' +
			"'"+ pregunta.texto + "', CURDATE(), " +
			"" + pregunta.idUsuario + ", " +
			"" + pregunta.idPublicacion + ")";
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				var queryPub = "SELECT idUsuario FROM publicacion WHERE idPublicacion=" + pregunta.idPublicacion;
				var queryNotificacion = "UPDATE usuario SET tieneNotificaciones=1 WHERE idUsuario IN (" + queryPub + ")";
				conn.query(queryNotificacion, function(errN, resN){
					if (errN) {
						callback(errN);
					} else {
						callback(null, resultado);
					};
				});
			};
		});
	};
}

modeloPregunta.eliminarPregunta = function(idUsuario,idPregunta,callback){
	if (conn) {
		var query = "DELETE FROM pregunta WHERE idPregunta = " + idPregunta + " AND idUsuario = " + idUsuario;
		conn.query(query,function(error,resultado){
			if (error){
				callback(error);
			} else {
				callback(null,resultado);
			}
		});
	};
}

module.exports = modeloPregunta;
var conn = require('./dbConnection');

var modeloRespuesta = {};

modeloRespuesta.insertarRespuesta = function(idPregunta, respuesta, callback){
	if (conn){
		var query = 'INSERT INTO respuesta (textoRespuesta, fechaRespuesta) VALUES (' +
				'"' + respuesta + '", ' +
				'CURDATE()' +
			')';
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				conn.query('UPDATE pregunta SET idRespuesta=' + resultado.insertId +
					' WHERE idPregunta = ' + idPregunta, function(errorP, resultadoP){
					if (errorP) {
						callback(errorP);
					} else {
						//Creo la notificacion
						var queryPreg = "SELECT idUsuario FROM pregunta WHERE idPregunta=" + idPregunta;
						var queryNotificacion = "UPDATE usuario SET tieneNotificaciones=1 WHERE idUsuario IN (" + queryPreg + ")";
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
		});
	}
};

modeloRespuesta.eliminarRespuesta = function(idPregunta, idRespuesta, callback){
	if (conn){
		var query = 'DELETE FROM respuesta WHERE idRespuesta = ' + idRespuesta;
		conn.query(query, function(error,resultado){
			if (error) {
				callback(error);
			} else {
				conn.query('UPDATE pregunta SET idRespuesta = null WHERE idPregunta = ' + idPregunta , function(errorP, resultadoP){
					if (errorP) {
						callback(errorP);
					} else {
						callback(null, resultado);
					};
				});
			};
		});
	}
}

module.exports = modeloRespuesta;
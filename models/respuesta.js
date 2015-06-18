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
						callback(null, resultado);
					};
				});
			};
		});
	}
};

module.exports = modeloRespuesta;
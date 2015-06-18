var conn = require('./dbConnection');

var modeloPregunta = {};

modeloPregunta.insertarPregunta = function(pregunta,callback){
	if (conn) {
		var query = ' INSERT INTO pregunta (textoPregunta, fechaPregunta, idUsuario, idPublicacion) VALUES (' +
			"'"+ pregunta.texto + "', CURDATE(), " +
			"" + pregunta.idUsuario + ", " +
			"" + pregunta.idPublicacion + ")";
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				callback(null,resultado);
			};
		});
	};

}

module.exports = modeloPregunta;
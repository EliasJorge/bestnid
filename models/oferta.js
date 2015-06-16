var conn = require('./dbConnection');

var modeloOferta = {};

modeloOferta.getOfertaDePublicacion = function(publicacion, preguntasYRespuestas,callback){
	if (conn){
		conn.query('SELECT * FROM oferta WHERE idPublicacion=' + publicacion.idPublicacion, function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado);
			};
		});
	}
};

modeloOferta.getOfertasDeUsuario = function(usuario, callback){
	if (conn){
		conn.query('SELECT * FROM oferta of INNER JOIN publicacion pub ON of.idPublicacion = pub.idPublicacion ' +
			'WHERE of.idUsuario=' + usuario.idUsuario, function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado);
			};
		});
	}
};

module.exports = modeloOferta;
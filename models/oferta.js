var conn = require('./dbConnection');

var modeloOferta = {};

modeloOferta.getOfertaDePublicacion = function(publicacion, preguntasYRespuestas,callback){
	if (conn){
		conn.query('SELECT * FROM oferta WHERE idPublicacion=' + publicacion.idPublicacion +, function(error, resultado){
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
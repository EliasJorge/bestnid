var conn = require('./dbConnection');

var modeloOferta = {};

modeloOferta.getOfertasDePublicacion = function(publicacion,preguntasYRespuestas,callback){
	if (conn){
		conn.query('SELECT * FROM oferta WHERE idPublicacion=' + publicacion.idPublicacion, function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado, publicacion, preguntasYRespuestas);
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

modeloOferta.insertarOferta = function(oferta, callback){
	if (conn){
		var query = 'INSERT INTO oferta (texto, monto, fechaOferta, idPublicacion, idUsuario) ' +
					'VALUES (' +
						'"' + oferta.texto + '", ' +
						oferta.monto + ', ' +
						'CURDATE(), ' +
						oferta.idPublicacion + ', ' +
						oferta.idUsuario +
						')';
		console.log(query);
		conn.query(query, function(error, resultado){
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
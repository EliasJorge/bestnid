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
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				var queryPub = "SELECT idUsuario FROM publicacion WHERE idPublicacion=" + oferta.idPublicacion;
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
	}
};

modeloOferta.getOfertasDeUsuarioParaPublicacion = function(idUsuario, idPublicacion, callback){
	if (conn){
		var query = 'SELECT * FROM oferta ' +
			'WHERE idUsuario=' + idUsuario +
			' AND idPublicacion=' + idPublicacion;
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

modeloOferta.getOfertaByID = function(id, callback){
	if (conn){
		var query = 'SELECT * FROM oferta ' +
			'WHERE idOferta=' + id;
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


modeloOferta.getUsuarioDeOfertaConId = function(idOferta, callback){
	if(conn){
		var query = 'SELECT nombreUsuario, nombre, apellido, mail FROM usuario u INNER JOIN oferta o ON u.idUsuario = o.idUsuario WHERE o.idOferta = ' + idOferta;
		conn.query(query, function(error, resultado){
			if(error){
				callback(error);
			}
			else{
				callback(null, resultado[0]);
			}
		});
	}
};

modeloOferta.eliminarOferta = function(idUsuario,idOferta,callback){
	if(conn){
		var query = "DELETE FROM oferta WHERE idOferta = " + idOferta + " AND idUsuario = " + idUsuario;
		conn.query(query, function(error,resultado){
			if (error){
				callback(error);
			} else {
				callback(null,resultado);
			}
		});
	};
};

module.exports = modeloOferta;
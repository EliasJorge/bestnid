var conn = require('./dbConnection');

var modeloUsuario = {};

modeloUsuario.insertar = function(nuevoUsuario, callback){
	if (conn) {
		var query = 'INSERT INTO usuario (nombre, apellido, nombreUsuario, password, ' +
			'mail, foto, fechaRegistro) VALUES (' +
			"'" + nuevoUsuario.nombre + "', " +
			"'" + nuevoUsuario.apellido + "', " +
			"'" + nuevoUsuario.nombreUsuario + "', " +
			"'" + nuevoUsuario.password + "', " +
			"'" + nuevoUsuario.mail + "', " +
			"'/imagenes/perfilDefault.png', CURRENT_DATE())";
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				//devolvemos la última id insertada
                callback(null,{"idInsertado" : resultado.insertId});
			};
		});
	};
};

modeloUsuario.getUsuarioByNombre = function(nombreUsuario, callback){
	if (conn) {
		conn.query("SELECT * FROM usuario WHERE nombreUsuario = '" + nombreUsuario + "'", function(error, resultado){
			if (error) {
				callback(error);
			} else {
				callback(null, resultado);
			};
		});
	};
};

modeloUsuario.getUsuarioByID = function(id, callback){
	if (conn) {
		conn.query("SELECT * FROM usuario WHERE idUsuario = '" + id + "'", function(error, resultado){
			if (error) {
				callback(error);
			} else {
				callback(null, resultado);
			};
		});
	};
};

modeloUsuario.getLogin = function(nombreUsuario, password, callback){
	if (conn) {
		var query = 'SELECT * FROM usuario WHERE visible = true AND nombreUsuario = ' + conn.escape(nombreUsuario) +
			' AND password = ' + conn.escape(password);
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				callback(null, resultado);
			};
		})
	};
};

modeloUsuario.modificarUsuario = function(id, datos, callback){
	var cantPropiedades = 0;
	for (var k in datos) {
	    if (datos.hasOwnProperty(k)) {
	       ++cantPropiedades;
	    };
	};
	if (cantPropiedades > 0) {
		if (conn) {
			var query = 'UPDATE usuario SET ';
			for (var attr in datos) {
				query += attr + " = '" + datos[attr] + "',"
			};
			//Saco la ultima coma
			query = query.substring(0, query.length - 1);
			query += ' WHERE idUsuario = ' + id;
			conn.query(query, function(error, resultado){
				if (error) {
					callback(error);
				} else {
					callback(null, resultado);
				};
			})
		};
	} else {
		callback(null, {});
	};
};

modeloUsuario.pagar = function(publicador, admin, callback){
	if (conn) {
		var query = 'UPDATE usuario SET ingresos=ingresos+' + publicador.monto + ' WHERE idUsuario=' + publicador.id;
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				var queryAdmin = 'UPDATE usuario SET ingresos=ingresos+' + admin.monto + ' WHERE idUsuario=' + admin.id;
				conn.query(queryAdmin, function(errorA, resultadoA){
					if (errorA) {
						callback(errorA);
					} else {
						var queryNotificacion = "UPDATE usuario SET tieneNotificaciones=1 WHERE idUsuario=" + publicador.id +
							" OR idUsuario=" + admin.id;
						conn.query(queryNotificacion, function(errN, resN){
							if (errN) {
								callback(errN);
							} else {
								callback(null, resultadoA);
							};
						});
					};
				});
			};
		});
	};
};

modeloUsuario.getUsuariosPorFecha = function(desde, hasta, callback){
	if (conn) {
		var query = 'SELECT * FROM usuario WHERE fechaRegistro BETWEEN ' + conn.escape(desde) +
			' AND ' + conn.escape(hasta) +
			' ORDER BY fechaRegistro ASC';
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				callback(null, resultado);
			};
		})
	};
};

modeloUsuario.resetPassword = function(datosUsuario, callback){
	if (conn) {
		var query = 'UPDATE usuario SET password=' + conn.escape('12345678') +
			' WHERE nombreUsuario=' + conn.escape(datosUsuario.nombreUsuario) +
			' AND mail=' + conn.escape(datosUsuario.mail);
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				callback(null, resultado);
			};
		})
	};
};


modeloUsuario.eliminarCuenta = function(idUsuario, callback){
	if(conn){
		var query = 'SELECT * FROM publicacion WHERE pagada = false AND idOfertaGanadora IS NOT NULL AND idUsuario = ' + idUsuario;
		conn.query(query, function(error,resultado){
			if (error) {
				callback(error);
			}
			else{
				if(resultado.length == 0){
					conn.query('SELECT * FROM publicacion p INNER JOIN oferta o ON p.idPublicacion = o.idPublicacion WHERE p.pagada = false AND p.idOfertaGanadora = o.idOferta AND o.idUsuario = ' + idUsuario,
					function(error, resultado){
						if (resultado.length == 0 ) {
							conn.query('UPDATE usuario SET visible = false WHERE idUsuario = ' + idUsuario);
							conn.query('UPDATE publicacion SET visible = false WHERE idUsuario = ' + idUsuario);	
							conn.query('DELETE FROM oferta WHERE idUsuario = ' + idUsuario);	
							callback(null,0);
						}
						else{
							callback(null,2);
						}
					});
				}
				else{
					callback(null, 1);
				}
			}
		});
	}
};

modeloUsuario.getUsarios = function(callback){
	if (conn) {
		conn.query('SELECT * FROM usuario WHERE visible = true ORDER BY idUsuario', function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado);
			}
		});
	}
}

modeloUsuario.setAdminAUsuario = function(idUsuario, callback){
	if(conn){
		conn.query('UPDATE usuario SET esAdmin = true WHERE idUsuario = ' + idUsuario, function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				//Notificacion
				var queryNotificacion = "UPDATE usuario SET tieneNotificaciones=1 WHERE idUsuario=" + idUsuario;
				conn.query(queryNotificacion, function(errN, resN){
					if (errN) {
						callback(errN);
					} else {
						callback(null);
					};
				});
			}
		})
	}
}

modeloUsuario.setNoAdminAUsuario = function(idUsuario, callback){
	if(conn){
		conn.query('UPDATE usuario SET esAdmin = false WHERE idUsuario = ' + idUsuario, function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				//Notificacion
				var queryNotificacion = "UPDATE usuario SET tieneNotificaciones=1 WHERE idUsuario=" + idUsuario;
				conn.query(queryNotificacion, function(errN, resN){
					if (errN) {
						callback(errN);
					} else {
						callback(null);
					};
				});
			}
		})
	}
}

modeloUsuario.setNotificacionesVistas = function(idUsuario, callback){
	if (conn) {
		conn.query("UPDATE usuario SET tieneNotificaciones=0 WHERE idUsuario = '" + idUsuario + "'", function(error, resultado){
			if (error) {
				callback(error);
			} else {
				callback(null, resultado);
			};
		});
	};
};

module.exports = modeloUsuario;
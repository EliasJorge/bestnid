var conn = require('./dbConnection');

var modeloPublicacion = {};

modeloPublicacion.insertar = function(nuevaPublicacion, callback){
	if (conn) {
		var query = 'INSERT INTO publicacion (titulo, descripcion, foto, fechaInicio, fechaFin, visible, terminada, idCategoria, idUsuario) VALUES (' +
			"'" + nuevaPublicacion.titulo + "', " +
			"'" + nuevaPublicacion.descripcion + "', " +
			"'" + nuevaPublicacion.foto + "', " +
			" CURRENT_DATE(), CURRENT_DATE() + interval " + nuevaPublicacion.duracion + " day, 1, 0, " +
			"" + nuevaPublicacion.idCategoria + ", " +
			"" + nuevaPublicacion.idUsuario + ")" ;
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				callback(null,resultado);
			};
		});
	};
};


modeloPublicacion.getPublicaciones = function(desc, callback){
	if (conn){
		if (desc == 1) {
			conn.query('SELECT * FROM publicacion  WHERE visible = 1 and terminada = 0 ORDER BY fechaInicio ASC', function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});
		}
		else{
			conn.query('SELECT * FROM publicacion  WHERE visible = 1 and terminada = 0 ORDER BY fechaInicio DESC', function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});	
		}
	}
};

modeloPublicacion.getPublicacionesByUsuario = function(id, callback){
	if (conn) {
		conn.query("SELECT * FROM publicacion WHERE idUsuario = " + id + " ORDER BY fechaInicio DESC", function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado);
			};
		});
	};
};


modeloPublicacion.getPublicacionesByNombre = function(string, desc, callback){
	if (conn){
		if (desc == 1) {
			conn.query("SELECT * FROM publicacion WHERE visible = 1 and terminada = 0 AND titulo LIKE '%" + string + "%' ORDER BY fechaInicio ASC", function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});
		}
		else{
			conn.query("SELECT * FROM publicacion WHERE visible = 1 and terminada = 0 AND titulo LIKE '%" + string + "%' ORDER BY fechaInicio DESC", function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});	
		}
	}
};

modeloPublicacion.getPublicacionesByCategoria = function(idCategoria, desc, callback){
	if (conn){
		if (desc == 1) {
			conn.query("SELECT * FROM publicacion WHERE visible = 1 and terminada = 0 AND idCategoria = '" + idCategoria + "' ORDER BY fechaInicio ASC", function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});
		}
		else{
			conn.query("SELECT * FROM publicacion WHERE visible = 1 and terminada = 0 AND idCategoria = '" + idCategoria + "' ORDER BY fechaInicio DESC", function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});	
		}
	}
};

modeloPublicacion.getPublicacionesByCategoriaAndNombre = function(idCategoria, string, desc, callback){
	if (conn){
		if (desc == 1) {
			conn.query("SELECT * FROM publicacion WHERE visible = 1 and terminada = 0 AND idCategoria = '" + idCategoria + "'AND titulo LIKE '%" + string + "%' ORDER BY fechaInicio ASC", function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});
		}
		else{
			conn.query("SELECT * FROM publicacion WHERE visible = 1 and terminada = 0 AND idCategoria = '" + idCategoria + "'AND titulo LIKE '%" + string + "%' ORDER BY fechaInicio DESC", function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});	
		}
	}
};

modeloPublicacion.getPublicacionByID = function(id, callback){
	if (conn) {
		conn.query("SELECT * FROM publicacion WHERE idPublicacion = " + id, function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado[0]);
			};
		});
	};
};


modeloPublicacion.getPreguntasYRespuestasDePublicacion = function(publicacion ,callback){
	if (conn) {
		conn.query(
		"select * from pregunta p left join respuesta r ON p.idRespuesta = r.idRespuesta WHERE p.idPregunta IN ( select pr.idPregunta from publicacion pu inner join pregunta pr on pr.idPublicacion = pu.idPublicacion where pu.idPublicacion =  '" + publicacion.idPublicacion + "')", 
		function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado, publicacion);
			};
		});
	};	
};

modeloPublicacion.setOfertaGanadora = function(idOfertaGanadora, idPublicacion, callback){
	if (conn) {
		var query = "UPDATE publicacion SET idOfertaGanadora = " + idOfertaGanadora + " WHERE idPublicacion = " + idPublicacion;
		conn.query(query, function(error,resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null)
			}
		});
	}
};

modeloPublicacion.getPublicacionConOfertaGanadora = function(idPublicacion, callback){
	if (conn) {
		var query = "SELECT * FROM publicacion p INNER JOIN oferta o ON p.idOfertaGanadora=o.idOferta WHERE p.idPublicacion=" + idPublicacion;
		conn.query(query, function(error,resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado);
			}
		});
	}
};

modeloPublicacion.setPublicacionPagada = function(idPublicacion, callback){
	if (conn) {
		var query = "UPDATE publicacion SET pagada=1, fechaPago=CURDATE() WHERE idPublicacion=" + idPublicacion;
		conn.query(query, function(error,resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado);
			}
		});
	}
};

modeloPublicacion.getPublicacionesGanadasPorUsuario = function(idUsuario, callback){
	if (conn) {
		var query = "SELECT * FROM publicacion p INNER JOIN oferta o ON p.idOfertaGanadora=o.idOferta " +
			"WHERE o.idUsuario=" + idUsuario;
		conn.query(query, function(error,resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado);
			}
		});
	}
};

modeloPublicacion.modificarPublicacion = function(datosNuevos, idPublic, callback){
	if (conn){
		var query = "UPDATE publicacion SET titulo=" + "'" + datosNuevos.titulo + "'," + " descripcion=" + "'" + datosNuevos.descripcion + "'," + " foto=" + "'" + datosNuevos.foto + "'," + " idCategoria=" +  datosNuevos.idCategoria + " WHERE idPublicacion=" + idPublic;			
		conn.query(query, function(error,resultado){
			if (error){
				callback(error);
			} else {
				callback(null,resultado);
			}
		});		
	}
}

modeloPublicacion.getPublicacionesPorFechaPago = function(desde, hasta, callback){
	if (conn) {
		var query = 'SELECT * FROM publicacion p INNER JOIN usuario u ON p.idUsuario = u.idUsuario ' +
			'WHERE fechaPago BETWEEN ' + conn.escape(desde) +
			' AND ' + conn.escape(hasta) +
			' ORDER BY fechaPago ASC';
		conn.query(query, function(errorP, resultadoConPublicador){
			if (errorP) {
				callback(errorP);
			} else {
				var queryGanador = 'SELECT * FROM publicacion p INNER JOIN oferta o ON p.idOfertaGanadora = o.idOferta ' +
					'INNER JOIN usuario u ON o.idUsuario = u.idUsuario ' +
					'WHERE fechaPago BETWEEN ' + conn.escape(desde) +
					' AND ' + conn.escape(hasta) +
					' ORDER BY fechaPago ASC';
				conn.query(queryGanador, function(errorG, resultadoConGanador){
					if (errorG) {
						callback(errorG);
					} else {
						callback(null, resultadoConPublicador, resultadoConGanador);
					};
				});
			};
		})
	};
};

module.exports = modeloPublicacion;
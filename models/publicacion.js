var conn = require('./dbConnection');

var modeloPublicacion = {};

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


module.exports = modeloPublicacion;

var conn = require('./dbConnection');

var modeloPublicacion = {};

modeloPublicacion.getPublicaciones = function(desc, callback){
	if (conn){
		if (desc == 1) {
			conn.query('SELECT * FROM publicacion  WHERE visible = 1 ORDER BY fechaInicio ASC', function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});
		}
		else{
			conn.query('SELECT * FROM publicacion  WHERE visible = 1 ORDER BY fechaInicio DESC', function(error, resultado){
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
			conn.query("SELECT * FROM publicacion WHERE visible = 1 AND titulo LIKE '%" + string + "%' ORDER BY fechaInicio ASC", function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});
		}
		else{
			conn.query("SELECT * FROM publicacion WHERE visible = 1 AND titulo LIKE '%" + string + "%' ORDER BY fechaInicio DESC", function(error, resultado){
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
			conn.query("SELECT * FROM publicacion WHERE visible = 1 AND idCategoria = '" + idCategoria + "' ORDER BY fechaInicio ASC", function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});
		}
		else{
			conn.query("SELECT * FROM publicacion WHERE visible = 1 AND idCategoria = '" + idCategoria + "' ORDER BY fechaInicio DESC", function(error, resultado){
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
			conn.query("SELECT * FROM publicacion WHERE visible = 1 AND idCategoria = '" + idCategoria + "'AND titulo LIKE '%" + string + "%' ORDER BY fechaInicio ASC", function(error, resultado){
				if (error) {
					callback(error);
				}
				else{
					callback(null, resultado);
				};
			});
		}
		else{
			conn.query("SELECT * FROM publicacion WHERE visible = 1 AND idCategoria = '" + idCategoria + "'AND titulo LIKE '%" + string + "%' ORDER BY fechaInicio DESC", function(error, resultado){
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

module.exports = modeloPublicacion;

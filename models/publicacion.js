var conn = require('./dbConnection');

var modeloPublicacion = {};

modeloPublicacion.getPublicaciones = function(callback){
	if (conn){
		conn.query('SELECT * FROM publicacion  WHERE visible = 1 ORDER BY fechaInicio DESC', function(error, resultado){
			if (error) {
				throw error;
			}
			else{
				callback(null, resultado);
			};
		});
	}
};

modeloPublicacion.getPublicacionesByNombre = function(string, callback){
	if (conn){
		conn.query("SELECT * FROM publicacion WHERE visible = 1 AND titulo LIKE '%" + string + "%' ORDER BY fechaInicio DESC" , function(error, resultado){
			if (error){
				callback(error);
			}
			else{
				callback(null, resultado);
			};
		});
	}
};

module.exports = modeloPublicacion;

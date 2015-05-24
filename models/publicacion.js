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

modeloPublicacion.getPublicacionByNombre = function(string, callback){
	if (conn){
		conn.query("SELECT * FROM publicacion WHERE visible = 1 AND titulo LIKE '%" + string + "%' ORDER BY fechaInicio DESC" , function(error, resultado){
			ig (error){
				throw error;
			}
			else{
				callback(null, resultado);
			};
		});
	}
};

module.exports = modeloPublicacion;

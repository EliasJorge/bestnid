var conn = require('./dbConnection');

var modeloPublicacion = {};

modeloPublicacion.getPublicaciones = function(desc, callback){
	if (conn){
		if (desc == 1) {
			conn.query('SELECT * FROM publicacion  WHERE visible = 1 ORDER BY fechaInicio ASC', function(error, resultado){
				if (error) {
					callback(error, null);
				}
				else{
					callback(null, resultado);
				};
			});
		}
		else{
			conn.query('SELECT * FROM publicacion  WHERE visible = 1 ORDER BY fechaInicio DESC', function(error, resultado){
				if (error) {
					callback(error, resultado);
				}
				else{
					callback(null, resultado);
				};
			});	
		}
		
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

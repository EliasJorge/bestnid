var conn = require('./dbConnection');

var modeloPublicacion = {};

modeloPublicacion.getPublicaciones = function(callback){
	if (conn){
		conn.query('SELECT * FROM publicacion ORDER BY idPublicacion', function(error, resultado){
			if (error) {
				throw error;
			}
			else{
				callback(null, resultado);
			};
		});
	}
};

module.exports = modeloPublicacion;

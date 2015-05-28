var conn = require('./dbConnection');

var modeloCategoria = {};

modeloCategoria.getCategorias = function(callback){
	if (conn){
		conn.query('SELECT * FROM categoria WHERE visible=1', function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado);
			};
		});
	}
};

module.exports = modeloCategoria;
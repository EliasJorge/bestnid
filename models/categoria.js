var conn = require('./dbConnection');

var modeloCategoria = {};

modeloCategoria.getCategorias = function(callback){
	if (conn){
		conn.query('SELECT * FROM categoria WHERE visible=1 ORDER BY nombre', function(error, resultado){
			if (error) {
				callback(error);
			}
			else{
				callback(null, resultado);
			};
		});
	}
};

modeloCategoria.eliminarCategoria = function(id, callback){
	if (conn){
		var query = 'DELETE FROM categoria WHERE idCategoria = ' + id;
		conn.query(query, function(error,resultado){
			if (error){
				callback(error);
			} else {
				callback(null,resultado);
			};
		});
	}
};

module.exports = modeloCategoria;
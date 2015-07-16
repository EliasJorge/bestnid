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

modeloCategoria.existeCategoriaConNombre = function(nombreCategoria, callback){
	if (conn) {
		conn.query('SELECT * FROM categoria WHERE nombre = "' + nombreCategoria + '"', function(error, resultado){
			if (error) {
				callback(error);
			}else{
				callback(null, resultado)
			}
		});
	};
}

modeloCategoria.modificarCategoria = function(idCategoria, nombreCategoria ,callback){
	if (conn) {
		conn.query('UPDATE categoria SET nombre = "' + nombreCategoria + '" WHERE idCategoria = ' + idCategoria, function(error){
			if (error) {
				callback(error);
			}else{
				callback(null);
			}
		});
	};
}
modeloCategoria.agregarCategoria = function(nombre, callback){
	if (conn){
		var query = 'INSERT INTO categoria (nombre) VALUES (' + conn.escape(nombre) + ')';
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
var conn = require('./dbConnection');

var modeloUsuario = {};

modeloUsuario.insertar = function(nuevoUsuario, callback){
	if (conn) {
		conn.query('INSERT INTO usuario SET ?', nuevoUsuario, function(error, resultado){
			if (error) {
				throw error;
			} else {
				//devolvemos la última id insertada
                callback(null,{"idInsertado" : resultado.insertId});
			};
		});
	};
};

module.exports = modeloUsuario;
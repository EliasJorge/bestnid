var conn = require('./dbConnection');

var modeloUsuario = {};

modeloUsuario.insertar = function(nuevoUsuario, callback){
	if (conn) {
		var query = 'INSERT INTO usuario (nombre, apellido, nombreUsuario, password, ' +
			'ingresos, mail, foto, fechaRegistro, esAdmin) VALUES (' +
			"'" + nuevoUsuario.nombre + "', " +
			"'" + nuevoUsuario.apellido + "', " +
			"'" + nuevoUsuario.nombreUsuario + "', " +
			"'" + nuevoUsuario.password + "', " +
			nuevoUsuario.ingresos + ", " +
			"'" + nuevoUsuario.mail + "', " +
			"null, " +
			"CURRENT_DATE(), " +
			nuevoUsuario.esAdmin + ')';
		conn.query(query, function(error, resultado){
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
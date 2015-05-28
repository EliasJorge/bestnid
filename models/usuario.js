var conn = require('./dbConnection');

var modeloUsuario = {};

modeloUsuario.insertar = function(nuevoUsuario, callback){
	if (conn) {
		var query = 'INSERT INTO usuario (nombre, apellido, nombreUsuario, password, ' +
			'mail, foto, fechaRegistro) VALUES (' +
			"'" + nuevoUsuario.nombre + "', " +
			"'" + nuevoUsuario.apellido + "', " +
			"'" + nuevoUsuario.nombreUsuario + "', " +
			"'" + nuevoUsuario.password + "', " +
			"'" + nuevoUsuario.mail + "', " +
			"'/imagenes/perfilDefault.png', CURRENT_DATE())";
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				//devolvemos la última id insertada
                callback(null,{"idInsertado" : resultado.insertId});
			};
		});
	};
};

modeloUsuario.getUsuarioByNombre = function(nombreUsuario, callback){
	if (conn) {
		conn.query("SELECT * FROM usuario WHERE nombreUsuario = '" + nombreUsuario + "'", function(error, resultado){
			if (error) {
				callback(error);
			} else {
				callback(null, resultado);
			};
		});
	};
};

modeloUsuario.getLogin = function(nombreUsuario, password, callback){
	if (conn) {
		var query = 'SELECT * FROM usuario WHERE nombreUsuario = ' + conn.escape(nombreUsuario) +
			' AND password = ' + conn.escape(password);
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				callback(null, resultado);
			};
		})
	};
};

module.exports = modeloUsuario;
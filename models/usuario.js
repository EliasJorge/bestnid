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

modeloUsuario.getUsuarioByID = function(id, callback){
	if (conn) {
		conn.query("SELECT * FROM usuario WHERE idUsuario = '" + id + "'", function(error, resultado){
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

modeloUsuario.modificarUsuario = function(id, datos, callback){
	var cantPropiedades = 0;
	for (var k in datos) {
	    if (datos.hasOwnProperty(k)) {
	       ++cantPropiedades;
	    };
	};
	if (cantPropiedades > 0) {
		if (conn) {
			var query = 'UPDATE usuario SET ';
			for (var attr in datos) {
				query += attr + " = '" + datos[attr] + "',"
			};
			//Saco la ultima coma
			query = query.substring(0, query.length - 1);
			query += ' WHERE idUsuario = ' + id;
			console.log(query);
			conn.query(query, function(error, resultado){
				if (error) {
					callback(error);
				} else {
					callback(null, resultado);
				};
			})
		};
	} else {
		callback(null, {});
	};
};

modeloUsuario.pagar = function(publicador, admin, callback){
	if (conn) {
		var query = 'UPDATE usuario SET ingresos=ingresos+' + publicador.monto + ' WHERE idUsuario=' + publicador.id;
		conn.query(query, function(error, resultado){
			if (error) {
				callback(error);
			} else {
				var queryAdmin = 'UPDATE usuario SET ingresos=ingresos+' + admin.monto + ' WHERE idUsuario=' + admin.id;
				conn.query(queryAdmin, function(errorA, resultadoA){
					if (errorA) {
						callback(errorA);
					} else {
						callback(null, resultadoA);
					};
				});
			};
		});
	};
};

module.exports = modeloUsuario;
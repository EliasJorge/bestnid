//llamamos al paquete mysql que  instalamos
var mysql = require('mysql'),
//creamos la conexion a nuestra base de datos con los datos de acceso de cada uno
connection = mysql.createConnection(
    { 
        host: 'localhost', 
        user: 'root',  
        password: '', 
        database: 'bestnid'
    }
);
 
//creamos un objeto para ir almacenando todo lo que necesitemos
var modeloUsuario = {};

//se inserta un usuario nuevo IMPORTANTE falta verificar q no exista ya uno con ese nombre
modeloUsuario.insertarUsuario = function(nuevoUsuario, callback){
    if (connection) {
        connection.query('INSERT INTO usuarios SET ?', nuevoUsuario, function(error, resultado){
            if(error)
            {
                throw error;
            }
            else
            {
                //devolvemos la última id insertada
                callback(null,{"idInsertado" : resultado.insertId});
            }      
        });
    }
}

//se obtiene la informacion del usuario con id del parametro
modeloUsuario.getUsuario = function(id, callback){
    if (connection) {
        var sql = 'SELECT * FROM usuarios WHERE id =' + connection.escape(id);
        connection.query(sql, function(error, resultado){
            if (error) {
                throw error;
            }
            else {
                callback(null, resultado);
            }
        });
    }
}

//se obtienen todos los usuarios
modeloUsuario.getUsuarios = function(callback){
    if (connection) {
        connection.query('SELECT * FROM usuarios ORDER BY id', function(error, resultado){
            if (error) {
                throw error;
            }
            else
            {
                callback(null, resultado);
            }
        });
    }
}

//se verifica q exista el usuario con ese nombre y esa pass
modeloUsuario.loginUsuario = function(nombre_usuario, pass, callback){
    if (connection) {
        var sql = 'SELECT * FROM usuarios WHERE nombre_usuario = ' + connection.escape(nombre_usuario) + 'AND pass = ' + connection.escape(pass);
        connection.query(sql, function(error, resultado){
            if(error){
                throw error;
            }
            else{
                callback(null, resultado);
            }
        });
    }
}
module.exports = modeloUsuario;

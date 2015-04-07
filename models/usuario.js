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


//////EJEMPLOS DE OPERACIONES A LA BASE DE DATOS//////
//obtenemos todos los usuarios
modeloUsuario.getUsers = function(callback)
{
    if (connection) 
    {
        connection.query('SELECT * FROM usuarios ORDER BY id', function(error, rows) {
            if(error)
            {
                throw error;
            }
            else
            {
                callback(null, rows);
            }
        });
    }
}

 //obtenemos un usuario por su id
modeloUsuario.getUser = function(id,callback)
{
    if (connection) 
    {
        var sql = 'SELECT * FROM usuarios WHERE id = ' + connection.escape(id);
        connection.query(sql, function(error, row) 
        {
            if(error)
            {
                throw error;
            }
            else
            {
                callback(null, row);
            }
        });
    }
}

//obtenemos un usuario por su nombre de usuario y contraseña (para el login)
modeloUsuario.getUserByLogin = function(nombre_usuario, password ,callback)
{
    if (connection) 
    {
        var sql = 'SELECT * FROM usaurios WHERE nombre_usuario = ' + connection.escape(nombre_usuario) + 'AND pass =' + connection.escape(password);
        connection.query(sql, function(error, row) 
        {
            if(error)
            {
                throw error;
            }
            else
            {
                callback(null, row);
            }
        });
    }
}

//añadir un nuevo usuario
modeloUsuario.insertUser = function(userData,callback)
{
    if (connection) 
    {
        connection.query('INSERT INTO usuarios SET ?', userData, function(error, result) 
        {
            if(error)
            {
                throw error;
            }
            else
            {
                //devolvemos la última id insertada
                callback(null,{"insertId" : result.insertId});
            }
        });
    }
}
///////TENGO MAS EJEMPLOS , DESPUES VEMOS /////


//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = modeloUsuario;
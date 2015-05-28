var mysql = require('mysql');

//creamos la conexion a nuestra base de datos con los datos de acceso de cada uno
connection = mysql.createConnection(
    { 
        host: 'localhost', 
        user: 'root',  
        password: 'root', 
        database: 'bestnid',
        port: 3306
    }
);

module.exports = connection;
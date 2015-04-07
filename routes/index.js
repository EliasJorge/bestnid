var express = require('express');
var router = express.Router();

//para usar las operaciones definidas en usuario
var UserModel = require('../models/usuario');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;



///////////////EJEMPLOS DE COMO USAR LOS METODOS DEL MODELS/USUARIOS, NO ESTAN LAS VIEWS Y ESTAN HECHAS ASI NOMAS , MAÑANA LAS HAGO /////////////////////////

/* Creamos un nuevo usuario */
router.post("/user", function(req,res)
{
    //creamos un objeto con los datos a insertar del usuario
    var userData = {
        id : null,
        nombre_usuario : req.body.nombre_usuario, //pide al body el valor del input con id username
        email : req.body.email,
        pass : req.body.password,
        created_at : null
    };
    UserModel.insertUser(userData,function(error, data)//esta funcion seria callback en models/usuario
    {
        //si el usuario se ha insertado correctamente mostramos su info
        if(data && data.insertId)
        {
            res.redirect("/user/" + data.insertId);//redirecciona la pa pagina localhost:3000/user/elid
        }
        else
        {
            res.json(500,{"msg":"Error"});
        }
    });
});

/* Obtenemos un usuario por su id y lo mostramos en un formulario para editar */
router.get('/user/:id', function(req, res) 
{
    var id = req.params.id;//pide el parametro id q se mando en la url (por get)
    //solo actualizamos si la id es un número
    if(!isNaN(id))
    {
        UserModel.getUser(id,function(error, data)
        {
            //si existe el usuario mostramos el formulario
            if (typeof data !== 'undefined' && data.length > 0)
            {
                res.render("update",{ 
                    title : "Servicio rest con nodejs, express 4 y mysql", 
                    info : data
                });
            }
            //en otro caso mostramos un error
            else
            {
                res.json(404,{"msg":"notExist"});
            }
        });
    }
    //si la id no es numerica mostramos un error de servidor
    else
    {
        res.json(500,{"msg":"The id must be numeric"});
    }
});



router.post("/login", function(req,res)
{
    var nombre_usuario = req.body.nombre_usuario;
    var pass = req.body.password;
    UserModel.getUserByLogin(nombre_usuario, pass, function(error, data)
    {
        //si existe el usuario mostramos el formulario
        if (typeof data !== 'undefined' && data.length > 0)
        {
            sess=req.session;
            sess.nombre_usuario = nombre_usuario;
            sess.password = pass;
            res.send('sesion iniciada');
        }
        //en otro caso mostramos un error
        else
        {
            res.send('error');
        }
    });

});
//////////////////FIN EJEMPLOS///////////////////////////////////////
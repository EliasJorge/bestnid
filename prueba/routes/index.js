var express = require('express');
var router = express.Router();

//para usar las operaciones definidas en usuario
var modeloUsuario = require('../models/usuario');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;

router.get("/sign_up", function(req, res){
    res.render('sign_up');
});


//se inserta un nuevo usuario
router.post("/insertar_usr", function(req,res){
    //creamos un objeto con los datos a insertar
    var nuevoUsuario = {
        id : null,
        nombre_usuario : req.body.nombre_usuario,//pide al body el valor del input con id username
        email: req.body.email,
        pass : req.body.pass,
        created_at: null
    };
    modeloUsuario.insertarUsuario(nuevoUsuario, function(error, datos){
        //si el usuario fue insertado correctamente
        if(typeof datos !== 'undefined'){
            res.redirect("/usuario/" + datos.idInsertado);//redirecciona la pagina localhost:3000/usuario/elid
        }else{
            res.render("error",{message:"No se ha podido registrar"});
        }
    });
});

//se mira la informacion del usuario con id :id
router.get('/usuario/:id', function(req, res){
    var id = req.params.id;
    if (!isNaN(id)){
        modeloUsuario.getUsuario(id, function(error, datos){
            //si  existe el usuario
            if (typeof datos !== 'undefined' && datos.length > 0){
                res.render("perfil",{info : datos});
            }
            else {
                res.render("error",{message:"No existe el usuario"});
            }
        });
    }
    //si el id no es numerico
    else {
        res.render("error",{message:"No existe el usuario"});
    }

});

//ruta para el login
router.get("/log_in",function(req, res){
    res.render("log_in");
});


//cuando se hace login el form tiene como accion esta ruta, se verifica q exista el usuario y se guarda el arreglo de sesiones
router.post("/verificar_usuario", function(req, res){
    var nombre_usuario = req.body.nombre_usuario;
    var pass = req.body.pass;
    modeloUsuario(nombre_usuario, pass, function(error, resultado){
        if (typeof data !== 'undefined' && data.length > 0) {
            sess = req.session;
            sess.usuario = resultado;
            res.redirect("index");
        } else {
            res.render("error",{message:"Usuario o contraseña incorrecta"});
        }
    });
});

//ruta oculta para ver los usuarios insertados (solo para debuggear)

router.get("/usuarios", function(req, res){
    modeloUsuario.getUsuarios(function(error, resultado){
        if (typeof resultado !== 'undefined') {
            res.render('usuarios',{usuarios : resultado});
        }
        else{
            res.render("error",{message:"error"});
        }
    });
});

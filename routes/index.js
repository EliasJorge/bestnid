var express = require('express');
var router = express.Router();
var dbUsuario = require('../models/usuario');
var dbPublicacion = require('../models/publicacion');

/* GET home page. */
router.get('/', function(req, res, next) { 
	// aca abria que hacer el req session, si no hay nada queda en null o undefined no se cual entonces la barra tiene los botones ingresar e iniciar sesion
	//caso contrario , es decir hay una sesion activa la barra cambia con un menu desplegable con la opcion de ver perfil y cerrar sesion, ademas de un 
	//boton de notificaciones
	var sesionUsuario = null
	dbPublicacion.getPublicaciones(function(error, resultado){
		res.render('index', {publicaciones : resultado, sesionUsuario : usuario});
	});
});

router.get('/registro', function(req, res, next){
	res.render('registro');
});

router.get('/ingreso', function(req, res, next){
	res.render('ingreso');
});

router.post('/buscar', function(req, res, next){
	dbPublicacion.getPublicacionesByNombre(req.body.nombrePublicacion, function(error, resultado){
		if (error) {
			res.render('error', { mensaje:'Hubo un error en la búsqueda, por favor intente de nuevo' })
		} else{
			res.render('index', { publicaciones:resultado });
		};
	});
});

router.post('/insertarUsuario', function(req, res, next){
	var usuario = {
		nombre:req.body.nombre,
		apellido:req.body.apellido,
		nombreUsuario:req.body.nombreUsuario,
		password:req.body.pass,
		mail:req.body.mail
	};
	dbUsuario.insertar(usuario, function(error, respuesta){
		if (error) {
			res.render('error', { mensaje:'El nombre de usuario elegido ya existe' });
		} else {
			res.render('exito', { mensaje:'Usted ha sido registrado correctamente' });
		};
	});
});

module.exports = router;

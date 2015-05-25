var express = require('express');
var router = express.Router();
var dbUsuario = require('../models/usuario');
var dbPublicacion = require('../models/publicacion');

/* GET home page. */
router.get('/', function(req, res, next) { 
	// si la sesion no tiene un atributo que sea usuario es porque no tiene una sesion activa
	//entonces pongo sesionUsuario en null para que en la barra solo aparezca iniciar sesion y registarse
	//en caso de que tenga una sesion activa la barra aparecera con el nombre de usuario, notif y cerrar sesion
	var sesionUsuario = null
	if (req.session.hasOwnProperty('usuario')){
		sesionUsuario = req.session.usuario;
	}
	dbPublicacion.getPublicaciones(function(error, resultado){
		res.render('index', {publicaciones : resultado, sesionUsuario : sesionUsuario});
	});
});

router.get('/registro', function(req, res, next){
	if (req.session.hasOwnProperty('usuario')){
		res.redirect('/');
	} else {
		res.render('registro');
	};
});

router.get('/ingreso', function(req, res, next){
	if (req.session.hasOwnProperty('usuario')){
		res.redirect('/');
	} else {
		res.render('ingreso');
	};
});

router.post('/buscar', function(req, res, next){
	var sesionUsuario = null
	if (req.session.hasOwnProperty('usuario')){
		sesionUsuario = req.session.usuario;
	}
	dbPublicacion.getPublicacionesByNombre(req.body.nombrePublicacion, function(error, resultado){
		if (error) {
			res.render('error', { mensaje:'Hubo un error en la búsqueda, por favor intente de nuevo', sesionUsuario:sesionUsuario })
		} else{
			res.render('index', { publicaciones:resultado, sesionUsuario:sesionUsuario });
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

router.post('/iniciarSesion', function(req, res, next){
	dbUsuario.getLogin(req.body.nombreUsuario, req.body.password, function(error, resultado){
		if (error) {
			res.render('error', { mensaje:'Hubo un error en el inicio de sesión, por favor intente de nuevo' });
		} else {
			if (typeof resultado !== 'undefined' && resultado.length > 0) {
				req.session.usuario = resultado[0];
				res.redirect('/');
			} else {
				res.render('error', { mensaje:'Usuario o contraseña incorrecta' });
			};
		};
	});
});

module.exports = router;

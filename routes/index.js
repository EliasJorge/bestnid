var express = require('express');
var router = express.Router();
var dbUsuario = require('../models/usuario');
var dbPublicacion = require('../models/publicacion');

/* GET home page. */
router.get('/', function(req, res, next) { 
	dbPublicacion.getPublicaciones(function(error, resultado){
		res.render('index', {publicaciones : resultado});
	});
});

router.get('/registro', function(req, res, next){
	res.render('registro');
});

router.post('/buscar', function(req, res, next){
	dbPublicacion.getPublicacionesByNombre(req.body.nombrePublicacion, function(error, resultado){
		console.log(req.body.nombrePublicacion);
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
		ingresos:0,
		mail:req.body.mail,
		esAdmin:0,
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

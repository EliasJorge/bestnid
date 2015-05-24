var express = require('express');
var router = express.Router();
var dbUsuario = require('../models/usuario');
var dbPublicacion = require('../models/publicacion');

/* GET home page. */
router.get('/', function(req, res, next) { 
	dbPublicacion.getPublicaciones(function(error, resultado){
		res.render('index', {publicaciones : resultado});
	})
});

router.get('/registro', function(req, res, next){
	res.render('registro');
});

router.post('/insertarUsuario', function(req, res, next){
	var usuario = {
		idUsuario:null,
		nombre:req.body.nombre,
		apellido:req.body.apellido,
		nombreUsuario:req.body.nombreUsuario,
		password:req.body.pass,
		ingresos:0,
		mail:req.body.mail,
		fechaRegistro:"CURRENT_DATE",
		esAdmin:0,
	};
	dbUsuario.insertar(usuario, function(error, respuesta){
		if (error) {
			throw error;
		} else {
			res.render('index', { title: 'Bestnid' });
		};
	});
});

module.exports = router;

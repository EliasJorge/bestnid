var express = require('express');
var router = express.Router();
var db = require('../models/usuario');

/* GET home page. */
router.get('/', function(req, res, next) {
 	res.render('index', { title: 'Express' });
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
		foto:null,
		fechaRegistro:"CURRENT_DATE",
		esAdmin:0,
		tarjeta:null
	};
	db.insertar(usuario, function(error, res){
		if (error) {
			throw error;
		} else {
			res.render('/');
		};
	});
});

module.exports = router;

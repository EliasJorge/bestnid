var express = require('express');
var router = express.Router();
var dbUsuario = require('../models/usuario');
var dbPublicacion = require('../models/publicacion');
var dbCategoria = require('../models/categoria');

/* GET home page. */
router.get('/', function(req, res, next) { 
	// si la sesion no tiene un atributo que sea usuario es porque no tiene una sesion activa
	//entonces pongo sesionUsuario en null para que en la barra solo aparezca iniciar sesion y registarse
	//en caso de que tenga una sesion activa la barra aparecera con el nombre de usuario, notif y cerrar sesion
	//listo las ultimas publicaciones y las categorias
	var aux={};
	dbPublicacion.getPublicaciones(req.query.desc, function(errorP, resultadoP){
		if (errorP){
			res.render('error', { mensaje:'Hubo un error al cargar las publicaciones, por favor intente de nuevo', sesionUsuario:req.session.usuario })
		} else {
			aux.publicaciones=resultadoP;
			dbCategoria.getCategorias(function(errorC,resultadoC){
				if (errorC){
					res.render('error', { mensaje:'Hubo un error al cargar las categorias, por favor intente de nuevo', sesionUsuario:req.session.usuario })
				} else {
					res.render('index', 
						{
							publicaciones: aux.publicaciones, 
							categorias: resultadoC, 
							sesionUsuario: req.session.usuario,
							url: req.originalUrl,
							categoriaActiva: null
						});
				}
			});
		};
	});
});

router.get('/categoria/:id', function(req,res,next){
	var aux={};
	dbPublicacion.getPublicacionesByCategoria(req.params.id, req.query.desc, function(errorP,resultadoP){
		if (errorP){
			res.render('error', { mensaje:'Hubo un error al cargar las publicaciones, por favor intente de nuevo', sesionUsuario:req.session.usuario })
		} else {
			aux.publicaciones=resultadoP;
			dbCategoria.getCategorias(function(errorC,resultadoC){
				if (errorC){
					res.render('error', { mensaje:'Hubo un error al cargar las categorias, por favor intente de nuevo', sesionUsuario:req.session.usuario })
				} else {
					res.render('index', 
						{
							publicaciones : aux.publicaciones, 
							categorias:resultadoC, 
							sesionUsuario : req.session.usuario,
							url:req.originalUrl,
							categoriaActiva: req.params.id
						});
				};
			});
		};
	});
})


router.get('/registro', function(req, res, next){
	if (req.session.usuario != null){
		res.redirect('/');
	} else {
		res.render('registro');
	};
});

router.get('/ingreso', function(req, res, next){
	if (req.session.usuario != null){
		res.redirect('/');
	} else {
		res.render('ingreso');
	};
});

router.get('/buscar/:busqueda', function(req, res, next){
	var aux={};
	dbPublicacion.getPublicacionesByNombre(req.params.busqueda, req.query.desc, function(errorP, resultadoP){
		if (errorP) {
			res.render('error', { mensaje:'Hubo un error en la búsqueda, por favor intente de nuevo', sesionUsuario:req.session.usuario })
		} else{
			aux.publicaciones=resultadoP;
			dbCategoria.getCategorias(function(errorC,resultadoC){
				if (errorC){
					res.render('error', { mensaje:'Hubo un error al cargar las categorias, por favor intente de nuevo', sesionUsuario:req.session.usuario })
				} else {
					res.render('index', {
						publicaciones : aux.publicaciones, 
						categorias:resultadoC, 
						sesionUsuario : req.session.usuario,
						url:req.originalUrl,
						categoriaActiva: null
					});
				};
			});
		};
	});
});


router.post('/buscar', function(req, res, next){
	res.redirect('/buscar/' + req.body.nombrePublicacion);
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
			dbUsuario.getLogin(req.body.nombreUsuario, req.body.pass, function(error, resultado){
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

router.get('/cerrarSesion', function(req,res,next){
	req.session.destroy();
	res.redirect('/');
});


module.exports = router;

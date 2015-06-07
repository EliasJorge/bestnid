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
			res.render('error', {
				mensaje:'Hubo un error al cargar las publicaciones, por favor intente de nuevo',
				sesionUsuario:req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		} else {
			aux.publicaciones=resultadoP;
			dbCategoria.getCategorias(function(errorC,resultadoC){
				if (errorC){
					res.render('error', {
						mensaje:'Hubo un error al cargar las categorias, por favor intente de nuevo',
						sesionUsuario:req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl
					});
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
			res.render('error', {
				mensaje:'Hubo un error al cargar las publicaciones, por favor intente de nuevo',
				sesionUsuario:req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		} else {
			aux.publicaciones=resultadoP;
			dbCategoria.getCategorias(function(errorC,resultadoC){
				if (errorC){
					res.render('error', {
						mensaje:'Hubo un error al cargar las categorias, por favor intente de nuevo',
						sesionUsuario:req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl
					});
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
});

router.get('/categoria/:id/buscar/:busqueda', function(req,res,next){
	var aux={};
	dbPublicacion.getPublicacionesByCategoriaAndNombre(req.params.id, req.params.busqueda, req.query.desc, function(errorP,resultadoP){
		if (errorP){
			res.render('error', {
				mensaje:'Hubo un error al cargar las publicaciones, por favor intente de nuevo',
				sesionUsuario:req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		} else {
			aux.publicaciones=resultadoP;
			dbCategoria.getCategorias(function(errorC,resultadoC){
				if (errorC){
					res.render('error', {
						mensaje:'Hubo un error al cargar las categorias, por favor intente de nuevo',
						sesionUsuario:req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl
					});
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
});

router.get('/perfil/:id/publicaciones', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id) {
		dbPublicacion.getPublicacionesByUsuario(req.params.id, function(error, resultado){
			if (error) {
				res.render('error', {
					mensaje:'Hubo un error al cargar sus publicaciones, por favor intente de nuevo',
					sesionUsuario: req.session.usuario,
					categoriaActiva: null,
					url:req.originalUrl
				});
			} else {
				res.render('perfil', {
					sesionUsuario: req.session.usuario,
					categoriaActiva: null,
					url:req.originalUrl,
					publicaciones: resultado,
					tipoContenido: 'publicaciones'
				});
			};
		});
	} else {
		res.redirect('/');
	};
});

//////////////////////////////////////////////////////////////////////
/////////////// PARA PROBAR EL PERFIL, DESP LLENAR ///////////////////
//////////////////////////////////////////////////////////////////////

router.get('/perfil/:id/ofertas', function(req, res, next){
	res.render('perfil', {
		sesionUsuario: req.session.usuario,
		categoriaActiva: null,
		url:req.originalUrl,
		publicaciones: [],
		tipoContenido: 'ofertas'
	});
});

router.get('/perfil/:id/preguntas', function(req, res, next){
	res.render('perfil', {
		sesionUsuario: req.session.usuario,
		categoriaActiva: null,
		url:req.originalUrl,
		publicaciones: [],
		tipoContenido: 'preguntas'
	});
});

router.get('/perfil/:id/estadisticas', function(req, res, next){
	res.render('perfil', {
		sesionUsuario: req.session.usuario,
		categoriaActiva: null,
		url:req.originalUrl,
		publicaciones: [],
		tipoContenido: 'estadisticas'
	});
});

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

router.get('/publicacion', function(req, res){
	res.render('publicacion', {
		sesionUsuario: req.session.usuario,
		categoriaActiva: null,
		url:req.originalUrl,
	});
});

router.get('/registro', function(req, res, next){
	if (req.session.usuario != null){
		res.redirect('/');
	} else {
		res.render('registro', {
			categoriaActiva: null,
			url:req.originalUrl,
			usuarioExistente: false,
			nombreUsuario: '',
			nombre: '',
			apellido: '',
			mail: '',
		});
	};
});

router.get('/ingreso', function(req, res, next){
	if (req.session.usuario != null){
		res.redirect('/');
	} else {
		res.render('ingreso', {
			categoriaActiva: null,
			url:req.originalUrl,
			usuarioExistente: false,
			nombreUsuario: ''
		});
	};
});

router.get('/buscar/:busqueda', function(req, res, next){
	var aux={};
	dbPublicacion.getPublicacionesByNombre(req.params.busqueda, req.query.desc, function(errorP, resultadoP){
		if (errorP) {
			res.render('error', {
				mensaje:'Hubo un error en la búsqueda, por favor intente de nuevo',
				sesionUsuario:req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl,
			});
		} else{
			aux.publicaciones=resultadoP;
			dbCategoria.getCategorias(function(errorC,resultadoC){
				if (errorC){
					res.render('error', {
						mensaje:'Hubo un error al cargar las categorias, por favor intente de nuevo',
						sesionUsuario:req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl,
					});
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
	if (req.query.categoriaActiva == '') {
		res.redirect('/buscar/' + req.body.nombrePublicacion);
	}
	else {
		console.log('/categoria/' + req.query.categoriaActiva  + '/buscar/' + req.body.nombrePublicacion);
		res.redirect('/categoria/' + req.query.categoriaActiva  + '/buscar/' + req.body.nombrePublicacion);
	}
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
			res.render('registro', {
				categoriaActiva: null,
				url:req.originalUrl,
				usuarioExistente: true,
				nombreUsuario: usuario.nombreUsuario,
				nombre: usuario.nombre,
				apellido: usuario.apellido,
				mail: usuario.mail,
			});
		} else {
			dbUsuario.getLogin(req.body.nombreUsuario, req.body.pass, function(error, resultado){
				if (error) {
					res.render('error', {
						mensaje:'Hubo un error en el inicio de sesión, por favor intente de nuevo',
						sesionUsuario: req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl
					});
				} else {
					if (typeof resultado !== 'undefined' && resultado.length > 0) {
						req.session.usuario = resultado[0];
						//Corto la fecha para darle otro formato
						var arregloFecha = req.session.usuario.fechaRegistro.split('-');
						req.session.usuario.fechaRegistro = arregloFecha[2] + '/' + arregloFecha[1] + '/' + arregloFecha[0];
						res.redirect('/');
					} else {
						res.render('error', {
							mensaje:'Usuario o contraseña incorrecta',
							sesionUsuario: req.session.usuario,
							categoriaActiva: null,
							url:req.originalUrl
						});
					};
				};
			});
		};
	});
});

router.post('/iniciarSesion', function(req, res, next){
	dbUsuario.getLogin(req.body.nombreUsuario, req.body.password, function(error, resultado){
		if (error) {
			res.render('error', {
				mensaje:'Hubo un error en el inicio de sesión, por favor intente de nuevo',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		} else {
			if (typeof resultado !== 'undefined' && resultado.length > 0) {
				req.session.usuario = resultado[0];
				//Corto la fecha para darle otro formato
				var arregloFecha = req.session.usuario.fechaRegistro.split('-');
				req.session.usuario.fechaRegistro = arregloFecha[2] + '/' + arregloFecha[1] + '/' + arregloFecha[0];
				res.redirect('/');
			} else {
				res.render('ingreso', {
					categoriaActiva: null,
					url:req.originalUrl,
					usuarioExistente: true,
					nombreUsuario: req.body.nombreUsuario
				});
			};
		};
	});
});

router.get('/cerrarSesion', function(req,res,next){
	req.session.destroy();
	res.redirect('/');
});


module.exports = router;

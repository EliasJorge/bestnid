var express = require('express');
var multer = require('multer');
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


router.get('/publicacion/:id', function(req, res, next){
	dbPublicacion.getPublicacionByID(req.params.id, 
	function(errorPublicacion, datosPublicacion){
		if (errorPublicacion){
			res.render('error', {
				mensaje:'Hubo un error al cargar la publicacion, por favor intente de nuevo',
				sesionUsuario:req.session.usuario,
				url:req.originalUrl
			});
		}
		else{
			dbPublicacion.getPreguntasYRespuestasDePublicacion(datosPublicacion,
			function(errorPYR, preguntasYRespuestas, publicacion){
				if (errorPYR) {
					res.render('error', {
						mensaje:'Hubo un error al cargar la publicacion, por favor intente de nuevo',
						sesionUsuario:req.session.usuario,
						url:req.originalUrl
					});
				}
				else{
					console.log(Object.keys(preguntasYRespuestas[0]));
					res.render('publicacion', {
						sesionUsuario: req.session.usuario,
						publicacion:publicacion,
						preguntasYRespuestas:preguntasYRespuestas,
						url:req.originalUrl
					});
				}
			}
			);
		}
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
					tipoContenido: 'publicaciones',
					usuarioExistente: false,
					passwordIncorrecta: false,
					passwordCambiada: false,
					nombreUsuario: '',
					nombre: '',
					apellido: '',
					mail: ''
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
		tipoContenido: 'ofertas',
		usuarioExistente: false,
		passwordIncorrecta: false,
		passwordCambiada: false,
		nombreUsuario: '',
		nombre: '',
		apellido: '',
		mail: ''
	});
});

router.get('/perfil/:id/preguntas', function(req, res, next){
	res.render('perfil', {
		sesionUsuario: req.session.usuario,
		categoriaActiva: null,
		url:req.originalUrl,
		publicaciones: [],
		tipoContenido: 'preguntas',
		usuarioExistente: false,
		passwordIncorrecta: false,
		passwordCambiada: false,
		nombreUsuario: '',
		nombre: '',
		apellido: '',
		mail: ''
	});
});

router.get('/perfil/:id/estadisticas', function(req, res, next){
	res.render('perfil', {
		sesionUsuario: req.session.usuario,
		categoriaActiva: null,
		url:req.originalUrl,
		publicaciones: [],
		tipoContenido: 'estadisticas',
		usuarioExistente: false,
		passwordIncorrecta: false,
		passwordCambiada: false,
		nombreUsuario: '',
		nombre: '',
		apellido: '',
		mail: ''
	});
});

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

router.post('/actualizarInfo/:id', function(req, res, next){
	//Verifico que haya una sesion activa
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id) {
		//Creo un array con los datos que se van a modificar
		var datosModificar = {};
		//Si hay que modificar el nombre de usuario
		if (req.body.nombreUsuario != '') {
			//Me fijo si existe un usuario con el nombre elegido
			dbUsuario.getUsuarioByNombre(req.body.nombreUsuario, function(error, resultado){
				if (error) {
					//Hubo un error al buscar usuarios
					res.render('error', {
						mensaje:'Hubo un error al conectarse a la base de datos, por favor intente de nuevo',
						sesionUsuario:req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl,
					});
				} else {
					//No hubo error
					//Encontre alguno con ese nombre?
					if (typeof resultado !== 'undefined' && resultado.length > 0) {
						//Como encontre uno, pido las publicaciones para recargar la vista de perfil con el msj de error
						dbPublicacion.getPublicacionesByUsuario(req.params.id, function(errorP, resultadoP){
							if (errorP) {
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
									publicaciones: resultadoP,
									tipoContenido: 'publicaciones',
									usuarioExistente: true,
									passwordIncorrecta: false,
									passwordCambiada: false,
									nombreUsuario: req.body.nombreUsuario,
									nombre: req.body.nombre,
									apellido: req.body.apellido,
									mail: req.body.mail
								});
							};
						});
					} else {
						//No hay nadie con ese nombre, modifico
						datosModificar.nombreUsuario = req.body.nombreUsuario;
						if (req.body.nombre != '') {
							datosModificar.nombre = req.body.nombre;
						};
						if (req.body.apellido != '') {
							datosModificar.apellido = req.body.apellido;
						};
						if (req.body.mail != '') {
							datosModificar.mail = req.body.mail;
						};
						dbUsuario.modificarUsuario(req.params.id, datosModificar, function(errorM, resultadoM){
							if (errorM) {
								//Hubo un error al modificar los datos
								res.render('error', {
									mensaje:'Hubo un error al modificar sus datos, por favor intente de nuevo',
									sesionUsuario: req.session.usuario,
									categoriaActiva: null,
									url:req.originalUrl
								});
							} else {
								for (var attr in datosModificar) {
									req.session.usuario[attr] = datosModificar[attr];
								};
								res.redirect('/perfil/' + req.params.id + '/publicaciones');
							};
						});
					};
				};
			});
		} else {
			if (req.body.nombre != '') {
				datosModificar.nombre = req.body.nombre;
			};
			if (req.body.apellido != '') {
				datosModificar.apellido = req.body.apellido;
			};
			if (req.body.mail != '') {
				datosModificar.mail = req.body.mail;
			};
			dbUsuario.modificarUsuario(req.params.id, datosModificar, function(errorM, resultadoM){
				if (errorM) {
					//Hubo un error al modificar los datos
					res.render('error', {
						mensaje:'Hubo un error al modificar sus datos, por favor intente de nuevo',
						sesionUsuario: req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl
					});
				} else {
					for (var attr in datosModificar) {
						req.session.usuario[attr] = datosModificar[attr];
					};
					res.redirect('/perfil/' + req.params.id + '/publicaciones');
				};
			});
		};
	} else {
		res.redirect('/');
	};
});

router.post('/actualizarPassword/:id', function(req, res, next){
	//Si hay una cuenta iniciada
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id) {
		//Si la contraseña antigua no coincide con la existente
		if (req.body.oldPass != req.session.usuario.password) {
			dbPublicacion.getPublicacionesByUsuario(req.params.id, function(errorP, resultadoP){
				if (errorP) {
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
						publicaciones: resultadoP,
						tipoContenido: 'publicaciones',
						usuarioExistente: false,
						passwordIncorrecta: true,
						passwordCambiada: false,
						nombreUsuario: req.body.nombreUsuario,
						nombre: req.body.nombre,
						apellido: req.body.apellido,
						mail: req.body.mail
					});
				};
			});
		} else {
			datosNuevos = { password: req.body.newPass };
			dbUsuario.modificarUsuario(req.params.id, datosNuevos, function(errorM, resultadoM){
				if (errorM) {
					//Hubo un error al modificar los datos
					res.render('error', {
						mensaje:'Hubo un error al modificar sus datos, por favor intente de nuevo',
						sesionUsuario: req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl
					});
				} else {
					req.session.usuario.password = datosNuevos.password;
					dbPublicacion.getPublicacionesByUsuario(req.params.id, function(errorP, resultadoP){
						if (errorP) {
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
								publicaciones: resultadoP,
								tipoContenido: 'publicaciones',
								usuarioExistente: false,
								passwordIncorrecta: false,
								passwordCambiada: true,
								nombreUsuario: req.body.nombreUsuario,
								nombre: req.body.nombre,
								apellido: req.body.apellido,
								mail: req.body.mail
							});
						};
					});
				};
			});
		};
	} else {
		res.redirect('/');
	};
});

router.post('/actualizarImagen/:id', [ multer({ dest: './public/imagenes/'}), function(req, res, next){
	//Si hay una cuenta iniciada
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id) {
		if (req.files.pic !== undefined) {
			req.session.usuario.foto = req.files.pic.path.substring(6,req.files.pic.path.length);
		    dbUsuario.modificarUsuario(req.params.id, { foto:req.session.usuario.foto }, function(error, resultado){
		    	if (error) {
		    		res.render('error', {
						mensaje:'Hubo un error al actualizar su foto de perfil, por favor intente de nuevo',
						sesionUsuario:req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl,
					});
		    	} else {
		    		res.redirect('/perfil/' + req.params.id + '/publicaciones');
		    	};
		    });
		} else {
			res.redirect('/perfil/' + req.params.id + '/publicaciones');
		};
	} else {
		res.redirect('/');
	}
}]);

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

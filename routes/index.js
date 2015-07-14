var express = require('express');
var multer = require('multer');
var router = express.Router();
var dbUsuario = require('../models/usuario');
var dbPublicacion = require('../models/publicacion');
var dbCategoria = require('../models/categoria');
var dbOferta = require('../models/oferta');
var dbPregunta = require('../models/pregunta');
var dbRespuesta = require('../models/respuesta');

function fechaFormatoLocal(fecha){
	//Corto la fecha para darle otro formato
	var arregloFecha = fecha.split('-');
	return arregloFecha[2] + '/' + arregloFecha[1] + '/' + arregloFecha[0];
};

function reemplazar(str){
	return str.replace(/\'/g, "\\'");
}

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
			if(typeof(datosPublicacion) != 'undefined' && datosPublicacion.visible == true){
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
						if(req.session.usuario == null){
							res.render('publicacion', {
								sesionUsuario: req.session.usuario,
								publicacion:publicacion,
								preguntasYRespuestas:preguntasYRespuestas,
								url:req.originalUrl
							});
						}
						else{
							dbOferta.getOfertasDePublicacion(publicacion,preguntasYRespuestas,
							function(error,ofertas,publicacion, preguntasYRespuestas){
								res.render('publicacion', {
									sesionUsuario: req.session.usuario,
									publicacion:publicacion,
									preguntasYRespuestas:preguntasYRespuestas,
									url:req.originalUrl,
									ofertas:ofertas
								});
							});
						}
					}
				});
			}
			else{
				res.redirect('/');
			}
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

router.get('/perfil/:id', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id) {
		var puedeBorrar = req.session.puedeBorrar;
		req.session.puedeBorrar = null;
		var publicacionEliminada = req.session.publicacionEliminada;
		req.session.publicacionEliminada = null;
		res.render('perfil', {
			sesionUsuario: req.session.usuario,
			categoriaActiva: null,
			url:req.originalUrl,
			usuarioExistente: false,
			passwordIncorrecta: false,
			passwordCambiada: false,
			datosCambiados: false,
			nombreUsuario: '',
			nombre: '',
			apellido: '',
			mail: '',
			puedeBorrar: puedeBorrar,
			publicacionEliminada: publicacionEliminada
		});
	} else {
		res.redirect('/');
	};
});

router.get('/perfil/:id/publicaciones', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id) {
		dbPublicacion.getPublicacionesByUsuario(req.params.id, function(error, resultado){
			if (error) {
				var errorHTML = '<div class="col-md-12">' +
		           	'<div class="alert alert-danger"><span>Hubo un error al cargar sus publicaciones, por favor intente más tarde</span></div>' +
		            '</div>';
				res.send(errorHTML);
			} else {
				var listadoHTML = '';
				if (resultado.length > 0) {
					for (var i = 0; i < resultado.length; i++) {
						if (resultado[i].visible == 1) {
		    				var tituloMostrar = '';
		    				var descripcionMostrar = '';
		    				if (resultado[i].titulo.length > 37) {
		                        tituloMostrar = resultado[i].titulo.substring(0,35) + '...';
		                    } else {
		                        tituloMostrar = resultado[i].titulo;
		                    }
		                    if (resultado[i].descripcion.length > 65) {
		                        descripcionMostrar = resultado[i].descripcion.replace("\n"," ").substring(0,62) + '...';
		                    } else {
		                        descripcionMostrar = resultado[i].descripcion.replace("\n"," ");
		                    }
		    				var thumbnail = '';
		    				thumbnail = '<div class="col-sm-4 col-lg-4 col-md-4">' +
										'<div class="thumbnail" style="height: 22em;  word-wrap: break-word;">' + 
										'<a href="/publicacion/' + resultado[i].idPublicacion + '">' +
										'<div><img class="img-responsive" src ="' + resultado[i].foto + '" style="width: 18em; height: 12em;" alt="" >' +
					                    '</div></a>' +
					                        '<div class="caption-full">' +
					                            '<h4><a href="/publicacion/' + resultado[i].idPublicacion + '">' +
					                                tituloMostrar +
					                            '</a></h4>';
							if (resultado[i].terminada) {
								if (resultado[i].idOfertaGanadora != null) {
									if (resultado[i].pagada) {
										thumbnail += '<p class="text-center alert alert-success" style="font-size: 1.2em; padding-top: 1em;">Finalizada</p></div></div></div>';
									} else {
										thumbnail += '<p class="text-center alert alert-warning" style="font-size: 1.2em; padding-top: 1em;">Esperando pago</p></div></div></div>';
									};
								} else {
									thumbnail += '<div class="text-center"><a href="/publicacion/' + resultado[i].idPublicacion + '">' +
										'<button type="button" class="btn btn-success" style="margin-top: 1em;">Elegir Ganador</button></a></div></div></div></div>'
									//thumbnail += '<p class="text-center alert alert-success" style="font-size: 1.2em; padding-top: 1em;">Terminada</p></div></div></div>';
								};
							} else {
								thumbnail += '<p style="font-size: 0.9em;">' + descripcionMostrar + '</p></div></div></div>';
							};
							
							                            
			                listadoHTML += thumbnail;
			            };
	    			}
				} else {
					listadoHTML = '<div class="col-md-12">' +
		           		'<div class="alert alert-danger"><span>No hay datos disponibles</span></div>' +
		            	'</div>';
				};
				res.send(listadoHTML);
			};
		});
	} else {
		var errorHTML = '<div class="col-md-12">' +
           	'<div class="alert alert-danger"><span>Hubo un error al validar la sesión, por favor intente más tarde</span></div>' +
            '</div>';
		res.send(errorHTML);
	};
});

router.get('/perfil/:id/ofertas', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id) {
		dbOferta.getOfertasDeUsuario(req.session.usuario, function(error, resultado){
			if (error) {
				var errorHTML = '<div class="col-md-12">' +
		           	'<div class="alert alert-danger"><span>Hubo un error al cargar sus ofertas, por favor intente más tarde</span></div>' +
		            '</div>';
				res.send(errorHTML);
			} else {
				var listadoHTML = '';
	            if (resultado.length > 0) {
	            	listadoHTML = '<div class="col-md-12" style="height: 10em;  word-wrap: break-word;">' +
	            		'<div class="panel-group">';
	            	for (var i = 0; i < resultado.length; i++) {
	            		if (resultado[i].visible == 1) {
		            		var panelHeading = '<div class="panel panel-info" style="margin-bottom:2em">' +
		            			'<div class="panel-heading"><a href="/publicacion/' + resultado[i].idPublicacion + '">' +
		            			resultado[i].titulo + '</a></div>';
		            		if (resultado[i].idOfertaGanadora == resultado[i].idOferta) {
		            			panelHeading = '<div class="panel panel-success" style="margin-bottom:2em">' +
		            				'<div class="panel-heading">' +
		            				'<a style="color:#004400;" href="/publicacion/' + resultado[i].idPublicacion + '">' +
		            				resultado[i].titulo + '</a></div>';
		            		};
		            		listadoHTML += panelHeading +
						    	'<div class="panel-body">' +
						    		'<p><b>Descripción</b></p>' +
						    		'<p>' + resultado[i].texto + '</p>' +
						    		'<p><b>Monto:</b> $' + resultado[i].monto + '</p>' +
						    		'<p><b>Fecha:</b> ' + fechaFormatoLocal(resultado[i].fechaOferta) + '</p>';
						    if (resultado[i].idOfertaGanadora == resultado[i].idOferta) {
						    	if (!resultado[i].pagada) {
						    		listadoHTML += '<a href="/pagar/' +
							    		resultado[i].idOfertaGanadora + '/' +
							    		resultado[i].idPublicacion +
							    		'">' +
							    		'<button type="button" class="pull-right btn btn-success">' +
							    		'Pagar</button></a>';
							    } else {
							    	listadoHTML += '<div class="alert alert-success pull-right" style="margin-bottom:0em"><span>Ya ha adquirido este producto, ' +
							    		'<a href="/datosPublicador/' + resultado[i].idPublicacion + '" style="color:#00aa00;">' +
							    		'<i>consulte los datos del publicador</i></a>' +
							    		'</span></div>';
							    };
							};
						    listadoHTML += '</div></div>';
						};
	            	};
	            	listadoHTML += '</div></div>';
	            } else {
	            	listadoHTML = '<div class="col-md-12">' +
		           		'<div class="alert alert-danger"><span>No hay datos disponibles</span></div>' +
		            	'</div>';
	            };
	            res.send(listadoHTML);
			};
		});
	} else {
		var errorHTML = '<div class="col-md-12">' +
           	'<div class="alert alert-danger"><span>Hubo un error al validar la sesión, por favor intente más tarde</span></div>' +
            '</div>';
		res.send(errorHTML);
	};
});

router.get('/perfil/:id/pubsGanadas', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id) {
		dbPublicacion.getPublicacionesGanadasPorUsuario(req.session.usuario.idUsuario, function(error, resultado){
			if (error) {
				var errorHTML = '<div class="col-md-12">' +
		           	'<div class="alert alert-danger"><span>Hubo un error al cargar sus ofertas, por favor intente más tarde</span></div>' +
		            '</div>';
				res.send(errorHTML);
			} else {
				var listadoHTML = '';
				if (resultado.length > 0) {
					for (var i = 0; i < resultado.length; i++) {
	    				var tituloMostrar = '';
	    				var descripcionMostrar = '';
	    				if (resultado[i].titulo.length > 37) {
	                        tituloMostrar = resultado[i].titulo.substring(0,35) + '...';
	                    } else {
	                        tituloMostrar = resultado[i].titulo;
	                    }
	                    if (resultado[i].descripcion.length > 65) {
	                        descripcionMostrar = resultado[i].descripcion.replace("\n"," ").substring(0,62) + '...';
	                    } else {
	                        descripcionMostrar = resultado[i].descripcion.replace("\n"," ");
	                    }
	    				var thumbnail = '';
	    				thumbnail = '<div class="col-sm-4 col-lg-4 col-md-4">';
						if (resultado[i].visible == 1) {
							thumbnail += '<div class="thumbnail" style="height: 22em;  word-wrap: break-word;">' + 
										'<a href="/publicacion/' + resultado[i].idPublicacion + '">' +
										'<div><img class="img-responsive" src ="' + resultado[i].foto + '" style="width: 18em; height: 12em;" alt="" >' +
					                    '</div></a>' +
					                        '<div class="caption-full">' +
					                            '<h4><a href="/publicacion/' + resultado[i].idPublicacion + '">' +
					                                tituloMostrar +
					                            '</a></h4>';
						} else {
							thumbnail += '<div class="thumbnail" style="height: 22em;  word-wrap: break-word; background-color: #eee;">' +
											'<div style="opacity: 0.7; filter: alpha(opacity=70); background-color: #000;">' +
												'<img class="img-responsive" src ="' + resultado[i].foto +
													'" style="width: 18em; height: 12em; opacity: 0.7; filter: alpha(opacity=70);" alt="" >' +
						                    '</div>' +
						                        '<div class="caption-full">' +
						                        '<h4>' + tituloMostrar + '</h4>';
						};

						if (resultado[i].pagada) {
							thumbnail += '<div class="alert alert-success text-center"><a href="/datosPublicador/' + resultado[i].idPublicacion + '" style="color:#007700;">' +
						    		'<i>Datos del publicador</i></a></div></div></div></div>'
						} else {
							thumbnail += '<div class="text-center"><a href="/pagar/' +
						    		resultado[i].idOfertaGanadora + '/' +
						    		resultado[i].idPublicacion +
						    		'">' +
									'<button type="button" class="btn btn-success" style="margin-top: 1em;">Pagar</button></a></div></div></div></div>'
						};

		                listadoHTML += thumbnail;
	    			};
	    		} else {
	            	listadoHTML = '<div class="col-md-12">' +
		           		'<div class="alert alert-danger"><span>No hay datos disponibles</span></div>' +
		            	'</div>';
	            };
	            res.send(listadoHTML);
			};
		});
	} else {
		var errorHTML = '<div class="col-md-12">' +
           	'<div class="alert alert-danger"><span>Hubo un error al validar la sesión, por favor intente más tarde</span></div>' +
            '</div>';
		res.send(errorHTML);
	};
});

router.get('/perfil/:id/estadisticas', function(req, res, next){
    if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id) {
    	var html = '<div class="col-md-12 text-center">' +
    		'<a href="/' + req.session.usuario.idUsuario +
    		'/usuariosRegistrados" class="btn btn-primary text-center" style="width:15em; margin-right:1em;">Usuarios Registrados</a>' +
    		'<a href="/' + req.session.usuario.idUsuario +
    		'/pubsConcretadas" class="btn btn-primary text-center" style="width:15em; margin-right:1em;">Publicaciones Concretadas</a>' +
    		'<a href="/usuarios" class="btn btn-primary text-center" style="width:15em;"> Administradores</a>'+
    		'</div>';
    	res.send(html);
    } else {
    	var errorHTML = '<div class="col-md-12">' +
           	'<div class="alert alert-danger"><span>Hubo un error al validar la sesión, por favor intente más tarde</span></div>' +
            '</div>';
		res.send(errorHTML);
    };
});

router.get('/:id/usuariosRegistrados', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id && req.session.usuario.esAdmin == 1) {
		res.render('usuariosRegistrados', {
			sesionUsuario:req.session.usuario,
			categoriaActiva: null,
			url:req.originalUrl
		});
	} else {
		res.redirect('/');
	};
});

router.get('/tablaUsuarios/:id/:desde/:hasta', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id && req.session.usuario.esAdmin == 1) {
		dbUsuario.getUsuariosPorFecha(req.params.desde, req.params.hasta, function(error, resultado){
			if (error) {
				var errorHTML = '<div class="col-md-12">' +
		           	'<div class="alert alert-danger"><span>Hubo un error al conectarse a la base de datos, por favor intente más tarde</span></div>' +
		            '</div>';
				res.send(errorHTML);
			} else {
				if (resultado.length > 0) {
					var tablaHtml = '<div class="col-md-12" style="margin-bottom:2em;">' +
			           	'<table><th>Nombre de Usuario</th><th>Nombre</th><th>Apellido</th><th>E-Mail</th><th>Fecha de Registro</th>';
			        for (var i = 0; i < resultado.length; i++) {
			        	tablaHtml += '<tr><td>' + resultado[i].nombreUsuario + '</td>' +
			        		'<td>' + resultado[i].nombre + '</td>' +
			        		'<td>' + resultado[i].apellido + '</td>' +
			        		'<td>' + resultado[i].mail + '</td>' +
			        		'<td>' + fechaFormatoLocal(resultado[i].fechaRegistro) + '</td></tr>';
			        };
			        tablaHtml += '</table></div>'
			        res.send(tablaHtml);
				} else {
					var errorHTML = '<div class="col-md-12">' +
			           	'<div class="alert alert-warning"><span>No hay usuarios registrados entre esas fechas</span></div>' +
			            '</div>';
					res.send(errorHTML);
				};
				
			}
		});
	} else {
		res.redirect('/');
	}
});

router.get('/:id/pubsConcretadas', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id && req.session.usuario.esAdmin == 1) {
		res.render('pubsConcretadas', {
			sesionUsuario:req.session.usuario,
			categoriaActiva: null,
			url:req.originalUrl
		});
	} else {
		res.redirect('/');
	};
});

router.get('/tablaPublicaciones/:id/:desde/:hasta', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.id && req.session.usuario.esAdmin == 1) {
		dbPublicacion.getPublicacionesPorFechaPago(req.params.desde, req.params.hasta, function(error, pubsConPublicador, pubsConGanador){
			if (error) {
				var errorHTML = '<div class="col-md-12">' +
		           	'<div class="alert alert-danger"><span>Hubo un error al conectarse a la base de datos, por favor intente más tarde</span></div>' +
		            '</div>';
				res.send(errorHTML);
			} else {
				if (pubsConPublicador.length > 0) {
					var tablaHtml = '<div class="col-md-12" style="margin-bottom:2em;">' +
			           	'<table><th>Titulo</th><th>Publicador</th><th>Ganador</th><th>Fecha de Pago</th><th>Ganancias</th>';
			        for (var i = 0; i < pubsConPublicador.length; i++) {
			        	tablaHtml += '<tr><td><a href="/publicacion/' + pubsConPublicador[i].idPublicacion +
			        		'">' + pubsConPublicador[i].titulo + '</a></td>' +
			        		'<td>' + pubsConPublicador[i].nombreUsuario + '</td>' +
			        		'<td>' + pubsConGanador[i].nombreUsuario + '</td>' +
			        		'<td>' + fechaFormatoLocal(pubsConPublicador[i].fechaPago) + '</td>';
			        	if (pubsConPublicador[i].idUsuario == 1) { /*es el administrador*/
			        		tablaHtml += '<td>' + pubsConGanador[i].monto + '</td></tr>';
			        	} else {
			        		tablaHtml += '<td>' + (pubsConGanador[i].monto * 0.3) + '</td></tr>';
			        	};
			        };
			        tablaHtml += '</table></div>'
			        res.send(tablaHtml);
				} else {
					var errorHTML = '<div class="col-md-12">' +
			           	'<div class="alert alert-warning"><span>No se concretaron publicaciones entre esas fechas</span></div>' +
			            '</div>';
					res.send(errorHTML);
				};
				
			}
		});
	} else {
		res.redirect('/');
	}
});

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
						res.render('perfil', {
							sesionUsuario: req.session.usuario,
							categoriaActiva: null,
							url:req.originalUrl,
							usuarioExistente: true,
							passwordIncorrecta: false,
							passwordCambiada: false,
							datosCambiados: false,
							nombreUsuario: req.body.nombreUsuario,
							nombre: req.body.nombre,
							apellido: req.body.apellido,
							mail: req.body.mail
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
								res.render('perfil', {
									sesionUsuario: req.session.usuario,
									categoriaActiva: null,
									url:req.originalUrl,
									usuarioExistente: false,
									passwordIncorrecta: false,
									passwordCambiada: false,
									datosCambiados: true,
									nombreUsuario: '',
									nombre: '',
									apellido: '',
									mail: ''
								});
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
					res.render('perfil', {
						sesionUsuario: req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl,
						usuarioExistente: false,
						passwordIncorrecta: false,
						passwordCambiada: false,
						datosCambiados: true,
						nombreUsuario: '',
						nombre: '',
						apellido: '',
						mail: ''
					});
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
			res.render('perfil', {
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl,
				usuarioExistente: false,
				passwordIncorrecta: true,
				passwordCambiada: false,
				datosCambiados: false,
				nombreUsuario: '',
				nombre: '',
				apellido: '',
				mail: ''
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
					res.render('perfil', {
						sesionUsuario: req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl,
						usuarioExistente: false,
						passwordIncorrecta: false,
						passwordCambiada: true,
						datosCambiados: false,
						nombreUsuario: '',
						nombre: '',
						apellido: '',
						mail: ''
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
			req.session.usuario.foto = req.files.pic.path.substring(6,req.files.pic.path.length).replace(/\\/g,'/');
		    dbUsuario.modificarUsuario(req.params.id, { foto:req.session.usuario.foto }, function(error, resultado){
		    	if (error) {
		    		res.render('error', {
						mensaje:'Hubo un error al actualizar su foto de perfil, por favor intente de nuevo',
						sesionUsuario:req.session.usuario,
						categoriaActiva: null,
						url:req.originalUrl,
					});
		    	} else {
		    		res.redirect('/perfil/' + req.params.id);
		    	};
		    });
		} else {
			res.redirect('/perfil/' + req.params.id);
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
						//Le doy formato local a la fecha
						req.session.usuario.fechaRegistro = fechaFormatoLocal(req.session.usuario.fechaRegistro);
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
				//Le doy formato local a la fecha
				req.session.usuario.fechaRegistro = fechaFormatoLocal(req.session.usuario.fechaRegistro);
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

router.get('/yaOferto/:idPublicacion/:idUsuario', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.idUsuario) {
		dbOferta.getOfertasDeUsuarioParaPublicacion(req.session.usuario.idUsuario, req.params.idPublicacion, function(errorO, resultadoO){
			if (errorO) {
				res.send('bdError');
			} else {
				res.send(typeof resultadoO !== 'undefined' && resultadoO.length > 0);
			};
		});
	} else {
		res.send('sessionError');
	}
});

router.post('/ofertar/:idPublicacion/:idUsuario', function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.idUsuario) {

		//Cargar oferta en la bd
		var oferta = {
			texto: req.body.textoOferta,
			monto: req.body.montoOfrecido,
			idPublicacion: req.params.idPublicacion,
			idUsuario: req.params.idUsuario
		};
		dbOferta.insertarOferta(oferta, function(error, resultado){
			if (error) {
				res.render('error', {
					mensaje:'Hubo un error al ingresar su oferta, por favor intente de nuevo',
					sesionUsuario: req.session.usuario,
					categoriaActiva: null,
					url:req.originalUrl
				});
			} else {
				//Redireccionar a la pagina de la publicacion actual
				res.redirect('/publicacion/' + req.params.idPublicacion);
			};
		});
	} else {
		res.redirect('/');
	};
});

router.get('/:id/publicar', function(req,res,next){
	if (req.session.usuario != null){
	dbCategoria.getCategorias(function(error,resultado){
		if (error){
			res.render('error', {
				mensaje:'No hay categorias disponibles para publicar un producto, por favor intente más tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		} else {
			res.render('publicar', {
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl,
				usuarioExistente: false,
				passwordIncorrecta: false,
				passwordCambiada: false,
				datosCambiados: false,
				nombreUsuario: '',
				nombre: '',
				apellido: '',
				mail: '',
				categorias:resultado,
			});
		}
	});
	} else {
		res.redirect('/');
	}
});

router.post('/publicarProducto',[ multer({ dest: './public/imagenes/'}), function(req,res,next){
	var publicacion = {
			titulo:req.body.nombreProducto,
			descripcion:req.body.descripcion,
			idCategoria:req.body.categoriaElegida,
			foto:req.files.pic.path.substring(6,req.files.pic.path.length).replace(/\\/g,'/'),
			idUsuario:req.session.usuario.idUsuario,
			duracion:req.body.duracion
		};
	dbPublicacion.insertar(publicacion, function(error,respuesta){
		if (error) {
			res.render('error', {
				mensaje:'Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		} else{
			res.redirect('/publicacion/' + respuesta.insertId)
		}
	});

}]);

router.post('/preguntar/:idPublicacion/:idUsuario', function(req,res,next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.idUsuario) {
		var pregunta = {
			texto: req.body.textoPregunta,
			idUsuario: req.params.idUsuario,
			idPublicacion: req.params.idPublicacion
		};
		dbPregunta.insertarPregunta(pregunta, function(error,respuesta){
			if (error) {
				res.render('error', {
					mensaje:'Hubo un error al ingresar su pregunta, por favor intente de nuevo',
					sesionUsuario: req.session.usuario,
					categoriaActiva: null,
					url:req.originalUrl
				});
			} else {
				//Redireccionar a la pagina de la publicacion actual
				res.redirect('/publicacion/' + req.params.idPublicacion);
			};
		});
	} else {
		res.redirect('/');
	};
});

	
router.post('/responder/:idPublicacion', function(req, res, next){
	dbRespuesta.insertarRespuesta(req.body.idPregunta, req.body.textoRespuesta, function(error, respuesta){
		if (error) {
			res.render('error', {
				mensaje:'Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		} else {
			res.redirect('/publicacion/' + req.params.idPublicacion);
		};
	});
});

router.post('/eliminarRespuesta', function(req,res,next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.body.idUsuario) {
		dbRespuesta.eliminarRespuesta(req.body.idPregunta, req.body.idRespuesta, function(error, respuesta){
			if (error) {
						res.render('error', {
							mensaje:'Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde',
							sesionUsuario: req.session.usuario,
							categoriaActiva: null,
							url:req.originalUrl
						});
					} else {
						res.redirect('/publicacion/' + req.body.idPublicacion);
					};
		});
	} else {
		res.redirect('/');
	}
});

router.get('/pagar/:idOfertaGanadora/:idPublicacion', function(req, res, next){
	if (req.session.usuario != null) {
		dbPublicacion.getPublicacionConOfertaGanadora(req.params.idPublicacion, function(error, resultado){
			if (error) {
				res.render('error', {
					mensaje:'Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde',
					sesionUsuario: req.session.usuario,
					categoriaActiva: null,
					url:req.originalUrl
				});
			} else {
				//Me tengo que fijar si esa publicacion tiene una oferta ganadora y si es la misma que la que quiero pagar
				if (resultado.length > 0 && resultado[0].idOfertaGanadora == req.params.idOfertaGanadora && !resultado[0].pagada){
					//Ahora tengo que saber si el usuario que quiere pagar es de verdad el que gano
					dbOferta.getOfertaByID(resultado[0].idOfertaGanadora, function(errorO, resultadoO){
						if (errorO) {
							res.render('error', {
								mensaje:'Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde',
								sesionUsuario: req.session.usuario,
								categoriaActiva: null,
								url:req.originalUrl
							});
						} else {
							if (resultadoO[0].idUsuario == req.session.usuario.idUsuario) {
								res.render('pagarProducto', {
									sesionUsuario: req.session.usuario,
									categoriaActiva: null,
									url:req.originalUrl,
									tarjetaVencida: false,
									tarjeta: '',
									vencimiento: '',
									publicacionYOferta: resultado[0]
								});
							} else {
								res.render('error', {
									mensaje:'Parece que usted no ha ganado esta subasta, siga ofertando :)',
									sesionUsuario: req.session.usuario,
									categoriaActiva: null,
									url:req.originalUrl
								});
							};
						};
					});
				} else {
					res.redirect('/');
				};
			};
		});
	} else {
		res.redirect('/');
	};
});

router.post('/pagarProducto/:idPublicacion', function(req, res, next){
	var hoy = new Date();
	var arregloFecha = req.body.vencimiento.split('-');
	var vencimiento = new Date(arregloFecha[0], arregloFecha[1], arregloFecha[2]);
	dbPublicacion.getPublicacionConOfertaGanadora(req.params.idPublicacion, function(error, resultado){
		if (error) {
			res.render('error', {
				mensaje:'Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		} else {
			if (vencimiento < hoy) {
				res.render('pagarProducto', {
					sesionUsuario: req.session.usuario,
					categoriaActiva: null,
					url:req.originalUrl,
					tarjetaVencida: true,
					tarjeta: req.body.tarjeta,
					vencimiento: req.body.vencimiento,
					publicacionYOferta: resultado[0]
				});
			} else {
				dbPublicacion.getPublicacionByID(req.params.idPublicacion, function(errorPub, resultadoPub){
					if (errorPub) {
						res.render('error', {
							mensaje:'Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde',
							sesionUsuario: req.session.usuario,
							categoriaActiva: null,
							url:req.originalUrl
						});
					} else {
						var datosPublicador = {
							monto: resultado[0].monto * 0.7,
							id: resultadoPub.idUsuario
						}
						var datosAdmin = {
							monto: resultado[0].monto * 0.3,
							id: 1
						}
						dbUsuario.pagar(datosPublicador, datosAdmin, function(errorP, resultadoP){
							if (errorP) {
								res.render('error', {
									mensaje:'Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde',
									sesionUsuario: req.session.usuario,
									categoriaActiva: null,
									url:req.originalUrl
								});
							} else {
								dbPublicacion.setPublicacionPagada(resultadoPub.idPublicacion, function(errorPagar, resultadoPagar){
									if (errorPagar) {
										//Paga la guita y no actualiza la publicacion, pero me cago ya fue
										res.render('error', {
											mensaje:'Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde',
											sesionUsuario: req.session.usuario,
											categoriaActiva: null,
											url:req.originalUrl
										});
									} else {
										dbUsuario.getUsuarioByID(resultadoPub.idUsuario, function(errorU, resultadoU){
											if (errorU) {
												res.render('error', {
													mensaje:'Su producto ha sido pagado, sin embargo, ha ocurrido un error al buscar los datos del publicador, busque en la publicación para verlos',
													sesionUsuario: req.session.usuario,
													categoriaActiva: null,
													url:req.originalUrl
												});
											} else {
												res.render('pagado', {
													sesionUsuario: req.session.usuario,
													categoriaActiva: null,
													url:req.originalUrl,
													pago: true,
													nombreUsuario: resultadoU[0].nombreUsuario,
													mail: resultadoU[0].mail
												});
											};
										});
									};
								});
							};
						});
					};
				});
			};
		};
	});
});

router.post('/ofertaGanadora',function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.body.idUsuarioPublicador) {
		dbPublicacion.setOfertaGanadora(req.body.idOfertaGanadora, req.body.idPublicacion, function(error){
			if (error){
				res.render('error', {
						mensaje:'Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde',
						sesionUsuario: req.session.usuario,
						url:req.originalUrl
					});
			}
			else{
				res.redirect('/publicacion/' + req.body.idPublicacion);
			}
		})
	}else{
		res.redirect('/publicacion/' + req.body.idPublicacion);
	}
});

router.get('/datosPublicador/:idPublicacion', function(req, res, next){
	if (req.session.usuario != null) {
		dbPublicacion.getPublicacionByID(req.params.idPublicacion, function(error, resultado){
			if (error) {
				res.render('error', {
					mensaje:'Ha ocurrido un error al conectarse a la base de datos, por favor intente más tarde',
					sesionUsuario: req.session.usuario,
					categoriaActiva: null,
					url:req.originalUrl
				});
			} else if (typeof(resultado) != 'undefined') {
				dbOferta.getOfertaByID(resultado.idOfertaGanadora, function(errorO, resultadoO){
					if (errorO) {
						res.render('error', {
							mensaje:'Ha ocurrido un error al conectarse a la base de datos, por favor intente más tarde',
							sesionUsuario: req.session.usuario,
							categoriaActiva: null,
							url:req.originalUrl
						});
					} else {
						if (resultadoO[0].idUsuario == req.session.usuario.idUsuario) {
							dbUsuario.getUsuarioByID(resultado.idUsuario, function(errorU, resultadoU){
								if (errorU) {
									res.render('error', {
										mensaje:'Ha ocurrido un error al conectarse a la base de datos, por favor intente más tarde',
										sesionUsuario: req.session.usuario,
										categoriaActiva: null,
										url:req.originalUrl
									});
								} else {
									res.render('pagado', {
										sesionUsuario: req.session.usuario,
										categoriaActiva: null,
										url:req.originalUrl,
										pago: false,
										nombreUsuario: resultadoU[0].nombreUsuario,
										mail: resultadoU[0].mail
									});
								};
							});
						} else {
							res.redirect('/');
						};
					};
				});
			} else {
				res.redirect('/');
			};
		});
	} else {
		res.redirect('/');
	};
});


router.post('/datosGanador/:idOfertaGanadora', function(req, res, next){
	if (req.session.usuario != req.body.idPublicador) {
		dbOferta.getUsuarioDeOfertaConId(req.params.idOfertaGanadora, function(error, resultado){
			if(error){
				res.send("<p>Hubo un error al intentar acceder a la base de datos, por favor intente de nuevo mas tarde <p>")
			}
			else{
				var html =''
				html += '<div class="jumbotron text-center">';
				html += 	'<h2>Datos de contacto del publicador:</h2>';
				html +=		"<p>Nombre de Usuario: <b>" + resultado.nombreUsuario + "</b></p>";
				//html += 	"<p>Usuario: <b>" + resultado.nombre +"</b></p>";
				//html += 	"<p>Apellido: <b>" + resultado.apellido +"</b></p>";
				html += 	"<p>Mail: <b>" + resultado.mail +"</b></p>";
				html += '</div>'
				res.send(html);
			}
		});
	}
});

router.get('/:idPublicacion/modificarPublicacion', function(req,res,next){
	if (req.session.usuario != null) {
		dbPublicacion.getPublicacionByID(req.params.idPublicacion, function(error, resultadoP){
			if (error){
				res.render('error', {
					mensaje:'Hubo un error al cargar los datos de su publicacion, por favor intente más tarde',
					sesionUsuario: req.session.usuario,
					categoriaActiva: null,
					url:req.originalUrl
				});
			} else {
				dbCategoria.getCategorias(function(error,resultadoC){
					if (error){
						res.render('error', {
							mensaje:'No hay categorias disponibles para asignar al producto, por favor intente más tarde',
							sesionUsuario: req.session.usuario,
							categoriaActiva: null,
							url:req.originalUrl
						});
					} else {
						res.render('modificarPublicacion', {
							sesionUsuario: req.session.usuario,
							categoriaActiva: null,
							url:req.originalUrl,
							usuarioExistente: false,
							passwordIncorrecta: false,
							passwordCambiada: false,
							datosCambiados: false,
							nombreUsuario: '',
							nombre: '',
							apellido: '',
							mail: '',
							categorias:resultadoC,
							datosPublicacion: resultadoP
						});
					}
				});
			}
		});
	} else {
		res.redirect('/');
	}
});

router.post('/modificarPublicacion/:idUsuario/:idPublicacion',[ multer({ dest: './public/imagenes/'}), function(req,res,next){
	
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.idUsuario){
		var datosNuevos={
			titulo:reemplazar(req.body.nombreProducto),
			descripcion:reemplazar(req.body.descripcion),
			idCategoria:req.body.categoriaElegida,
		}
		if (req.files.pic != undefined) {
			datosNuevos.foto = req.files.pic.path.substring(6,req.files.pic.path.length).replace(/\\/g,'/');
		} else {
			datosNuevos.foto = req.body.urlVieja;
		}
		dbPublicacion.modificarPublicacion(datosNuevos, req.params.idPublicacion, function(error,resultado){
			if (error){
				res.render('error', {
					mensaje:'Hubo un error al cargar los datos nuevos, por favor intente más tarde',
					sesionUsuario: req.session.usuario,
					categoriaActiva: null,
					url:req.originalUrl
				});
			} else {
				res.redirect('/publicacion/' + req.params.idPublicacion);
			}
		});
	} else {
		res.redirect('/');
	}
}]);

router.get('/recuperarPassword', function(req, res, next){
	if (req.session.usuario != null) {
		res.redirect('/');
	} else {
		res.render('recuperarPassword', {
			noCoincide: false,
			nombreUsuario: '',
			mail: '',
			categoriaActiva: null,
			url:req.originalUrl
		});
	};
});

router.post('/recuperarPassword', function(req, res, next){
	var datos = {
		nombreUsuario: req.body.nombreUsuario,
		mail: req.body.mail
	};
	dbUsuario.resetPassword(datos, function(error, resultado){
		if (error) {
			res.render('error', {
				mensaje:'Hubo un error al conectarse a la base de datos, por favor intente más tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		} else {
			if (resultado.affectedRows == 1) {
				res.render('passRecuperada', {
					mail: datos.mail,
					categoriaActiva: null,
					url:req.originalUrl
				});
			} else {
				res.render('recuperarPassword', {
					noCoincide: true,
					nombreUsuario: datos.nombreUsuario,
					mail: datos.mail,
					categoriaActiva: null,
					url:req.originalUrl
				});
			};
		};
	});
});


router.post('/eliminarPublicacion/:idPublicacion', function(req, res, next){
	dbPublicacion.borrarPublicacionConId(req.params.idPublicacion, function(error){
		if (error) {
			res.render('error', {
				mensaje:'Hubo un error al conectarse a la base de datos, por favor intente más tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		}
		else{
			req.session.publicacionEliminada = true;
			res.redirect('/perfil/' + req.session.usuario.idUsuario);
		}
	});
});

router.post('/eliminarCuenta/:idUsuario', function(req, res, next){
	if(req.session.usuario != null && req.session.usuario.idUsuario == req.params.idUsuario){
		dbUsuario.eliminarCuenta(req.session.usuario.idUsuario, function(error, puedeBorrar){
			if (error) {
				res.render('error', {
					mensaje:'Hubo un error al conectarse a la base de datos, por favor intente más tarde',
					sesionUsuario: req.session.usuario,
					categoriaActiva: null,
					url:req.originalUrl
				});
			}
			else{
				if (puedeBorrar == 0) {
					res.redirect('/cerrarSesion');
				}
				else{
					req.session.puedeBorrar = puedeBorrar;
					res.redirect('/perfil/' + req.session.usuario.idUsuario)			
				}
			}
		});
	}
});

router.get('/eliminarPregunta/:idUsuario/:idPublicacion/:idPregunta', function(req,res,next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.idUsuario){
		dbPregunta.eliminarPregunta(req.params.idUsuario,req.params.idPregunta, function(error){
			if (error){
				res.render('error', {
				mensaje:'Hubo un error al conectarse a la base de datos, por favor intente más tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
			} else {
				res.redirect('/publicacion/' + req.params.idPublicacion);
			}
		});
	} else {
		res.redirect('/');
	}
});

router.get('/eliminarOferta/:idUsuario/:idPublicacion/:idOferta', function(req,res,next){
	if (req.session.usuario != null && req.session.usuario.idUsuario == req.params.idUsuario){
		dbOferta.eliminarOferta(req.params.idUsuario,req.params.idOferta, function(error){
			if (error){
				res.render('error', {
				mensaje:'Hubo un error al conectarse a la base de datos, por favor intente más tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
			} else {
				res.redirect('/publicacion/' + req.params.idPublicacion);
			}
		});
	} else {
		res.redirect('/');
	}
});

router.get('/usuarios',function(req, res, next){
	if (req.session.usuario != null && req.session.usuario.esAdmin == true){
		dbUsuario.getUsarios(function(error, resultado){
			if (error){
				res.render('error', {
				mensaje:'Hubo un error al conectarse a la base de datos, por favor intente más tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
			} else {
				var nuevoAdmin = req.session.nuevoAdmin;
				var adminEliminado = req.session.adminEliminado;
				req.session.adminEliminado = null;
				req.session.nuevoAdmin = null;
				res.render('listaUsuarios', {
					sesionUsuario: req.session.usuario,
					url:req.originalUrl,
					usuarios: resultado,
					nuevoAdmin: nuevoAdmin,
					adminEliminado: adminEliminado
				});
			}
		})
	}
	else {
		res.redirect('/');
	}
});


router.post('/hacerAdmin', function(req, res, next){
	dbUsuario.setAdminAUsuario(req.body.idNuevoAdmin, function(error){
		if (error) {
			res.render('error', {
				mensaje:'Hubo un error al conectarse a la base de datos, por favor intente más tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		}
		else{
			req.session.nuevoAdmin = true;
			res.redirect('/usuarios');
		}
	});
});

router.post('/sacarAdmin', function(req, res, next){
	dbUsuario.setNoAdminAUsuario(req.body.idAdminEliminar, function(error){
		if (error) {
			res.render('error', {
				mensaje:'Hubo un error al conectarse a la base de datos, por favor intente más tarde',
				sesionUsuario: req.session.usuario,
				categoriaActiva: null,
				url:req.originalUrl
			});
		}
		else{
			req.session.adminEliminado = true;
			res.redirect('/usuarios');
		}
	});
});


module.exports = router;



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//para usar sesiones
var session = require('express-session');
 
var routes = require('./routes/index');
var users = require('./routes/users');
//necesario para utilizar los verbos put y delete en formularios
var methodOverride = require('method-override');
 
var app = express();


//configuración para ejs , ejs es como jade, es decir puede recibir informacion y mostrarla , pero se escribe ihual q html , por ejemplo si no hay q mostrar nada adentro del archivo .ejs esta todo como si fuera html normal

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*SI USAMOS ESTA CONFIGURACION PODEMOS MANDAR DIRECTAMENTE Q RENDERICE UN .HTML PERO PUDIENDO USAR EJS, LA VERDAD ME PARECE LO MISMO
app.set('views', path.join(__dirname, 'views'));
app.engine("html", require("ejs").renderFile);
app.set('view engine', 'html');
 */




// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//configuracion de sesiones, frase secreta aleatoria
app.use(session({secret: 'sssshhhh'}));

//configuramos methodOverride, no entiendo q hace
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
 
app.use('/', routes);
app.use('/users', users);
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
 
// error handlers
 
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
 
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
 
module.exports = app;
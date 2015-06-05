var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) { 
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});
app.use(session({ secret:'secretirijillo' }));

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
        res.render('errorDebug', {
            message: err.message,
            error: err
        });
    });
}
 
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('errorDebug', {
        message: err.message,
        error: {}
    });
});

/*
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var sesionUsuario = null
    if (req.session.hasOwnProperty('usuario')){
      sesionUsuario = req.session.usuario;
    }
    res.status(err.status || 500);
    res.render('error', {
      mensaje : "Error 404: no se encontro la pagina :'(",
      sesionUsuario:sesionUsuario
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var sesionUsuario = null
  if (req.session.hasOwnProperty('usuario')){
    sesionUsuario = req.session.usuario;
  }
  res.status(err.status || 500);
  res.render('error', {
    mensaje : "Error 404: no se encontro la pagina :'(",
    sesionUsuario:sesionUsuario
  });
});
*/

module.exports = app;

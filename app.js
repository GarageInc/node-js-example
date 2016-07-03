var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log = require('libs/log')(module);
var http = require('http');
var morgan = require('morgan');
var config = require('config');
var HttpError = require('error').HttpError;

var app = express();


//  engine setup
app.engine('ejs', require('ejs-locals'))
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

var User = require('models/user').User
app.get('/users', function(req,res,next){
  User.find({}, function(err,users){
    if(err) next(err);

    res.json(users)
  })
})
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (app.get('env') == 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('common'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('middleware/sendHttpError'));
require('routes')(app);
//app.use('/', routes);



app.use(function(err, req, res, next) {
  if (typeof err == 'number') { // next(404);
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      express.errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});


http.createServer(app).listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});

module.exports = app;

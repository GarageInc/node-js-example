var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log = require('./libs/log')(module);
var http = require('http');
var morgan = require('morgan');
var config = require('./config');
var HttpError = require('./error').HttpError;
var session = require('express-session')
var errorHandler = require('errorhandler')

var app = express();

/*
  WEBPACK
 */


(function initWebpack() {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack/common.config');
  const compiler = webpack( webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));

})();



//  engine setup
app.engine('ejs', require('ejs-locals'))
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

var User = require('./models/user').User
app.get('/users', function(req,res,next){
  User.find({}, function(err,users){
    if(err)
      next(err);

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

var sessionStore = require('./libs/sessionStore');

app.use(session({
  secret: config.get('session:secret'), // ABCDE242342342314123421.SHA256
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: sessionStore
}))


app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

require('./routes')(app);


app.use(function(err, req, res, next) {
  if (typeof err == 'number') { // next(404);
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});


/*
  DEV_SERVER
 */

var server = http.createServer( app)

app.listen(process.env.PORT || config.get('port'), '127.0.0.1', err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening ...');
});

var io = require('./socket')( server);
app.set('io', io);

module.exports = app;

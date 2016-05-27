const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const env = process.env.NODE_ENV || 'development';

const routes = require('./app/routes/routes');

const app = express();

// Configure Nunjucks
if (env === 'production') {
  nunjucks.configure(['app/views'], {
    autoescape: true,
    express: app,
    noCache: false});
} else {
  nunjucks.configure(['app/views'], {
    autoescape: true,
    express: app,
    noCache: true
  });
}

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.active = {};

  if (req.originalUrl === '/patches/' || req.originalUrl === '/patches') {
    res.locals.active.patches = 'active';
  } else if (req.originalUrl === '/stickers/' || req.originalUrl === '/stickers') {
    res.locals.active.stickers = 'active';
  }

  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
    console.log(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promorouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var Dishes = require('./models/dishes');  
var favouriteRouter = require('./routes/favouriteRouter');
var  commentRouter = require('./routes/commentRouter');

var app = express();

// app.all('*', (req,res,next)=>{
//   if(req.secure){
//     return next();
//   }
//   else {
//     res.redirect(307,'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//   }
// })

const url = config.mongoUrl;
const connect = mongoose.connect(url, {useNewUrlParser : true, useUnifiedTopology : true});

connect.then((db)=>{
  console.log('Sucessfully Connected to the server');
}, (err) =>{
  console.log(err);
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('$1234'));

app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../my-app/build'))
}


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favouriteRouter);
app.use('/comments',commentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

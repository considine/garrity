var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var index = require('./routes/index');
var users = require('./routes/users');
var crypto = require ('crypto');
var mime = require ('mime');
var mongoose = require('mongoose');
var app = express();
var imageDimens =  require('./models/cover-image');


mongoose.connect ('mongodb://localhost/garrity', function (err) {
  if (!err) {
    console.log('connected fine!');
  }
  else {
    console.log ('Could not connect');
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
var upload = multer({ 
	storage: storage,
	dest : './uploads'
	 });

// var upload = multer({ dest: './uploads/' })


app.post('/upl', multer(upload).single('upl'), function(req,res){
	console.log(req.body); //form fields
	/* example output:
	{ title: 'abc' }
	 */
	console.log(req.file); //form files
	 res.render("adminpanel-image", {imgsrc: req.file.filename});
});


app.post('/saveimg', function(req, res) {
  // console.log(req.body.img);
  console.log(req.body)
  new imageDimens(req.body).save(function (e, req) {
    console.log(e);
    if (e==null)
      res.send('item saved');
    else res.send("error");
  });
  
});


app.use(express.static('uploads'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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


app.listen(8000, function () {
  console.log('Example app listening on port 3000!')
})
module.exports = app;

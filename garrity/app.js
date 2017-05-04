var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var crypto = require ('crypto');
var content  = require('./models/blog-post');
var mime = require ('mime');
var mongoose = require('mongoose');
var passwordChecker = require("./app/utils/getpassword");
var imageDimens =  require('./models/cover-image');
var styler = require('./app/utils/styler');
var app = express();
var session =  require('express-session');
var adminLogin = require('./models/admin-login');
var podcast = require('./models/podcast');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: '2C44-4D44-sdfklsdfj',
    resave: true,
    saveUninitialized: true
}));

app.get('/home', function (req, res) {
  content.blog.find({"published" : true}).populate('imageId').sort({'time': -1}).limit(5).exec(function (err, posts) {
    if (err) res.send(500, err);
    content.article.find({frontpageStatus : {$gte : 0} }).sort("frontpageStatus").limit(10).populate('imageId').exec(function (err, article) {
       if (err) res.send(500, err);
       podcast.find({}, function (err, podcast) {
           if (err) res.send(500, err);
          res.render("home", {"posts" : posts, "articles" : article, p : podcast});
       });
       
    }); 
  });


  
});



app.get('/featuredImage/:id', function (req, res) {
  var id = req.params.id;
  imageDimens.findOne({ _id : req.params.id}).exec(function (err, featuredImage) {
    res.send(featuredImage);

  });
});


app.get('/blog/:id', function (req, res) {
  // todo: IF SESSION
  var admin = false;
  if (true) var admin = true; 
  res.render('single-post', {postid : req.params.id, admin : admin, contype : "blog"});
  
});
app.get("/blogcontent/:id", function (req, res){
  content.blog.findOne({_id : req.params.id}).exec(function (err, post) {
   res.send(post);
  });
});
// todo clean up
app.get('/story/:id', function (req, res) {
  // todo: IF SESSION
  var admin = false;
  if (true) var admin = true; 
  res.render('single-post', {postid : req.params.id, admin : admin, contype : "story"});
  
});

app.get('/page/:id', function (req, res) {
  var admin = false;
  if (true) var admin = true;
  res.render('single-post', {postid : req.params.id, admin : admin, contype : "page"})
});

app.get("/storycontent/:id", function (req, res){
  content.article.findOne({_id : req.params.id}).exec(function (err, post) {
   res.send(post);
  });
});
app.get("/pagecontent/:id", function (req, res){
  content.page.findOne({_id : req.params.id}).exec(function (err, post) {
   res.send(post);
  });
});










 var auth = function(req, res, next) {
  return next();
  if (req.session && req.session.user)
    return next();
  else
    return res.sendStatus(401);
};
var bouncer = require ("express-bouncer")(500, 900000);
// Add white-listed addresses (optional)
// bouncer.whitelist.push ("127.0.0.1");
bouncer.blocked = function (req, res, next, remaining)
{
  res.send (429, "Too many requests have been made, " +
    "please wait " + remaining / 1000 + " seconds");
};
app.get('/admin/login', function (req, res) {
  if (req.session.user) {
    res.redirect('/admin/new-post');
    return;
  }
  res.render('admin/login');
});


app.post ("/admin/loginAttempt", bouncer.block, function (req, res)
{

  function cb (resp) {
    if (!resp) {
      res.send(401, "No Auth");
      return;
    }
    bouncer.reset (req);
    req.session.user = req.body.user;
    res.send({login : "Success"});
  }

  passwordChecker.checkPassword(req.body.user, req.body.password, cb);
  // passwordChecker.addUser(req.body.0user, req.body.password);
});

app.post ("/admin/updateCredentials", bouncer.block, function (req, res) {
  function cb (resp){ 
    if (!resp) {
      res.send(401, "No auth");
    return}
    passwordChecker.savePassword(req.body.user, req.body.newPassword, cb);
    res.send("success!");
    bouncer.reset (req);
  }
  passwordChecker.checkPassword(req.body.user, req.body.password, cb);
});

app.use('/admin', auth, index);
app.use('/users', users);
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // set locales, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
module.exports = app;

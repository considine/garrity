var express = require('express');
var crypto = require ('crypto');
var mime = require ('mime');
var mongoose = require('mongoose');
var imageDimens =  require('../models/cover-image');
var blogPost =  require('../models/blog-post');
var multer = require('multer');

var blogmailer = require('../app/utils/send-mail');
var router = express.Router();
var fs = require('fs');
mongoose.connect ('mongodb://localhost/garrity', function (err) {
  if (!err) {
    console.log('connected fine!');
  }
  else {
    console.log ('Could not connect');
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/adminpanel', { title: 'Express' });
});



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


router.post('/upl', multer(upload).single('upl'), function(req,res){
	console.log(req.body); //form fields
	/* example output:
	{ title: 'abc' }
	 */
	console.log(req.file); //form files
	 res.render("admin/adminpanel-image", {imgsrc: req.file.filename});
});


router.post('/savedataimg', function (req, res) {
  
  var img = req.body.info;
  var responses = [];
  for (var i=0; i< img.length; i++){
    var data = img[i].replace(/^data:image\/\w+;base64,/, "");
   
    var buf = new Buffer(data, 'base64');
    var d = new Date();
    var seconds = d.getTime();
    fs.writeFile(__dirname + '/../public/uploads/emailImages/' + seconds + (i + '-image.png'), buf);
    responses.push(seconds + (i + '-image.png'));
  }
  res.send({data : responses});
});
router.get('/dash/:contentType', function(req, res, next) {



	if (req.params.contentType == "blog_posts") {
    //first get all of the posts 

    blogPost.find (function (err, posts) {
      
      res.render("admin/adminpanel-posts", {"contentType" : "Blog Posts", "posts" : posts});
    });

    
  }
	else if (req.params.contentType == "stories") res.render("admin/adminpanel-posts", {"contentType" : "Stories"});
	else next('route');
});

router.post('/saveimg', function(req, res) {
  // console.log(req.body.img);
  console.log(req.body)
  new imageDimens(req.body).save(function (e, req) {
    console.log(e);
    if (e==null)
      res.send('item saved');
    else res.send("error");
  });
  
});
router.post('/data/blog', function (req, res) {
   function func() {
      var sjson = {};
      sjson["body"] = req.body.text;
      for (var i=0; i<req.body.imgs.length; i++) {
        console.log(req.body.imgs[i]);
        sjson["body"] = sjson["body"].replace(req.body.imgs[i],"http://localhost:8000/uploads/emailImages/" + req.body.imgs[i]);
      }
      sjson["title"] = req.body.subject;
      new blogPost(sjson).save(function (e, req) {
      if (e==null)
        console.log('item saved');
      else console.log("error");
      });
    }
    func();
    // blogmailer.send(req.body, func);
});

router.delete('/data/blog/:id', function (req, res) {
  console.log(req.params.id);
   blogPost.find({ _id : req.params.id }).remove(function (e, req) {

    res.send("deleted");
   });
});

router.get('/data/blog/:id', function (req, res) {
   blogPost.find({ _id : req.params.id }, function (e, blog) {

    res.send(blog)
   });
});


router.get('/new-post', function (req, res) {
  res.render('admin/admin-edit-post', {'edit' : false});
});

router.get('/edit-post/:id', function (req, res) {
  blogPost.findOne({ _id : req.params.id}).exec(function (err, post) {
    res.render('admin/admin-edit-post', {'edit' : true, content : req.params.id});
  });
  // res.render('admin/admin-edit-post', {'edit' : true});
});

router.use(express.static('uploads'));


module.exports = router;

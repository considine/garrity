var express = require('express');
var crypto = require ('crypto');
var mime = require ('mime');
var mongoose = require('mongoose');
var imageDimens =  require('../models/cover-image');
var blogPost =  require('../models/blog-post');
var multer = require('multer');
var styler = require('../app/utils/styler');
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
  res.render('adminpanel', { title: 'Express' });
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
	 res.render("adminpanel-image", {imgsrc: req.file.filename});
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
	if (req.params.contentType == "blog_posts") res.render("adminpanel-posts", {"contentType" : "Blog Posts"});
	else if (req.params.contentType == "stories") res.render("adminpanel-posts", {"contentType" : "Stories"});
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
router.get('/home', function (req, res) {
  imageDimens.findOne({}).exec(function (err, dimens) {
    if (err)  console.log(err);
    res.render('home', {
      mainimg :  "/images/" + dimens.img,
      secondimg1 : "/images/" + dimens.img,
      lgStyle : styler.styleLg(dimens),
      mdStyle : styler.styleMd(dimens),
      smStyle : styler.styleSm(dimens),
      xsStyle : styler.styleXs(dimens),
      secondimg2 : "/images/" + dimens.img


    });
    // 'athletes' contains the list of athletes that match the criteria.
  });
  
});

router.post('/send-blog', function (req, res) {
   
   function func() {
      var sjson = {};
      sjson["body"] = req.body.text;
      for (var i=0; i<req.body.imgs.length; i++) {
        console.log(req.body.imgs[i]);
        sjson["body"] = sjson["body"].replace(req.body.imgs[i],"http://localhost:8000/" + req.body.imgs[i]);
      }
      sjson["title"] = req.body.subject;
      new blogPost(sjson).save(function (e, req) {
      if (e==null)
        console.log('item saved');
      else console.log("error");
      });
    }
    blogmailer.send(req.body, func);
    
  
 
  
});


router.get('/new-post', function (req, res) {
  res.render('admin-edit-post');
});

router.use(express.static('uploads'));


module.exports = router;

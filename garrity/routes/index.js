var express = require('express');
var crypto = require ('crypto');
var mime = require ('mime');
var mongoose = require('mongoose');
var imageDimens =  require('../models/cover-image');
var multer = require('multer');
var styler = require('../app/utils/styler');
var router = express.Router();

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


router.get('/new-post', function (req, res) {
  res.render('admin-edit-post');
});

router.use(express.static('uploads'));


module.exports = router;

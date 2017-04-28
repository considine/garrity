var express = require('express');
var crypto = require ('crypto');
var mime = require ('mime');
var mongoose = require('mongoose');
var imageDimens =  require('../models/cover-image');
var content =  require('../models/blog-post');
var multer = require('multer');
var blogmailer = require('../app/utils/send-mail');
var imageRender = require('../app/utils/dimensconfig');
var configModel = require('../models/imageconfig');


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
    cb(null, './public/uploads/images')
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

	// console.log(req.body); //form fields
	/* example output:
	{ title: 'abc' }
	 */
   res.send({"imgsrc" : req.file.filename, "contentid" : req.body.contentid});
	 
	 
});


router.get('/imgrend', function (req, res) {
  // res.send(JSON.stringify(imageRender.getAll()["html"]));
  res.render('admin/adminpanel-image');
});

router.get('/imgrend/data', function (req, res) { 
  configModel.findOne({configName : "Blog"}, function (err, resp) {
    if (err) return res.send(500, err);
    res.send(resp);
  });
});


router.post('/savedataimg', function (req, res) {
  
  var img = req.body.info;
  var responses = [];
  for (var i=0; i< img.length; i++){
    var thisimg = img[i].replace("<img ", "");
    var data = thisimg.replace(/^data:image\/\w+;base64,/, "");
   
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

    content.blog.find (function (err, posts) {
      
      res.render("admin/adminpanel-posts", {"contentType" : "Blog Posts", "posts" : posts});
    });

    
  }
	else if (req.params.contentType == "stories") res.render("admin/adminpanel-posts", {"contentType" : "Stories"});
	else next('route');
});

router.post('/saveimg', function (req, res) {
  // console.log(req.body.img);
  var config = req.body;
  var css = "";
  for (var cl in config["config"]) {
    if (config["config"].hasOwnProperty(cl)) {
      // console.log(config["classNames"][cl]);
      for (var size  in config["config"][cl]) {
        if (config["config"][cl].hasOwnProperty(size)) {
         
          css += ("@media (min-width: " + config["classNames"][cl]["sizes"][size] + "){" + "\n");
          css += ("\t" + config["classNames"][cl]["class"] + " {\n"); 
          css += ("\t\tbackground-size: " +config["config"][cl][size]["bgWidth"] + ";\n");
          css += ("\t\tbackground-position: " +config["config"][cl][size]["bgPerc"] + ";\n");
          css += ("\t}\n}\n");
        }
      }
    }
  }

  // new imageDimens({"imgname" : config["img"], "css" : css}).save(function(err, img) {
  //   if (err) return res.send(500, err);
  //   res.send("success");
  // });

  imageDimens.findOneAndUpdate({ contentid : config["contentid"]}, {imgname : config["img"], "css" : css, contentid : config["contentid"]}, {upsert : true, new : true}, function(err, img) {
    if (err) res.send(err);
    res.send({ id : img._id});
    console.log(img._id);
  } );
  
  
});





router.post('/data/blog', function (req, res) {
   function func() {
      var sjson = {};
      sjson["text"] = req.body.text;
      sjson["body"] = req.body.body;
      sjson["author"] = req.body.author;

      if (!sjson["text"] || !sjson["body"] || !sjson["author"]) {
        res.send(400, "attributes not set properly")
      }
     
      for (var i=0; i<req.body.imgs.length; i++) {
        
        sjson["body"] = sjson["body"].replace(req.body.imgs[i],"http://localhost:8000/uploads/emailImages/" + req.body.imgs[i]);
        sjson["text"] = sjson["text"].replace(req.body.imgs[i],"http://localhost:8000/uploads/emailImages/" + req.body.imgs[i]);
      }
      sjson["title"] = req.body.subject;
      new content.blog(sjson).save(function (e, req) {
      if (e==null)
        console.log('item saved');
      else console.log("error");
      });
    }
    func();
    // blogmailer.send(req.body, func);
});


router.put('/data/blog/:id', function (req, res) {
  var upd = req.body;
  upd["lastEdited"] = Date.now();
  
  // content.blog.findOneAndUpdate({ _id : req.params.id }, upd, {upsert:true}, function(err, doc){
  //   if (err) return res.send(500, { error: err });

  //   res.send({"success" : true});
    
  // });
  content.blog.findOne({ _id : req.params.id }, function (err, blogpost) {
    blogpost.body = upd.body;
    blogpost.title = upd.title;
    blogpost.featuredImage = upd.featuredImage;
    if (req.body.publish) {
      blogpost.published = true;
       blogpost.upToDate = true;
    }
    //see if change 
    if (blogpost.text == upd.text) {
      // no change

    }
    else {
      console.log("draft");
      blogpost.lastEdited = Date.now();

      blogpost.lastEdited = Date.now();
    }

    blogpost.text = upd.text;
    blogpost.author = upd.author;
    blogpost.imageId = upd.imageId;
    blogpost.save(function (err) {
      if (err) {
        return res.status(500).send({"error" : err});
      }
      return res.send({"success" : true});
    })
  });


 
});



router.delete('/data/blog/:id', function (req, res) {

   content.blog.find({ _id : req.params.id }).remove(function (e, req) {

    res.send("deleted");
   });
});

router.get('/data/blog/:id', function (req, res) {
   content.blog.find({ _id : req.params.id }, function (e, blog) {

    res.send(blog)
   });
});


router.get('/new-post', function (req, res) {
  // res.render('admin/admin-edit-post', {'edit' : false});
   new content.blog({}).save(function (err, blog) {
      res.redirect('/admin/edit-post/' + blog._id);
   });
  // REDIRECT!!!


});

router.get('/edit-post/:id', function (req, res) {
  content.blog.findOne({ _id : req.params.id}).exec(function (err, post) {
    res.render('admin/admin-edit-post', {'edit' : true, content : req.params.id});
  });
  // res.render('admin/admin-edit-post', {'edit' : true});
});

router.use(express.static('uploads'));


module.exports = router;

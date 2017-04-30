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
var storyContent = "story";
var blogContent = "blog";
var pageContent = "page";
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

//todo export
var dataApi = express.Router();
dataApi.get('/' + blogContent, function (req, res) {
  configModel.findOne({configName : "Blog"}, function (err, resp) {
    if (err) return res.send(500, err);
    res.send(resp);
  });
});
dataApi.get('/' + storyContent, function (req, res) {
  configModel.findOne({configName : "Article"}, function (err, resp) {
    if (err) return res.send(500, err);
    res.send(resp);
  });
});

router.use('/imgrend/data', dataApi);



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

// remember to add some sort of limiting
var dash = express.Router();
dash.get('/blog_posts', function (req, res) {
  content.blog.find (function (err, posts) {
      if (err) res.send(500, err);
      res.render("admin/adminpanel-posts", {"contentType" : "Blog Posts", "abbrev" : blogContent, "posts" : posts});
    });
});

dash.get('/stories', function (req, res) {
  content.article.find (function (err, articles) {
      if (err) res.send(500, err);
      res.render("admin/adminpanel-posts", {"contentType" : "Stories", "abbrev" : storyContent, "posts" : articles});
    })
});
dash.get('/pages', function (req, res) {
  content.page.find(function (err, articles) {
    if (err) res.send(500, err);
    res.render("admin/adminpanel-posts", {"contentType" : "Pages", "abbrev" : pageContent, "posts" : articles});
  })
});


router.use ('/dash', dash);

// router.get('/dash/:contentType', function(req, res, next) {



// 	if (req.params.contentType == "blog_posts") {
//     //first get all of the posts
//     content.blog.find (function (err, posts) {
//       if (err) res.send(500, err);
//       res.render("admin/adminpanel-posts", {"contentType" : "Blog Posts", "abbrev" : blogContent, "posts" : posts});
//     });
//   }
//   else if (req.params.contentType == "stories") {
//     content.article.find (function (err, articles) {
//       if (err) res.send(500, err);
//       res.render("admin/adminpanel-posts", {"contentType" : "Stories", "abbrev" : storyContent, "posts" : articles});
//     })
//   }
	
// 	else next('route');
// });

router.post('/saveimg', function (req, res) {
  // console.log(req.body.img);
  var config = req.body;

    var css = "";
    for (var cl in config["config"]) {
      if (config["config"].hasOwnProperty(cl)) {
        // console.log(config["classNames"][cl]);
        for (var size  in config["config"][cl]) {
          if (config["config"][cl].hasOwnProperty(size)) {
           
            css += ("@media (min-width: " + config["classNames"][cl]["sizes"][size] + "){" + "");
            css += ("" + config["classNames"][cl]["class"] + ".c" + config["contentid"] +" {"); 
            css += ("background-size: " +config["config"][cl][size]["bgWidth"] + ";");
            css += ("background-position: " +config["config"][cl][size]["bgPerc"] + ";");
            css += ("}}");
          }
        }
      }
    }
    css = css.replace("\n", "");

  
  // new imageDimens({"imgname" : config["img"], "css" : css}).save(function(err, img) {
  //   if (err) return res.send(500, err);
  //   res.send("success");
  // });

  imageDimens.findOneAndUpdate({ contentid : config["contentid"]}, {imgname : config["img"], "css" : css, contentid : config["contentid"]}, {upsert : true, new : true}, function(err, img) {
    if (err) res.send(err);
    res.send({ id : img._id});

  } );
  
  
});





router.post('/data/:content_type', function (req, res, next) {
  var cont;
  if (req.params.content_type == blogContent) cont = content.blog;
  else if (req.params.content_type == storyContent) cont = content.article;
  else return next("route");
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
      new cont(sjson).save(function (e, req) {
      if (e==null)
        console.log('item saved');
      else console.log("error");
      });
    }
    func();
    // blogmailer.send(req.body, func);
});

function saveContent(cont, req, res, cb) {

 
  cont.findOne({ _id : req.params.id }, function (err, blogpost) {    

    // else {
    //   return res.send({"success" : false});
    // }



    if (blogpost.published) {
      req.body.published = true;
    }
    for (var key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        
        blogpost[key] = req.body[key];
      
      } 
    } 
    if (req.body.published) {
      blogpost.published = true;
       blogpost.upToDate = true;
       
    }

    if (blogpost.text != req.body.text || blogpost.title != req.body.title || blogpost.author != req.body.author || blogpost.imageId != req.body.imageId) {
      blogpost.lastEdited = Date.now();
     
    }
    else if (req.body.published && !blogpost.upToDate) {
      req.body.upToDate = true;
    }

    blogpost.save(function (err) {
      if (err) {
        return res.status(500).send({"error" : err});
      }
      console.log("Called 1");
      return res.send({"success" : true});
      cb();
    })
  });
}

function setBump (fp, paramsId) {
  console.log("called2");
  var bumpType = fp;
  if (bumpType == 'none') {
     return;
  }
  else if (bumpType == 'main' || bumpType == "s1" || bumpType == 's2' || bumpType == 'th') {
    // todo fix
    
    content.article.findOne({ _id : {$ne  : paramsId }, frontpageStatus : bumpType}, function (err, article) {
        if (!article) return;
        article.frontpageStatus = "none";
        console.log("hi");
        article.save(function(err) {
          if (err) console.log(err);
          
        });
      });
    content.article.findOneAndUpdate({ _id : paramsId}, {frontpageStatus : bumpType}, function (err, post) {
            if (err) console.log(err);
            else console.log("Success!");
          })
  }
  else if (bumpType == "bump") {


    var order = ['bump', 'main', 's1', 's2', 'th', 'th'];
    // if there is none of an item simply make this that ite

    var transition = {};


    for (var i=order.length-1; i>0; i--) {
      transition[order[i-1]] = order[i];
    }
    console.log(JSON.stringify(transition));
    content.article.find({$or : [{ frontpageStatus : { $ne : 'none'}}, {_id : paramsId}]}, function (err, articles) {
      for (var i=0; i<articles.length; i++) {
          if (articles[i]._id == paramsId) {
            articles[i].frontpageStatus = "main";
            console.log("in loop");
            continue;
          }
          console.log(articles[i].frontpageStatus + ", " + transition[articles[i].frontpageStatus]);
          articles[i].frontpageStatus = transition[articles[i].frontpageStatus];
          articles[i].save(function (err) {
            if (err) console.log("err saving!" + err);
          });
      }
    } );

   
  }

}

var crudApi = express.Router();
crudApi.put('/' + blogContent + "/:id", function (req, res) {
  saveContent(content.blog, req, res);
});
crudApi.put('/' + pageContent + "/:id", function (req, res) {
  saveContent(content.page, req, res);
});
crudApi.put('/' + storyContent + "/:id" , function (req, res) {
  function cb () {

  }
  // to prevent deep clone
  var bumpStatus = req.body.frontpageStatus;
  delete req.body.frontpageStatus;
  console.log(bumpStatus);
  if (req.body.publish)
    saveContent(content.article, req, res, setBump(bumpStatus, req.params.id));
  else 
    saveContent(content.article, req, res);
});
crudApi.delete("/" + blogContent + "/:id", function (req, res) {
   content.blog.find({ _id : req.params.id }).remove(function (e, req) {

    res.send("deleted");
   });
});
crudApi.delete("/" + storyContent + "/:id", function (req, res) {
   content.article.find({ _id : req.params.id }).remove(function (e, req) {
    res.send("deleted");
   });
});
crudApi.delete("/" + pageContent + "/:id", function (req, res) {
   content.page.find({ _id : req.params.id }).remove(function (e, req) {
    res.send("deleted");
   });
})
crudApi.get('/' + blogContent + "/:id", function (req, res) {
  content.blog.find({ _id : req.params.id }, function (e, blog) {
      if (e) next('route');
      else if  (blog.length == 0) next('route');
      else res.send(blog)
   });
});
crudApi.get('/' + pageContent + "/:id", function (req, res) {
  content.page.find({ _id : req.params.id }, function (e, blog) {
      if (e) next('route');
      else if  (blog.length == 0) next('route');
      else res.send(blog)
   });
});
crudApi.get('/' + storyContent + "/:id", function (req, res) {
  content.article.find({ _id : req.params.id }, function (e, blog) {

      if (e) next('route');
      else if  (blog.length == 0) next('route');
      else {

        res.send(blog);
      }
   });
});
router.use('/data', crudApi);




router.get('/new-' + blogContent, function (req, res) {
  // res.render('admin/admin-edit-post', {'edit' : false});
   new content.blog({}).save(function (err, blog) {
      res.redirect('/admin/edit-blog/' + blog._id);
   });
});

router.get('/new-' + storyContent, function (req, res) {
  // res.render('admin/admin-edit-post', {'edit' : false});
   new content.article({}).save(function (err, article) {
      res.redirect('/admin/edit-story/' + article._id);
   });
});
router.get('/new-' + pageContent, function (req, res) {
  // res.render('admin/admin-edit-post', {'edit' : false});
   new content.page({}).save(function (err, article) {
      res.redirect('/admin/edit-page/' + article._id);
   });
});


// make this simpler 
router.get('/edit-' + blogContent +'/:id', function (req, res) {
  content.blog.findOne({ _id : req.params.id}).exec(function (err, post) {
    res.render('admin/admin-edit-post', {'edit' : true, content : req.params.id, contype : "blog"});
  });
  // res.render('admin/admin-edit-post', {'edit' : true});
});
router.get('/edit-'+ storyContent +'/:id', function(req, res) {
  content.article.findOne( { _id : req.params.id }).exec(function (err, article) {
    res.render('admin/admin-edit-post', {'edit' : true, content : req.params.id, contype : "story"});
  });
});
router.get('/edit-'+ pageContent +'/:id', function(req, res) {
  content.page.findOne( { _id : req.params.id }).exec(function (err, article) {
    res.render('admin/admin-edit-post', {'edit' : true, content : req.params.id, contype : "page"});
  });
});






router.use(express.static('uploads'));


module.exports = router;

var express =require('express');
var path =require('path'); //path module in node
var aws = require('aws-sdk')
var bodyParser = require('body-parser')
var PythonShell = require('python-shell');
var fileUpload = require('express-fileupload');
var http = require('http');
var mongoose = require('mongoose')
var models = require('../models/models.js')
var Game = models.Game;
aws.config.loadFromPath('./backend/config.json')
var s3 = new aws.S3();

var app = express();



app.use(express.static('build'));
//middleware configured to use folder 'build' for static? script tags
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, '../index.html'))
  //path is node built in we use  to join these names (like + I think)
});

app.post('/serverupload', function(req,res) {
  // if(!!req.files){
  //   console.log('file sent to server')
  //   console.log('serverUpload', req.files.serverUpload);
  // }
  // var file = req.files.serverUpload
  // var name = req.files.serverUpload.name
  // var pathway = path.join(__dirname, req.files.serverUpload.name)

  //STEPS 2 AND 3 -- POST TO AWS AND GET SUCCESS RESPONSE HERE
    // say the response link to the video is var source
  // var myBucket = 'video-search'
  // params = {
  //   Bucket: myBucket,
  //   Key: file,
  //   Body: name
  // };
  // s3.putObject(params, function(err, data) {
  //     if (err) {
  //         console.log(err)
  //     } else {
  //       console.log(data);
  //     }
  //  });
  //
  // //post the link to the mp4 file to the python server (step 4)
  // var source = 'https://media.w3.org/2010/05/sintel/trailer.mp4'
  var options = {
    // host: 'whatever the fuck heroku is called',
    port: 8080,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(source)
    }
  };
  var httpreq = http.request(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log("body: " + chunk);
    }).on('error', function(err) {
      res.send('error');
    }).on('end', function() {
      res.send('ok');
    })
  }).on('error', function(e){
    console.log(e)
  });
  httpreq.write(source);
  httpreq.end();
  console.log('request sent')
  res.redirect('/')
})

//10, 11, 12
app.post('/python', function(req,res){
  console.log("python response: ", req.body)
  //path is node built in we use  to join these names (like + I think)
});

//Steps 17, 18, 19
app.get('/gameinfo', function(req, res){
  Game.find(function(err, character){
    if(err){
      console.log('Error', err);
    } else{
      res.json(character[0])
    }
  })
})

//Steps 14 and 15
app.post('/gameinfo', function(req, res){
  var probability = 0;
  arr.forEach(function(item){
    probability += parseFloat(item);
  })
  probability /= arr.length;
  var name = 'an unidentifiable character';
  if(probability > 95){
    character = 'Blitzcrank';
  }
  var gamedata = Game({
    character: 'Blitzcrank',
    probability: probability
  })
  gamedata.save(function(err){
    if(err){
      console.log('Error', err);
    } else{
      console.log('Data was saved')
    }
  })
})

app.listen(3000, function(){
  console.log('running on port: 3000')
})

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

var Clarifai = require('clarifai');
var clari = new Clarifai.App(
  '__3uMWKnxtW80PG8kr748bFYLI7cxWOQWtuKIWdu',
  'kuG-qTBwu_weD0peNgwBXF8mvjwNsD9fRRlTLAhN'
);
clari.getToken();

aws.config.loadFromPath('./backend/config.json')
var s3 = new aws.S3()

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
//9-15 here
app.post('/python', function(req,res){
  console.log("req.body", req.body)
  //path is node built in we use  to join these names (like + I think)
});

//Steps 17,18, 19
app.get('/gameinfo', function(req, res){
  Game.find(function(err, character){
    if(err){
      console.log('Error', err);
    } else{
      res.json(character[0])
    }
  })
})
//Steps 10,11, 12,13, 14, 15 //get rid of 10 and 11
app.get('/predict', function(req, res){
  var allKeys = [];
  var predictions = [];
  s3.listObjects({Bucket: 'INSERT_BUCKETNAME_HERE'}, function(err, data){
    data.Contents.forEach((item) => {
      allKeys.push(item.Key)
    })
    allKeys.shift()
    var idx = 0
    var input = setInterval(function(){
      if(idx === allKeys.length - 1){
        clearInterval(input)
      }
      clari.models.predict(Clarifai.GENERAL_MODEL, 'https://s3.amazonaws.com/horizonsvideosearch/uploads/' + allKeys[idx] + '.jpg').then(
        function(response) {
          predictions.push(response.outputs[0].data.concepts[0]);
        },
        function(err) {
          console.error(err);
        }
      );
      idx++;
    },100)
  })
  var probability = 0;
  predictions.forEach(function(item){
    probability += item.value;
  })
  probability /= predictions.length;
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

app.post('/uploadurl', function(req, res){
  var source = req.body.url
  console.log(source)
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
  res.redirect('/')
})

app.use('/s3', require('react-s3-uploader/s3router')({
    bucket: "videosearch-assets",
    region: 'us-west-1', //optional
    signatureVersion: 'v4', //optional (use for some amazon regions: frankfurt and others)
    headers: {'Access-Control-Allow-Origin': '*'}, // optional
    ACL: 'private'
  })
//
);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

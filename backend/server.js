var express =require('express');
var app = express();
var path =require('path'); //path module in node
var aws = require('aws-sdk')

app.use(express.static('build'));
//middleware configured to use folder 'build' for static? script tags

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, '../index.html'))
  //path is node built in we use to join these names (like + I think)
});

app.listen(3000, function(){
  console.log('running at port: 3000')
})


// aws.config.loadFromPath('backend/config.json');
// var s3Bucket = new aws.S3( { params: {Bucket: 'videosearch-assets'} } );
//
// var data = {Key: 'rajiv_profile1', Body: '../rajiv1.jpg'};
// s3Bucket.putObject(data, function(err, data){
//   if (err)
//     { console.log('Error uploading data: ', err);
//     } else {
//       console.log('succesfully uploaded the image!');
//     }
// });

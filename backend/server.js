var express =require('express');
var app = express();
var path =require('path'); //path module in node

app.use(express.static('build'));
//middleware configured to use folder 'build' for static? script tags

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, '../index.html'))
  //path is node built in we use to join these names (like + I think)
  var Clarifai = require('clarifai');
  var clarifai = new Clarifai.App(
    'fmg3IhJiXLRFA9iysbcPtI3x2fLbe1G_tOBy4GXJ',
    '4vfKMKEwQSJnhCTjsfQqrJgB9xYh_BCKhDzlbSnH'
  );

  // predict the contents of an image by passing in a url
  clarifai.models.predict(Clarifai.GENERAL_MODEL, 'https://youtu.be/Ifi9M7DRazI').then(
    function(response) {
      console.log(response);
    },
    function(err) {
      console.error(err);
    }
  );
});



app.listen(3000, function(){
  console.log('running at port: 3000')
})

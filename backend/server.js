var express =require('express');
var app = express();
var path =require('path'); //path module in node

app.use(express.static('build'));
//middleware configured to use folder 'build' for static? script tags

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, '/index.html'))
  //path is node built in we use to join these names (like + I think)
});

app.listen(3000, function(){
  console.log('running at port: fuck')
})

var express =require('express');
var app = express();
var path =require('path'); //path module in node
var Clarifai = require('clarifai');
var clari = new Clarifai.App(
  '7U7ltBFRur3aLcqfQxJNjPBnegH26aZ3KsyiAoUJ',
  'ZriUebG6wXJR0WEJ6-X8pK2cDL4xLp4pBSPjpG-B'
);

clari.getToken();

app.use(express.static('build'));
//middleware configured to use folder 'build' for static? script tags

app.get('/', function(req,res){
  res.sendFile(path.join(__dirname, '../index.html'))
  // clari.models.predict(Clarifai.GENERAL_MODEL, 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank1.jpg').then(
  //   function(response) {
  //     console.log(response.outputs[0].input);
  //   },
  //   function(err) {
  //     console.error(err);
  //   }
  // );
  //path is node built in we use to join these names (like + I think)
  });

  // clari.inputs.create(
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank1.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank2.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank3.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank4.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank5.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank6.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank7.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank8.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank9.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank10.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank11.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank12.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank13.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank14.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank15.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank16.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank17.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank18.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank19.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   },
  //   {
  //     url: 'https://s3.amazonaws.com/horizonsvideosearch/blitzcrank/blitzcrank20.PNG',
  //     concepts: [
  //       {id: "blitzcrank", value: true}
  //     ]
  //   }
  // ).then(
  //     function(response){
  //       console.log('images added')
  //       console.log(response)
  //       createModel()
  //     },
  //     function(err){
  //       console.error(err)
  //     }
  //   );

function createModel() {
  clari.models.create("blitzcrank",[{'id': "blitzcrank"}]).then(
    function(response){
      console.log('==================================')
      console.log('model created')
      trainModel()
    },
    function(err){
      console.error(err)
    }
  );
}

function trainModel(){
  clari.models.train("blitzcrank").then(
    function(response){
      console.log('==================================')
      console.log('trained')
      // predictModel()
    },
    function(err){
      console.error(err)
    }
  );
}


  clari.models.predict("blitzcrank", ["http://cdn.cloth5.com/wp-content/uploads/2014/08/blitzcrank_q.jpg"]).then(
    function(response){
      console.log('=============================')
      console.log('prediction')
      console.log(response.outputs[0].data.concepts[0].id, "probability", response.outputs[0].data.concepts[0].value)
    },
    function(err){
      console.error(err)
    }
  )






  app.listen(3000, function(){
    console.log('running at port: fuck omssdgg')
  })

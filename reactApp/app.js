var React = require('react');
var Redux = require('redux');
var ReactDOM = require('react-dom');
var styles = require('../styles.css')
// var aws = require('aws-sdk')
//
// aws.config.loadFromPath('backend/config.json')
// var s3Bucket = new aws.S3( {params: {Bucket: 'videosearch-assets'}  } )


var SendingData = React.createClass({
  parseVideo(evt){
    evt.preventDefault();

    var file = $('#browserUpload').prop('files')[0]
    console.log('our file', file)

    //we are iterating through each second, seeking the next second once our frame is saved as thumbnail
    //for each new frame we use canvas to draw it and save it inside thumbs
    var createThumbnails = function () {
      var i = 4
      var video = document.createElement("video");
      var thumbs = document.getElementById("thumbs");

      video.addEventListener('loadeddata', function() { //when a frame has loaded (before the next has) it
        console.log("Loaded the Video,", video.duration, "seconds long");
        thumbs.innerHTML = "";
        video.currentTime = i;
        generateThumbnail();
      }, false); //runs after video.preload runs


      video.preload = "auto"; //begins loading video early on
      video.src = source; //for uploaded files, maybe this doesn't work

      //through iframe api or from video upload
      function generateThumbnail() { //we use canvas and append a child canvas to thumbs
        //so inside thumbs are the canvas children
        var c = document.createElement("canvas");
        var ctx = c.getContext("2d"); //sets 2d convas of c.width and c.height to ctx.drawImage (built-in) on
        c.width = 160;
        c.height = 90;
        ctx.drawImage(video, 0, 0, 160, 90);

        // var img = new Image();
        // img.src = c.toDataURL();


        // var data = {
        //   Key: 'frameN',
        //   Body: bodystream,
        //   ContentEncoding: 'base64',
        //   ContentType: 'image/png'
        // }
        //
        // s3Bucket.putObject(data, function (err,data) {
        //   if(err){
        //     console.log("err", err);
        //   } else {
        //     console.log('successfully uploaded')
        //   }
        // })

        // thumbs.appendChild(img);
        thumbs.appendChild(c);  //we add our created image into thumbs, instead we can get rbg array for
        //each pixel and send that to a server
        i=i+4; // when frame is captured, increase

        if (i <= video.duration) { // if we are not passed end, seek to next interval
          // this will trigger another seeked event
          video.currentTime = i;
          console.log('currentTime', video.currentTime)
          generateThumbnail()
        } else {
          alert("done!") //each second of the video has a frame captured
        }

      }
    };

    //process uploaded file to execute creation of thumbnails correctly
    var source = ''
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
      source = reader.result;
      console.log(2)
      createThumbnails();
    }, false);
    if (file) {
      reader.readAsDataURL(file);
      console.log(1)
    }
  },
  serverUpload(evt){
    // evt.preventDefault();
    //
    //
    // var file = $('#serverUpload').prop('files')[0]
    // console.log('filee: ',file)
    // var source = ''
    // var reader  = new FileReader();
    //
    //
    // reader.addEventListener("load", function () {
    //   source = reader.result;
    //   var payload = {
    //     file: file
    //   };
    //   var data = JSON.stringify(payload)
    //   console.log('source found')
    //   fetch("/serverupload", {
    //     method: "POST",
    //     headers: {
    //       'Accept': 'application/json, text/plain, */*',
    //       'Content-Type': 'application/json'
    //     },
    //     body: data
    //   }).then((resp) => resp.json()).then(console.log).catch
    // }, false);
    //
    // if (file) {
    //   reader.readAsDataURL(file);
    //   console.log(1)
    // }
  },
  render(){
    return (
      <div>
        <div>
          <form onSubmit={this.parseVideo}>
            <input id="browserUpload" type="file" name="browserUpload" />
            <input type="submit"
            />
          </form>
          <form action="http://localhost:3000/serverupload"
            method="post"
            encType="multipart/form-data">
            <input id="serverUpload" type="file" name="serverUpload" />
            <input type="submit" />
          </form>
        </div>
        <div>Sending Data to Video Classifier</div>
        <div id="thumbs" />
      </div>
    )
  }
})

var Search = React.createClass({
  getInitialState(){
    return{
      generalQuery: '',
      specificQuery: '',
      showProgress: true //will be changed to default false later so it conditionally renders whatver urls we pull
    }
  },
  updateGeneralQuery(event){
    this.setState({
      generalQuery: event.target.value
    })
  },
  updateSpecificQuery(event){
    this.setState({
      specificQuery: event.target.value
    })
  },
  handleSubmit(event){
    event.preventDefault();
    console.log('handled submit')
    this.setState({
      showProgress: true
    });
  },
  render(){
    return (
      <div>
        <h1>Search!</h1>
        <form onSubmit = {this.handleSubmit}>
          <input type='text' value={this.state.generalQuery} onChange={this.updateGeneralQuery} placeholder='General Search Query'/>
          <input type='text' value={this.state.specificQuery} onChange={this.updateSpecificQuery} placeholder='Specific Search Query'/>
          <input type = 'submit' value = 'Submit'/>
        </form>
        <div>
          {this.state.showProgress ? <SendingData /> : <div>Pick Video Query to Send to Classifier</div>}
        </div>
      </div>
    )
  }
})


ReactDOM.render(
  <Search />,
  document.getElementById('root')
);

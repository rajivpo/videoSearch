
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
var ReactS3Uploader = require('react-s3-uploader');

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      character: '',
      probability: 0
    }
  }
  getResult(evt){
    evt.preventDefault();
    fetch('http://localhost:3000/gameinfo')
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        character: responseJson.character,
        probability: responseJson.probability
      })
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

    })
  }
  uploadFile(evt){
    evt.preventDefault();
  }
  render(){
    var gameInfo = '';
    if(this.state.character.length > 0 && this.state.character === 'Blitzcrank' && this.state.probability > 0){
      gameInfo = 'We are ' + this.state.probability +'% confident that you are playing ' + this.state.character;
    } else if(this.state.character === 'unidentifiable character'){
      gameInfo = 'We are unable to confidently identify the character you are playing. Our best guess is that you are playing Blitzcrank (' + this.state.probability + '%)'
    }
    return(
      <div>
      <h1 style={{textAlign: 'center'}}>Play smarter. Carry harder.</h1>
      <p>League of Legends is a game of skill. Hitting skillshots makes for increased damage,
      higher winrates, and epic montages.
      Why settle for missing skillshots?
      </p>
      <p>Untilt.gg uses advanced machine learning and computer vision unlock your skillshot potential.</p>
      <h2 style = {{textAlign: 'center'}}> Upload a video to get gameplay analytics</h2>
      <div style ={{textAlign: 'center', paddingBottom: 20}}>
      <form onSubmit = {this.uploadFile}>
      <input type='file' name='fileupload'/>
      <input type = 'submit' value = 'Upload File'/>
      </form>
      </div>
      <div style={{textAlign: 'center'}}>
      <form onSubmit = {this.getResult}>
      <input type='submit' value='Get Results!'/>
      </form>
      <h2>{gameInfo}</h2>
      </div>
      <ReactS3Uploader
          signingUrl="/s3/sign"
          signingUrlMethod="GET"
          accept="image/*"
          signingUrlWithCredentials={ true }      // in case when need to pass authentication credentials via CORS
          uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
          contentDisposition="auto"
          scrubFilename={(filename) => filename.replace(/[^\w\d_\-\.]+/ig, '')}
          server="http://localhost:3000" />

      </div>
    )
  }
}

ReactDOM.render(
  <Main/>,
  document.getElementById('root')
)

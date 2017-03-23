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

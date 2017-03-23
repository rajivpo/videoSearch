
import React, {Component} from 'react'
import styles from '../styles.css'
import ReactDOM from 'react-dom'
var ReactS3Uploader = require('react-s3-uploader');

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      character: '',
      probability: 0,
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
  onFinish(){
    fetch('http://localhost:3000/uploadurl',{
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: 'https://s3-us-west-1.amazonaws.com/videosearch-assets/2a7a8fed-8eb0-407e-880a-5ec43fc82932_testing4.mp4'
      })
    }).catch(function(err){
      console.log(err);
    })
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
      <div>
      <h1 style={{textAlign: 'center'}}>Play smarter. Carry harder.</h1>
      <p>League of Legends is a game of skill. Hitting skillshots makes for increased damage,
      higher winrates, and epic montages.
      Why settle for missing skillshots?
      </p>
      <p>Untilt.gg uses advanced machine learning and computer vision unlock your skillshot potential.</p>
      <h2 style = {{textAlign: 'center'}}> Upload a video to get gameplay analytics</h2>
      <div style ={{textAlign: 'center', paddingBottom: 20}}>
      </div>
      <ReactS3Uploader
      signingUrl="/s3/sign"
      signingUrlMethod="GET"
      accept="video/*"
      onFinish = {this.onFinish}
      signingUrlWithCredentials={ true }      // in case when need to pass authentication credentials via CORS
      uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
      contentDisposition="auto"
      onFinish = {this.onFinish}
      scrubFilename={(filename) => filename.replace(/[^\w\d_\-\.]+/ig, '')}
      server="http://localhost:3000" />
      </div>
      <div style={{textAlign: 'center'}}>
      <form onSubmit = {this.getResult}>
      <input type='submit' value='Get Results!'/>
      </form>
      <h2>{gameInfo}</h2>
      </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Main/>,
  document.getElementById('root')
)

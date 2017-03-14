var React = require('react');
var Redux = require('redux');
var ReactDOM = require('react-dom');
var styles = require('../styles.css')

var SendingData = React.createClass({
  componentDidMount(){
    //this code is likely all wrong and untested
    var i = 0;
    var video = document.createElement("video");
    var thumbs = document.getElementById("thumbs");

    video.addEventListener('loadeddata', function() {
      thumbs.innerHTML = "";
      video.currentTime = i;
    }, false);

    video.addEventListener('seeked', function() {
      // now video has seeked and current frames will show
      // at the time as we expect
      generateThumbnail(i);
      i++;// when frame is captured, increase
      if (i <= video.duration) { // if we are not passed end, seek to next interval
        // this will trigger another seeked event
        video.currentTime = i;
      }
      else {
        // DONE!, next action
        alert("done!")
      }

    }, false);

    video.preload = "auto";
    video.src = "https://media.w3.org/2010/05/sintel/trailer.mp4";

    function generateThumbnail() {
      var c = document.createElement("canvas");
      var ctx = c.getContext("2d");
      c.width = 160;
      c.height = 90;
      ctx.drawImage(video, 0, 0, 160, 90);
      thumbs.appendChild(c);
    }
  },
  render(){
    return (
      <div>
        <div>Sending Data to Video Classifier</div>
        <video width="320" height="240" controls>
          <source src="../video.mp4" type='video/mp4' /> //this is for a local source not an html link but lmao
          Your browser does not support the video tag.
        </video>
        <div id="thumb">
        </div>
      </div>
    )
  }
})

var Search = React.createClass({
  getInitialState(){
    return{
      generalQuery: '',
      specificQuery: '',
      showProgress: false //will be changed to default false later so it conditionally renders whatver urls we pull
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

var React = require('react');
var Redux = require('redux');
var ReactDOM = require('react-dom');
var styles = require('../styles.css')

var Search = React.createClass({
  getInitialState(){
    return{
      generalQuery: '',
      specificQuery: ''
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
  handleSubmit(){

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

      </div>
    )
  }
})


ReactDOM.render(
  <Search />,
  document.getElementById('root')
);

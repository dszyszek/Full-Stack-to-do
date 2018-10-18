import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'babel-polyfill';

import AppRouter from './routers/appRouter.js';





ReactDOM.render(<AppRouter />, document.querySelector('#app'));



// Fetching all users from db
/*
class App extends React.Component {
    state = {
      response: ''
    };
  
    componentDidMount() {
      this.callApi()
        .then(res => {
            console.log(res.usr)
            return this.setState({ response: res.usr })})
        .catch(err => console.log(err));
    }
  
    callApi = async () => {
      const response = await fetch('http://localhost:3000/users'); // react proxy doesn't work
      const body = await response.json();
  
      if (response.status !== 200) throw Error(body.message);
  
      return body;
    };
  
    render() {
      return (
        <div className="App">
          <p className="App-intro">{JSON.stringify(this.state.response, undefined, 2)}</p>
        </div>
      );
    }
  }


ReactDOM.render(<App />, document.querySelector('#app'));
  
  */
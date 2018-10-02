import React, { Component } from 'react';
import './app.css';

export default class App extends Component {
  contructor () {
    this.state = { username: null };
  }
  
  render() {
    return (
      <div>
        <h1>Legends never die!!!!</h1>
      </div>
    );
  }
}

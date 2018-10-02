import React, { Component } from 'react';
import './app.css';

export default class App extends Component {
  state = { matches: null };

  componentDidMount() {
    fetch('/api/getSummonerMatches')
      .then(res => res.json())
      .then(matches => this.setState({ matches: matches }));
  }

  renderMatch(match) {
    return <div key={match.gameId}>{match.gameId} - {match.victory? "win": "lose"}</div>
  }

  render() {
    const { matches } = this.state;
    return (
      <div>
        <h1>Legends never die!!!!</h1>
        {matches ? matches.map(this.renderMatch) : ""}
      </div>
    );
  }
}

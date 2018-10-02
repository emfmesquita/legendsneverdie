import React, { Component } from 'react';
import './app.css';
import Match from './Match';
import { Container, Row, Col } from 'reactstrap';

export default class App extends Component {
  state = { matches: null };

  componentDidMount() {
    fetch('/api/getSummonerMatches')
      .then(res => res.json())
      .then(matches => this.setState({ matches: matches }));
  }

  renderMatch(match) {
    return (
      <Row key={match.gameId}>
        <Col><Match data={match} /></Col>
      </Row>
    );
  }

  render() {
    const { matches } = this.state;
    return (
      <div>
        <h1>Legends never die!!!!</h1>
        <Container>
          {matches ? matches.map(this.renderMatch) : ""}
        </Container>
      </div>
    );
  }
}

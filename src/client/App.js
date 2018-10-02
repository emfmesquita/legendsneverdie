import React, { Component } from 'react';
import './app.css';
import Match from './Match';
import ReactLoading from "react-loading";
import { Container, Row, Col, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';

export default class App extends Component {
  state = { matches: null, err: null, summoner: "", loading: false };

  send = () => {
    const summoner = this.getSummoner();
    if (!summoner) {
      this.setState({ matches: null, summoner: "", loading: false });
      return;
    }

    this.setState({ matches: null, err: null, loading: true }, () => {
      fetch(`/api/getSummonerMatches?summoner=${this.state.summoner}`)
        .then(res => res.json())
        .then(json => this.setState({ matches: json.matches, err: json.err, loading: false }));
    });
  }

  setSummoner = (evt) => {
    this.setState({
      summoner: evt.target.value
    });
  }

  getSummoner = () => {
    return this.state.summoner ? this.state.summoner.trim() : "";
  }

  inputKeyDown = (evt) => {
    if(evt.keyCode !== 13) return;
    this.send();
  }

  renderMatch(match) {
    return (
      <Row key={match.gameId}>
        <Col><Match data={match} /></Col>
      </Row>
    );
  }

  renderMatches = () => {
    const { matches } = this.state;
    const summoner = this.getSummoner();
    return (
      <div>
        <h1>{summoner ? `${summoner} will ` : "Legends"} never die!!!!</h1>
        <Container>
          {matches ? matches.map(this.renderMatch) : ""}
        </Container>
      </div>
    );
  }

  renderErr = () => {
    return <h2 className="lnd-error">{this.state.err.message}</h2>;
  }

  renderLoading = () => {
    return (
      <Container>
        <Row>
          <Col sm="5"></Col>
          <Col sm="2">
            <ReactLoading className="lnd-loading" type="spin" color="#000" />
          </Col>
          <Col sm="5"></Col>
        </Row>
      </Container>
    );
  }

  renderBody = () => {
    if(this.state.loading){
      return this.renderLoading();
    }
    return this.state.err ? this.renderErr() : this.renderMatches();
  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <InputGroup>
                <InputGroupAddon addonType="prepend">Summoner</InputGroupAddon>
                <Input value={this.state.summoner} onKeyDown={this.inputKeyDown} onChange={this.setSummoner} maxLength="16" />
                <InputGroupAddon addonType="append">
                  <Button onClick={this.send}>Send</Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </Row>
        </Container>
        {this.renderBody()}
      </div>
    );
  }
}

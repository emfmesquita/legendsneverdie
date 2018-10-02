import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Champion from './Champion';
import Spell from './Spell';
import Item from './Item';
import Rune from './Rune';

const formatTime = (seconds) => {
    let formated = "";
    if(seconds >= 3600){
        formated += `${Math.floor(seconds/3600)}h `;
        seconds = seconds % 3600;
    }

    if(seconds >= 60){
        formated += `${Math.floor(seconds/60)}m `;
        seconds = seconds % 60;
    }

    formated += `${seconds}s`;
    return formated;
}

const kda = (k,d,a) => {
    return d === 0 ? "inf" : ((k+a)/d).toLocaleString('en-US', {maximumFractionDigits: 2, minimumFractionDigits: 2});
}

const csPerMinute = (data) => {
    return ((60 * data.creepScore)/data.gameLength).toLocaleString('en-US', {maximumFractionDigits: 1, minimumFractionDigits: 1});
}

export default class Match extends Component {
    render() {
        const data = this.props.data;
        if(data.old) return <div className="lnd-match lnd-old"><h2>Old Season Match</h2></div>

        return (
            <div className={"lnd-match " + (data.victory ? "lnd-win" : "lnd-lose")}>
                <h2>{data.victory? "Victory!": "Defeat"}</h2>

                <Row>
                    <Col sm="12" md="4">
                        <Champion data={data.champion} version={data.version} lvl={data.championLvl}/>
                        <Spell data={data.spells[0]} version={data.version}/><Spell data={data.spells[1]} version={data.version}/>
                        <div>{formatTime(data.gameLength)}</div>
                    </Col>
                    <Col sm="12" md="4">
                        <div>KDA {data.kills} / {data.deaths} / {data.assists} -> {kda(data.kills, data.deaths, data.assists)}</div>
                        <div>{data.creepScore} CS - {csPerMinute(data)} CS/min</div>
                        
                    </Col>
                    <Col sm="12" md="4">
                        <div>
                            <div className="lnd-label">Items</div>
                            <Item data={data.items[0]} version={data.version}/>
                            <Item data={data.items[1]} version={data.version}/>
                            <Item data={data.items[2]} version={data.version}/>
                            <Item data={data.items[3]} version={data.version}/>
                            <Item data={data.items[4]} version={data.version}/>
                            <Item data={data.items[5]} version={data.version}/>
                            <Item data={data.items[6]} version={data.version}/>
                        </div>
                        <div>
                            <div className="lnd-label">Primary Rune Path</div>
                            <Rune data={data.runes.primary.style} version={data.version}/>
                            <Rune data={data.runes.primary.keystone} version={data.version}/>
                            <Rune data={data.runes.primary.runes[0]} version={data.version}/>
                            <Rune data={data.runes.primary.runes[1]} version={data.version}/>
                            <Rune data={data.runes.primary.runes[2]} version={data.version}/>
                        </div>
                        <div>
                            <div className="lnd-label">Secondary Rune Path</div>
                            <Rune data={data.runes.secondary.style} version={data.version}/>
                            <Rune data={data.runes.secondary.runes[0]} version={data.version}/>
                            <Rune data={data.runes.secondary.runes[1]} version={data.version}/>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
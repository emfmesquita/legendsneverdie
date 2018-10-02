import React, { Component } from 'react';

export default class Champion extends Component {
    render(){
        const version = this.props.version;
        const data = this.props.data;
        const lvl = this.props.lvl;
        return (
            <div className="lnd-champion">
                <img src={`http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${data.image}`} alt={data.name} title={data.name}/>
                <div>LVL {lvl} - {data.name}</div>
            </div>
        );
    }
}
import React, { Component } from 'react';

export default class Spell extends Component {
    render(){
        const version = this.props.version;
        const data = this.props.data;
        return (
            <span className="lnd-spell">
                <img src={`http://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${data.image}`} alt={data.name} title={data.name}/>
            </span>
        );
    }
}
import React, { Component } from 'react';

export default class Rune extends Component {
    render(){
        const version = this.props.version;
        const data = this.props.data;
        return (
            <span className="lnd-rune">
                <img src={`http://ddragon.leagueoflegends.com/cdn/img/${data.image}`} alt={data.name} title={data.name}/>
            </span>
        );
    }
}
import React, { Component } from 'react';

export default class Item extends Component {
    renderImage = () => {
        const version = this.props.version;
        const data = this.props.data;
        if(!data.id) return null;
        return <img src={`http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${data.image}`} alt={data.name} title={data.name}/>;
    }

    render(){
        return (
            <span className="lnd-item">
                {this.renderImage()}
            </span>
        );
    }
}
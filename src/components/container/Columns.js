
import React, { Component } from 'react';
export default class Columns extends Component 
{
    render(){
        const cells = this.props.cells?this.props.cells:[];
        return (
            <div className="columns">
                {cells.map(cell=>{
                    return <div className="column">{cell}</div>
                })}
            </div>
        )
    }
}
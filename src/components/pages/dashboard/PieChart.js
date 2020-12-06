
import React, { Component } from 'react';

const PIE_W = 150, RAD = 2 * Math.PI;
const MAX_DEG = 360;

const circleX = 200, circleY = 200;
export default class PieChart extends Component {
    constructor(props) {
        super(props);
        this.proportions = this.props.proportions?this.props.proportions:[];
        this.state = {
        }

        this.accumulationDegree = 0;

        this.updatePie = () => {
            this.accumulationDegree = 0;
            const proportions  =this.proportions;

            const canvas = document.getElementById("pie_chart_canvas");
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ccc';
            let currentRad = RAD;
            let currentDegree = 0;
            let x = circleX + PIE_W, y = circleY;

            proportions.sort(function (a, b) {
                return b.value - a.value;
            });

            for (let i = 0; i < proportions.length; i++) {

                const element = proportions[i];
                const endAngle = currentRad - element.value * RAD;
                ctx.fillStyle = element.color;
                ctx.strokeStyle = element.color;
                ctx.beginPath();
                ctx.arc(circleX, circleY, PIE_W, currentRad, endAngle, true);
                // ctx.stroke();
                ctx.fill();

                currentDegree = element.value * MAX_DEG;
                this.accumulationDegree += currentDegree;
                const coord = this.calculateCoordinate(endAngle, ctx);

                //drawLine
                if (element.value < 0.5) {
                    ctx.beginPath();
                    ctx.moveTo(circleX, circleY);
                    ctx.lineTo(x, y);

                    ctx.lineTo(coord.x, coord.y);
                    ctx.fill();
                }

                x = coord.x;
                y = coord.y;

                currentRad = endAngle;
            }
        }

        this.calculateCoordinate = (radians, ctx) => {

            let newX = 0, newY = 0;
            const quad = this.getQuadrant(this.accumulationDegree);

            const adjustedX = Math.abs(PIE_W * Math.cos(radians));
            const adjuxtedY = Math.abs(PIE_W * Math.sin(radians));
            if (quad == 1) {
                newX = circleX + adjustedX;
                newY = circleY - adjuxtedY;

            } else if (quad == 2) {
                newX = circleX - adjustedX;
                newY = circleY - adjuxtedY;
            } else if (quad == 3) {
                newX = circleX - adjustedX;
                newY = circleY + adjuxtedY;
            } else if (quad == 4) {
                newX = circleX + adjustedX;
                newY = circleY + adjuxtedY;
            }
            // ctx.fillRect(newX-5, newY-5, 10, 10);
            return { x: newX, y: newY }
        }

        this.getQuadrant = (value) => {
            if (value <= 90) {
                return 1;
            }
            if (value <= 180) {
                return 2;
            }
            if (value <= 270) {
                return 3;
            }
            return 4;
        }

    }

    componentDidMount() {
        this.updatePie();
    }
    componentDidUpdate() {
        this.updatePie();
    }

    render() {

        return (
            <div style={{ height: 'auto' }} className="columns">
                
                <div className="column">
                <canvas id="pie_chart_canvas" className="has-background-light" width="400" height="400"></canvas>
                </div>
                <div className="column">
                    <DetailPie proportions={this.proportions} />
                </div>
            </div>
        )
    }
}

const DetailPie = (props) => {
    return (<article className="message">
    <div className="message-body">
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Warna</th>
                    <th>Keterangan</th>
                    <th>Presentase</th>
                </tr>
            </thead>
            <tbody>
                {props.proportions.map((proportion, i)=>{
                    return (
                        <tr>
                            <td style={{width:'20px'}}>{i+1}</td>
                            <td style={{padding:'5px',width:'50px'}}>
                                <div style={{width:'40px', height:'40px',backgroundColor:proportion.color, }}/>                            </td>
                            <td>{proportion.label}</td>
                            <td>{(100*proportion.value)}%</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
</article>)
}
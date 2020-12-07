
import React, { Component } from 'react';

const PIE_W = 100, RAD = 2 * Math.PI;
const MAX_DEG = 360;
const PIE_CANVAS_SIZE = 300;
const circleX = 150, circleY = 150;
export default class PieChart extends Component {
    constructor(props) {
        super(props);
        this.proportions = this.props.proportions ? this.props.proportions : [];
        this.
            proportions.sort(function (a, b) {
                return b.proportion - a.proportion;
            });
        this.state = {
            proportions: []
        }
        this.timeoutId = null;
        this.accumulationDegree = 0;

        this.updatePie = () => {
            this.accumulationDegree = 0;
            const proportions = this.state.proportions;

            const canvas = document.getElementById("pie_chart_canvas");
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ccc';
            let currentRad = RAD;
            let currentDegree = 0;
            let x = circleX + PIE_W, y = circleY;


            for (let i = 0; i < proportions.length; i++) {

                const element = proportions[i];
                const endAngle = currentRad - element.proportion * RAD;
                ctx.fillStyle = element.color;
                ctx.strokeStyle = element.color;
                ctx.beginPath();
                ctx.arc(circleX, circleY, PIE_W, currentRad, endAngle, true);
                // ctx.stroke();
                ctx.fill();

                currentDegree = element.proportion * MAX_DEG;
                this.accumulationDegree += currentDegree;
                const coord = this.calculatePosition(endAngle, element.proportion, ctx);

                ctx.fillStyle = element.color;
                //drawLine
                if (element.proportion < 0.5) {
                    ctx.beginPath();
                    ctx.moveTo(circleX, circleY);
                    ctx.lineTo(x, y);

                    ctx.lineTo(coord.x, coord.y);
                    // ctx.stroke();
                    ctx.fill();
                }

                //drawLabel
                const labelCoord = coord.labelCoord;
                ctx.font = "15px Arial";
                ctx.fillStyle = '#000';
                ctx.fillText(element.label + " " + parseFloat(100 * element.proportion).toFixed(2) + "%", labelCoord.x, labelCoord.y);

                x = coord.x;
                y = coord.y;

                currentRad = endAngle;
            }
        }

        this.calculatePosition = (radians, value, ctx) => {
            const mainCoord = this.calculateCoordinate(radians,
                this.accumulationDegree, PIE_W);
            //for label
            const rad = value * RAD / 2;
            const deg = value * MAX_DEG / 2;
            const labelCoord = this.calculateCoordinate(radians - rad,
                this.accumulationDegree - deg, PIE_W / 2);
            return { ...mainCoord, labelCoord: labelCoord };
        }

        this.calculateCoordinate = (radians, accDegree, radius) => {

            let newX = 0, newY = 0;
            const quad = this.getQuadrant(accDegree);

            const adjustedX = Math.abs(radius * Math.cos(radians));
            const adjuxtedY = Math.abs(radius * Math.sin(radians));
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

        this.proportionIsFixed = () => {
            const stateProp = this.state.proportions;
            const prop = this.proportions;
            const fixed = this.sumValues(stateProp) >= this.sumValues(prop);
            return fixed;
        }

        this.animate = () => {
            const proportions = this.proportions;
            // while (this.proportionIsFixed() == false) {

            const stateProp = this.state.proportions;
            for (let i = 0; i < proportions.length; i++) {
                const element = proportions[i];
                if (stateProp[i] == null) {
                    stateProp.push({
                        proportion: 0,
                        value: element.value,
                        label: element.label,
                        color: element.color
                    })
                }
                if (stateProp[i].proportion < element.proportion) {
                    stateProp[i].proportion += 0.005;
                }
                if (stateProp[i].proportion >= element.proportion) {
                    stateProp[i].proportion = element.proportion;
                }
            }
            this.setState({ proportions: stateProp });
            if (this.proportionIsFixed() == false) {
                this.requestAnimation();
            }
        }
        // }

        this.requestAnimation = () => {
            if (null != this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(this.animate, 1);
        }

        this.resetProportion = () => {
            this.setState({proportions:[]});
        }

    }

    sumValues(proportions) {
        let val = 0;
        for (let i = 0; i < proportions.length; i++) {
            const element = proportions[i];
            val += element.proportion;
        }
        return val;
    }

    componentDidMount() {
        this.requestAnimation();
        this.updatePie();
    }
    componentDidUpdate() {
        this.requestAnimation();
        this.updatePie();
    }

    render() {

        return (
            <div ><h3>{this.props.title? this.props.title:"Grafik"}</h3>
            <div style={{ height: 'auto' }} className="columns">

                <div className="column has-text-centered "  style={{overflowX:'scroll'}}>
                    <canvas id="pie_chart_canvas" className="has-background-light" width={PIE_CANVAS_SIZE} height={PIE_CANVAS_SIZE}></canvas>
                    
                </div>
                <div className="column ">
                    <DetailPie proportions={this.state.proportions} />
                </div>
            </div></div>
        )
    }
}

const DetailPie = (props) => {
    return (<article className="message">
        <div className="message-body" style={{overflowX:'scroll'}}>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Warna</th>
                        <th>Keterangan</th>
                        <th>Nilai</th>
                        <th>Presentase</th>
                    </tr>
                </thead>
                <tbody>
                    {props.proportions.map((proportion, i) => {
                        return (
                            <tr key={"PIE_PROP_"+i}>
                                <td style={{ width: '20px' }}>{i + 1}</td>
                                <td style={{ padding: '5px', width: '50px' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: proportion.color, }} />                            </td>
                                <td>{proportion.label}</td>
                                <td>{proportion.value}</td>
                                <td>{parseFloat(100 * proportion.proportion).toFixed(2)}%</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    </article>)
}
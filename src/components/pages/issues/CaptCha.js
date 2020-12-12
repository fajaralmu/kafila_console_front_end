
import React, { Component } from 'react';
export default class CaptCha extends Component {
    constructor(props) {
        super(props);
        this.canvas_id = "captcha_canvas_" + new Date().getTime();
    }
    getCaptchaText() {
        const captcha = this.props.captcha;
        const text = captcha.firstNumber + " " + captcha.operator + " " + captcha.secordNumber;
        return text;
    }
    drawCanvas() {
        const canvas = document.getElementById(this.canvas_id);
        const context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#000';
        context.font = '70px Arial';
        context.fillText(this.getCaptchaText(), 10, 50);
    }
    componentDidUpdate() {
        this.drawCanvas();
    }
    componentDidMount() {
        this.drawCanvas();
    }
    render() {
        const captcha = this.props.captcha;
        return (

            <article style={{ width: '100%' }} className="message ">
                <div className="message-header has-background-grey-lighter">
                    <p className="has-text-dark">Captcha</p>
                    <a onClick={this.props.reset} className="button"><i className="fas fa-sync" /></a>
                </div>
                <div className="message-body has-background-light">
                    <canvas id={this.canvas_id} className="has-background-light" style={{ width: '100px', height: 'auto' }} />
                    <input className="input" name="captcha_result" required />
                </div>
            </article>
        );
    }
}


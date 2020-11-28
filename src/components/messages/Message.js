
import React, { Component } from 'react';
import './Message.css'
class Message extends Component {
    constructor(props){
        super(props);

        this.state = {
            show:true
        }

        this.hide = ()=> {
            this.setState({show:false});
        }
        this.show = ()=> {
            this.setState({show:true});
        }
    }
    render() {
        if (this.state.show == false) {
            return null;
        }
        const className = this.props.className?'message '+this.props.className:'message is-info';
        return (
            <article id="my-message" className={className}>
                <div className="message-header">
                    <p>{this.props.header?this.props.header:"Info"}</p>
                    <button onClick={this.hide} className="delete" aria-label="delete"></button>
                </div>
                <div className="message-body">
                    {this.props.body}
                </div>
            </article>
        )
    }
}

export default Message;
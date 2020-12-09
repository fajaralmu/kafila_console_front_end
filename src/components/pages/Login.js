
import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import * as actions from '../../redux/actions/actionCreators'
import { connect } from 'react-redux'
import Message from './../messages/Message';
class Login extends Component {

    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.lastLoginAttempt = new Date();
        this.state = {

        };
        this.validateLoginStatus = () => {
            if (this.props.loginStatus == true) this.props.history.push("/dashboard");
        }
        this.handleSubmit = (event) => {
            event.preventDefault();
            const form = event.target;
            const data = new FormData(event.target);
            var email = form.elements[0];
            var password = form.elements[1];

            this.props.performLogin(email.value, password.value, this.props.app);
        }

        this.showLoginInfo = ()=> {
            if (this.props.loginFailed) {
                if (this.lastLoginAttempt != this.props.lastLoginAttempt) {
                    this.child.current.show();
                    this.lastLoginAttempt = this.props.lastLoginAttempt;
                }
            }
        }
    }
    componentWillMount() {
        this.validateLoginStatus();
    }
    componentDidUpdate() {
        this.validateLoginStatus();
        this.showLoginInfo();
    }
    componentDidMount() {

        document.title = "Login";
    }
    render() {
        return (
            <div>
                {this.props.loginFailed ? 
                    <Message ref={this.child}  className="is-danger" body="Login Failed" /> : null}

                <div className="columns is-centered">

                    <div style={{ marginTop: '10px', marginBottom: '10px' }} className="column is-5-tablet is-5-desktop is-5-widescreen">
                        <form id="formLogin" onSubmit={this.handleSubmit} className="box">
                            <div className="field has-text-centered">
                            <span style={{fontSize:'70px'}}><i className="fas fa-user-circle"/></span>
                            <p>Sign In</p>
                            </div>
                            <div className="field">
                                <label   className="label">Email</label>
                                <div className="control has-icons-left">
                                    <input nam="email" type="email" placeholder="e.g. user@gmail.com" className="input" required />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-envelope"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label  className="label">Password</label>
                                <div className="control has-icons-left">
                                    <input name="password" type="password" placeholder="*******" className="input" required />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-lock"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <button className="button is-success">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    //console.log(state);
    return {

        //user
        loginStatus: state.userState.loginStatus,
        lastLoginAttempt: state.userState.lastLoginAttempt,
        loginFailed: state.userState.loginFailed,
        requestId: state.userState.requestId

    }
}

const mapDispatchToProps = dispatch => ({
    performLogin: (email, password, app) => dispatch(actions.accountAction.performLogin(email, password, app)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Login));
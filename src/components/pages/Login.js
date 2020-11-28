
import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
class Login extends Component {

    constructor(props) {
        super(props);
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
            var password =form.elements[1];

            this.props.performLogin(email.value, password.value, this.props.app);
          }
    }
    componentWillMount(){
        this.validateLoginStatus();
    }
    componentDidUpdate(){
        this.validateLoginStatus();
    }
    componentDidMount() {
       
        document.title = "Login";
    }
    render() {
        return (
            <div class="columns is-centered">
                <div style={{marginTop: '10px', marginBottom: '10px'}} class="column is-5-tablet is-4-desktop is-3-widescreen">
                    <form id="formLogin" onSubmit={this.handleSubmit} className="box">
                        <div className="field">
                            <label for="" className="label">Email</label>
                            <div className="control has-icons-left">
                                <input nam="email" type="email" placeholder="e.g. bobsmith@gmail.com" className="input" required />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-envelope"></i>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <label for="" className="label">Password</label>
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
                </div></div>
        )
    }
}


const mapStateToProps = state => {
    //console.log(state);
    return {
  
      //user
      loginStatus: state.userState.loginStatus, 
      requestId: state.userState.requestId
   
    }
  }
  
  const mapDispatchToProps = dispatch => ({
    performLogin: (email, password, app) => dispatch(actions.performLogin(email, password, app)),
  })
  
  export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login));
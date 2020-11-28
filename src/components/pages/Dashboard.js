
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
class Dashboard extends Component {

    constructor(props){
        super(props);
        this.validateLoginStatus = () => {
            if (this.props.loginStatus != true || this.props.loggedUser == null) 
            {

                this.props.history.push("/login");
            }
        }
    }
    componentWillMount(){
        this.validateLoginStatus();
    }
    render(){
        if (null == this.props.loggedUser) {
            return null;
        }
        return (
            <div>
                <h2>Dashboard</h2>
                <p>Hello {this.props.loggedUser.display_name}</p>
                <p>Departement {this.props.loggedUser.departement.name}</p>
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log(state);
    return {
      loggedUser: state.userState.loggedUser,
      loginStatus: state.userState.loginStatus,
   
    }
  }
const mapDispatchToProps = dispatch => ({
  performLogin: (email, password, app) => dispatch(actions.performLogin(email, password, app)),
  requestAppId: (app) => dispatch(actions.requestAppId(app)),
  refreshLogin: () => dispatch(actions.refreshLoginStatus()),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard));
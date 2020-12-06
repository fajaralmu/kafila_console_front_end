
import React, { Component } from 'react';

import { Route, Switch, withRouter, Link } from 'react-router-dom'
import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
import * as formComponent from '../forms/commons';
import NavButtons from './../buttons/NavButtons';
import BaseComponent, { CommonTitle } from './../BaseComponent';
import Card from '../container/Card';
import { getDiffDaysToNow } from './../../utils/DateUtil';
class Dashboard extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {};

    }
    componentWillMount() {

        this.validateLoginStatus();
    }
    componentDidMount() {
        document.title = "Dashboard";
    }

    render() {
        if (null == this.isLoggedUserNull()) {
            return null;
        }
        return (
            <div>
                <CommonTitle>Dashboard</CommonTitle>
                <Card title="Welcome" >
                    <p>{this.getLoggedUser().display_name}</p>
                    <p>Bidang {this.props.loggedUser.departement.name}</p>
                </Card>
            </div>
        )
    }
}
const mapStateToProps = state => {

    return {
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus,
    }
}
const mapDispatchToProps = dispatch => ({
    
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard));
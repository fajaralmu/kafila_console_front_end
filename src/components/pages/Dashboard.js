
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
        // if (null == this.props.meetingNoteData) {
        //     this.getMeetingNotes();
        document.title = "Dashboard";
        // this.populateDefaultInputs();
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
        meetingNoteData: state.meetingNoteState.meetingNoteData
    }
}
const mapDispatchToProps = dispatch => ({
    getMeetingNotes: (request, app) => dispatch(actions.meetingNotesAction.list(request, app)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard));

import React from 'react';

import { Route, Switch, withRouter, Link } from 'react-router-dom'
import * as actions from '../../../redux/actions/actionCreators'
import { connect } from 'react-redux'
import BaseComponent, { CommonTitle } from '../../BaseComponent';
import Card from '../../container/Card';
import PieChart from './PieChart';

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
        const proportions = [
            {
                value: 0.4,
                label: 'Closed',
                color: 'green'
            },
            {
                value: 0.6,
                label: 'Not Closed',
                color: 'orange'
            }
        ]
        return (
            <div>
                <CommonTitle>Dashboard</CommonTitle>
                <Card title="Welcome" >
                    <p>{this.getLoggedUser().display_name}</p>
                    <p>Bidang {this.props.loggedUser.departement.name}</p>
                </Card>
                <Card title="Statistik">
                    <PieChart proportions={proportions} />
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

import React from 'react';

import { Route, Switch, withRouter, Link } from 'react-router-dom'
import * as actions from '../../../redux/actions/actionCreators'
import { connect } from 'react-redux'
import BaseComponent, { CommonTitle } from '../../BaseComponent';
import Card from '../../container/Card';
import PieChart from './PieChart';
import RecordHistoriesService from './../../../services/RecordHistoriesService';
import { AnchorWithIcon } from './../../buttons/buttons';
import Message from './../../messages/Message';
import Statistic from './Statistic';

class Dashboard extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
        };
    }
    componentWillMount() {

        this.validateLoginStatus();
    }
    componentDidMount() {
        document.title = "Dashboard";
    }

    render() {
        if (this.isLoggedUserNull()) {
            return null;
        }
        return (
            <div>
                <CommonTitle>Dashboard</CommonTitle>
                <Card title="Welcome" >
                    <p>{this.getLoggedUser().display_name}</p>
                    <p>Bidang {this.props.loggedUser.departement.name}</p>
                </Card>
               <Statistic app={this.props.app} />
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

import React, { Component } from 'react';
import Card from '../../container/Card';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import BaseAdminPage from './../BaseAdminPage';
import { CommonTitle } from '../../BaseComponent';
import { connect } from 'react-redux';


class ManagementMenu extends BaseAdminPage {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if (this.isLoggedUserNull() ||
            this.getLoggedUser().role != 'admin') {
            this.backToLogin();
        }
        document.title = "Management"
    }
    render() {
        const columnClass = "column is-one-third";
        return (
            <div>
                <CommonTitle>Master Data Menu</CommonTitle>
                <Card title="Menu">
                    <div className="columns">
                        <div className={columnClass}>
                            <div className="box has-text-centered">
                                <p><i style={{ fontSize: '50px' }} className="fas fa-object-group"></i></p>
                                <Link to="/management/departements">Departements</Link>
                            </div>
                        </div>

                        <div className={columnClass}>
                            <div className="box has-text-centered">
                                <p><i style={{ fontSize: '50px' }} className="fas fa-users"></i></p>
                                <Link to="/management/users">Users</Link>
                            </div>
                        </div>
                    </div>

                </Card>
            </div>
        )
    }
}


const mapStateToProps = state => {

    return {
        loggedUser: state.userState.loggedUser,
        loginStatus: state.userState.loginStatus
    }
}
export default withRouter(
    connect(mapStateToProps)(ManagementMenu));

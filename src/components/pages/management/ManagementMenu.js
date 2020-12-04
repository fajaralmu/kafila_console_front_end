
import React, { Component } from 'react';
import Card from '../../container/Card';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import BaseAdminPage from './../BaseAdminPage';
import { CommonTitle } from '../../BaseComponent';


class ManagementMenu extends BaseAdminPage {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if (this.isLoggedUserNull() ||
        this.props.loggedUser.role != 'admin'
        ) {
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
                        <div  className="columns">
                            <div className={columnClass}>
                                <div className="box has-text-centered">
                                    <p><i style={{fontSize:'50px'}} className="fas fa-puzzle-piece"></i></p>
                                    <Link to="/management/departements">Departements</Link>
                                </div>
                            </div>
                            
                            <div className={columnClass}>
                                <div className="box has-text-centered">
                                <p><i style={{fontSize:'50px'}} className="fas fa-users"></i></p>
                                    <Link to="/management/users">Users</Link>
                                </div>
                            </div>
                        </div>
                  
                </Card>
            </div>
        )
    }
}


export default withRouter(ManagementMenu);
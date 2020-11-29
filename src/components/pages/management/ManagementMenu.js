
import React, { Component } from 'react';
import Card from '../../container/Card';
import { Route, Switch, withRouter, Link } from 'react-router-dom'
import BaseAdminPage from './../BaseAdminPage';


class ManagementMenu extends BaseAdminPage {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        document.title = "Management"
    }
    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>Master Data Menu</h2>
                <Card title="Menu">
                    <aside className="menu">
                        <p className="menu-label">General</p>
                        <ul className="menu-list">
                            <li style={{listStyle:'none'}}><Link to="/management/departements">Departements</Link></li>
                            <li style={{listStyle:'none'}}><Link to="/management/users">Users</Link></li>
                        </ul>
                    </aside>
                </Card>
            </div>
        )
    }
}


export default withRouter(ManagementMenu);
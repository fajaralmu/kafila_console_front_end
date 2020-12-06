import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../BaseComponent';

import BaseMenus from './BaseMenus';

export const MENUS = [
    {
        name: 'Umum',
        children: [
            {
                name: 'Home',
                link: '/home',
                iconClassName: 'fas fa-home',
            }, {
                name: 'Dashboard',
                link: '/dashboard',
                iconClassName: 'fas fa-tachometer-alt',
                authenticated: true,

            }, {
                name: 'Aduan',
                link: '/issues-public',
                iconClassName: 'fas fa-envelope-open-text',
                // authenticated: true,
            }]
    }, {
        name: 'Notulensi',
        children: [{
            name: 'List',
            link: '/meetingnote',
            authenticated: true,
            iconClassName: 'fas fa-list',
        }, {
            name: 'Tambah Notulensi',
            link: '/meetingnote/create',
            authenticated: true,
            iconClassName: 'fas fa-plus-square',
        }]
    }, {
        name: 'Aduan',
        children: [{
            name: 'List',
            link: '/issues',
            authenticated: true,
            iconClassName: 'fas fa-list',
        },
        {
            name: 'Tambah',
            link: '/issues/create',
            authenticated: true,
            iconClassName: 'fas fa-plus-square',
            role: 'admin'
        }]
    }, {
        name: 'Tema Pembahasan',
        children: [{
            name: 'List',
            link: '/discussiontopics',
            authenticated: true,
            iconClassName: 'fas fa-list',
        }]
    }, {
        name: 'Master Data',
        children: [
            {
                name: 'Menu',
                link: '/management',
                authenticated: true,
                role: 'admin',
                // iconClassName: 'fas fa-database'
            },
            {
                name: 'User',
                link: '/management/users',
                authenticated: true,
                role: 'admin',
                iconClassName: 'fas fa-users',
            }, {
                name: 'Bidang',
                link: '/management/departements',
                authenticated: true,
                role: 'admin',
                iconClassName: 'fas fa-object-group',
            }]
    }
]

class SideBar extends BaseMenus {
    constructor(props) {
        super(props);

    }

    render() {
        const user = this.getLoggedUser();
        return (
            <div  >
                <aside className="menu">
                    {MENUS.map((menu, i) => {
                        const childs = this.extractChildren(menu.children);
                        if (childs == null || childs.length == 0) { return null; }
                        const isMenuListShown = this.isMenuListShown(menu.name);
                        const iconClassName = isMenuListShown ? "fas fa-angle-up" : "fas fa-angle-down";

                        return (
                            <React.Fragment key={"menu_" + menu.name}>
                                <p key={menu.name} menu-name={menu.name} onClick={this.toggleMenuList} className="menu-label">
                                    <i style={{ marginRight: '10px' }} className={iconClassName} />
                                    {menu.name}
                                </p>
                                {isMenuListShown ?
                                    <ul className="menu-list">
                                        {childs.map((menuChild, j) => {
                                            return (<li key={"sidebar-menu-child-" + i + "-" + j}>
                                                <Link to={menuChild.link}>
                                                    <span className="icon">
                                                        <i className={menuChild.iconClassName ? menuChild.iconClassName : "fas fa-folder"} />
                                                    </span>
                                                    <spam>
                                                        {menuChild.name}
                                                    </spam>
                                                </Link>
                                            </li>)
                                        })}
                                    </ul>
                                    : null}
                            </React.Fragment>
                        )
                    })}
                </aside>
            </div>
        )
    }

}


const mapStateToProps = state => {
    //console.log(state);
    return {
        //user
        loginStatus: state.userState.loginStatus,
        loggedUser: state.userState.loggedUser,
        menus: state.userState.menus,
        requestId: state.userState.requestId,
        applicationProfile: state.userState.applicationProfile,
    }
}

const mapDispatchToProps = dispatch => ({
    // performLogout: (app) => dispatch(actions.accountAction.performLogout(app)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(SideBar))


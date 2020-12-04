import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from './../BaseComponent';
import './SideBar.css';
import BaseMenus from './BaseMenus';

export const MENUS = [
    {
        name: 'Umum',
        children: [
            {
                name: 'Home',
                link: '/home'
            }, {
                name: 'Dashboard',
                link: '/dashboard',
                authenticated: true,
            }]
    }, {
        name: 'Notulensi',
        children: [{
            name: 'Tambah Notulensi',
            link: '/meetingnote/create',
            authenticated: true,
        }]
    }, {
        name: 'Aduan',
        children: [{
            name: 'List',
            link: '/issues',
            authenticated: true,
        },
        {
            name: 'Tambah',
            link: '/issues/create',
            authenticated: true,
            role: 'admin'
        }]
    }, {
        name: 'Tema Pembahasan',
        children: [{
            name: 'List',
            link: '/discussiontopics',
            authenticated: true,
        }, {
            name: 'Tambah',
            link: '/discussiontopics/create',
            authenticated: true,
        }]
    }, {
        name: 'Master Data',
        children: [
            {
                name: 'Menu',
                link: '/management',
                authenticated: true,
                role: 'admin'
            },
            {
                name: 'User',
                link: '/management/users',
                authenticated: true,
                role: 'admin'
            }, {
                name: 'Bidang',
                link: '/management/departements',
                authenticated: true,
                role: 'admin'
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
                        const iconClassName  = isMenuListShown?"fas fa-angle-up":"fas fa-angle-down";

                        return (
                            <React.Fragment key={"menu_"+menu.name}>
                                <p key={menu.name} menu-name={menu.name} onClick={this.toggleMenuList} className="menu-label"> 
                                    <i style={{marginRight:'10px'}} className={iconClassName}    />                         
                                    {menu.name}
                                </p>
                                {isMenuListShown ?
                                    <ul className="menu-list">
                                        {childs.map((menuChild, j) => {
                                            return (<li key={"sidebar-menu-child-"+i+"-"+j}>
                                                <Link to={menuChild.link}>
                                                    {menuChild.name}
                                                </Link>
                                            </li>)
                                        })}
                                    </ul>
                                    :null}
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


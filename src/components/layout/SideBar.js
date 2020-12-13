import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux'; 

import BaseMenus from './BaseMenus';
import { MENUS } from './../../constant/Menus';
import { mapCommonUserStateToProps } from '../BaseComponent';

class SideBar extends BaseMenus {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div  >
                <ProfileAvatar show={this.isLoggedUserNull()==false} user={this.getLoggedUser()}/>
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
                                                    <span>
                                                        {menuChild.name}
                                                    </span>
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

const ProfileAvatar = (props) => {
    if (props.show == false) {
        return null;
    }
    const user = props.user;
    return (
        <div className="has-text-centered has-text-info" style={{paddingTop:'20px', paddingBottom:'20px'}}>
            <span className="icon" style={{fontSize:'3em'}}>
                <Link to="/profile"><i className="fas fa-user-circle" /></Link>
            </span>
            <h2>{user.display_name}</h2>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    // performLogout: (app) => dispatch(actions.accountAction.performLogout(app)),
})

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(SideBar))


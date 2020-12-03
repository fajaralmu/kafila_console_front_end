
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'

import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
import BaseComponent from './../BaseComponent';
const menus = [
    {
        name:'Home',
        link:'/home'
    }, {
        name:'Dashboard',
        link:'/dashboard',
        authenticated: true,
    }, {
        name:'Tambah Notulensi',
        link:'/meetingnote/create',
        authenticated: true,
    }, {
    }, {
        name:'Daftar Aduan',
        link:'/issues',
        authenticated: true,
    }, {
        name:'Tema Pembahasan',
        link:'/discussiontopics',
        authenticated: true,
    }, {
        name:'Management',
        link:'/management',
        authenticated: true,
        role:'admin'
    }
]

class Header extends BaseComponent{
    constructor(props){
        super(props, false);
        this.state = {
            showBurger:false
        }

        this.toggleNavBurger = () => {
            this.setState({showBurger:!this.state.showBurger})
        }

        this.performLogout = () => {
            const props = this.props;
            this.showConfirmation("Apakah Anda ingin keluar?").then(function(accepted){
                if (accepted) {
                    props.performLogout(props.app);
                }
            });
        }
    }
    render(){

        return (
            <nav className="navbar is-dark topNav">
			<div className="container">
				<div className="navbar-brand">
					<Link style={{backgroundColor:'#fff'}} className="navbar-item" to="/">
						<img src="kiis-stroke.png" width="38" height="38"/>
					</Link>
					<div onClick={this.toggleNavBurger} className="navbar-burger burger">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
				<div id="topNav" className={this.state.showBurger? "is-active navbar-menu":" navbar-menu"}>
					<div className="navbar-start">
                        {
                            menus.map((linkProperty, i)=>{
                                return <AppLink key={"header-link-"+i}loginStatus={this.props.loginStatus} loggedUser={this.props.loggedUser} linkProperty={linkProperty} />
                            })
                        }
					</div>
					<div className="navbar-end">
						<div className="navbar-item">
							<div className="buttons has-addons">
								 
                                    {this.props.loginStatus? 
                                    <><Link className="button is-info" to="/profile">
                                        <span className="icon">
                                            <i className="fas fa-user"></i>
                                        </span>
                                        <span>{this.props.loggedUser.display_name} - {this.props.loggedUser.role}</span>
                                    </Link>
                                    <a onClick={this.performLogout} className="button is-danger">
                                        <span className="icon">
                                            <i className="fas fa-sign-out-alt"></i>
                                        </span>
                                        <span>Logout</span>
                                    </a>
                                    </>:
                                    <Link className="button is-info" to="/login">
										<span className="icon">
											<i className="fas fa-user"></i>
										</span>
										<span>Login</span>
									</Link>
                                    }
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
        )
    }
}

const AppLink = (props) => {
    const linkProperty = props.linkProperty;
    const loginStatus = props.loginStatus;
    const loggedUser = props.loggedUser
    if (null == linkProperty.link){
        return null;
    }

    if (!loginStatus && linkProperty.authenticated) {
        return null;
    }
    if(linkProperty.role != null && loggedUser != null && loggedUser.role != linkProperty.role ) {
        return null;
    }
    return (
        <Link key={linkProperty.name + "LINK"} className="navbar-item"
            to={linkProperty.link} >{linkProperty.name}</Link>
    )
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
    performLogout: (app) => dispatch(actions.accountAction.performLogout(app)),
  })
  
  export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header))
  
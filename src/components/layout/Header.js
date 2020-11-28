
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'

import * as actions from '../../redux/actionCreators'
import { connect } from 'react-redux'
const menus = [
    {
        name:'Home',
        link:'home'
    }, {
        name:'Dashboard',
        link:'dashboard',
        authenticated: true,
    }, {
        name:'Tambah Notulensi',
        link:'create',
        authenticated: true,
    }, {
        name:'Management',
        link:'management',
        authenticated: true,
    }
]

class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            showBurger:false
        }

        this.toggleNavBurger = () => {
            this.setState({showBurger:!this.state.showBurger})
        }
    }
    render(){

        return (
            <nav className="navbar is-light topNav">
			<div className="container">
				<div className="navbar-brand">
					<a className="navbar-item" href="../">
						<img src="favicon.ico" width="38" height="38"/>
					</a>
					<div onClick={this.toggleNavBurger} className="navbar-burger burger">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
				<div id="topNav" className={this.state.showBurger? "is-active navbar-menu":" navbar-menu"}>
					<div className="navbar-start">
                        {
                            menus.map(linkProperty=>{
                                return <AppLink loginStatus={this.props.loginStatus} linkProperty={linkProperty} />
                            })
                        }
					</div>
					<div className="navbar-end">
						<div className="navbar-item">
							<div className="field is-grouped">
								{/* <p className="control">
									<a className="button is-small">
										<span className="icon">
											<i className="fas fa-user-plus"></i>
										</span>
										<span>
											Register
										</span>
									</a>
								</p> */}
								<p className="control">
                                    {this.props.loginStatus? 
                                    <a className="button is-small is-info is-outlined">
                                        <span className="icon">
                                            <i className="fas fa-user"></i>
                                        </span>
                                        <span>{this.props.loggedUser.display_name}</span>
                                    </a>:
                                    <Link className="button is-small is-info is-outlined" to="login">
										<span className="icon">
											<i className="fas fa-user"></i>
										</span>
										<span>Login</span>
									</Link>
                                    }
								</p>
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
    if (!loginStatus && linkProperty.authenticated) {
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
    performLogout: (app) => dispatch(actions.performLogout(app)),
    requestAppId: (app) => dispatch(actions.requestAppId(app)),
    refreshLogin: () => dispatch(actions.refreshLoginStatus()),
  })
  
  export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header))
  
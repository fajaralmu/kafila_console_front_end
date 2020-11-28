
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

class Content extends Component {

  render() {
    return (
      <div className="content"><Switch>
        <Route path="/home" render={
          (props) =>
            <Home />
        } />
         <Route path="/dashboard" render={
          (props) =>
            <Dashboard app={this.props.app} />
        } />
        <Route path="/login" render={
          (props) => <Login app={this.props.app} />
        } />
        {/* ///////////authenticated//////////// */}

      </Switch></div>
    );
  }
}

const Home = (props) => {
  document.title="Home";
  return <div style={{textAlign:'center'}}>
    <h2>Kafila Console</h2>
    <span style={{fontSize:'10em'}}>
      <i className="fas fa-users-cog"></i>
    </span>
  </div>
}

export default Content;
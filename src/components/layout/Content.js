
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import MeetingNoteForm from '../pages/MeetingNoteForm';
import ManagementMenu from './../pages/management/ManagementMenu';
import UsersManagement from '../pages/management/UsersManagement';

class Content extends Component {

  render() {
    return (
      <div className="content">
        <div style={{ height: '20px' }}></div>
        <Switch>
          <Route exact={true} path="/" render={
            (props) =>
              <Home />
          } />
          <Route path="/home" render={
            (props) =>
              <Home />
          } />
          <Route path="/dashboard" render={
            (props) =>
              <Dashboard app={this.props.app} />
          } />
          <Route exact path="/meetingnote/create" render={
            (props) =>
              <MeetingNoteForm app={this.props.app} />
          } />
          <Route exact path="/meetingnote/:id" render={
            (props) =>
              <MeetingNoteForm app={this.props.app} />
          } />

          {/* ========= management ========== */}
          <Route exact path="/management" render={
            (props) =>
              <ManagementMenu app={this.props.app} />
          } />
          <Route exact path="/management/users" render={
            (props) =>
              <UsersManagement app={this.props.app} />
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
  document.title = "Home";
  return <div style={{ textAlign: 'center' }}>
    <h2>Kafila Console</h2>
    <span style={{ fontSize: '10em' }}>
      <i className="fas fa-users-cog"></i>
    </span>
  </div>
}

export default Content;
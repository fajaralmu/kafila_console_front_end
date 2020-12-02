
import React, { Component } from 'react';

import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ManagementMenu from './../pages/management/ManagementMenu';
import UsersManagement from '../pages/management/UsersManagement';
import DepartementManagement from '../pages/management/DepartementManagement';
import UsersManagementForm from '../pages/management/UsersManagementForm';
import DepartementManagementForm from '../pages/management/DepartementManagementForm';
import MeetingNoteForm from '../pages/meetingnotes/MeetingNoteForm';
import MeetingNoteActionForm from '../pages/meetingnotes/MeetingNoteActionForm';
import Profile from '../pages/Profile';
import IssuesList from '../pages/issues/IssuesList';
import IssuesForm from '../pages/issues/IssuesForm';

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
          <Route exact path="/meetingnote/:id/action" render={
            (props) =>
              <MeetingNoteActionForm app={this.props.app} />
          } />
          {/* ======== issues ========= */}
          <Route exact path="/issues" render={
            (props) =>
              <IssuesList app={this.props.app} />
          } />
          <Route exact path="/issues/create" render={
            (props) =>
              <IssuesForm app={this.props.app} />
          } />
          <Route exact path="/issues/:id" render={
            (props) =>
              <IssuesForm app={this.props.app} />
          } />
          {/* ========= management ========== */}
          <Route exact path="/management" render={
            (props) =>
              <ManagementMenu app={this.props.app} />
          } />

          {/* users */}
          <Route exact path="/management/users" render={
            (props) =>
              <UsersManagement app={this.props.app} />
          } />
          <Route exact path="/management/users/create" render={
            (props) =>
              <UsersManagementForm app={this.props.app} />
          } />
          <Route exact path="/management/users/:id" render={
            (props) =>
              <UsersManagementForm app={this.props.app} />
          } />
          {/* departements */}
          <Route exact path="/management/departements" render={
            (props) =>
              <DepartementManagement app={this.props.app} />
          } />
          <Route exact path="/management/departements/create" render={
            (props) =>
              <DepartementManagementForm app={this.props.app} />
          } />
          <Route exact path="/management/departements/:id" render={
            (props) =>
              <DepartementManagementForm app={this.props.app} />
          } />
          <Route path="/login" render={
            (props) => <Login app={this.props.app} />
          } />
          {/* ///////////authenticated//////////// */}
          <Route exact path="/profile" render={
            (props) =>
              <Profile app={this.props.app} />
          } />
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
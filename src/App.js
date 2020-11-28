
import React, { Component } from 'react';
import logo from './logo.svg';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import * as actions from './redux/actionCreators'
import { connect } from 'react-redux'
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import Content from './components/layout/Content';
const blankFunc = function (e) { };

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      menuCode: '',
      loading: false,
      loadingPercentage: 0,
      requestId: null,
      mainAppUpdated: new Date(),
    };

    this.loadings = 0;

    this.alertCallback = {
      title: "Info",
      message: "Info",
      yesOnly: false,
      onOk: () => { },
      onNo: () => { }
    }


    this.setMenuCode = (code) => {
      this.setState({ menuCode: code });
    }

    this.refresh = () => {
      this.setState({ mainAppUpdated: new Date() });
    }

    this.setEnableShopping = (val) => {
      this.setState({ enableShopping: val })
    }

    this.incrementLoadings = function () {
      this.loadings++;
    }

    this.decrementLoadings = function () {
      this.loadings--;
      if (this.loadings < 0) {
        this.loadings = 0;
      }
    }

    this.requestAppId = () => {
      this.props.requestAppId(this);
    }
    this.startLoading = (realtime) => {
      this.incrementLoadings();
      this.setState({ loading: true, realtime: realtime });
    }

    this.endLoading = () => {
      console.log("END LOADING");
      this.decrementLoadings();
      if (this.loadings == 0) {
        this.setState({ loading: false, loadingPercentage: 0 });
      }
    }



    this.routedContent = () => {
      return (<>
        <Switch>
          <Route path="/home" render={
            (props) =>
              <h2>HOME</h2>
          } />

          <Route path="/login" render={
            (props) => <h2>Login</h2>
          } />
          {/* ///////////authenticated//////////// */}

        </Switch>

      </>);
    }

    this.alertDialog = (message, title, yesOnly, onOk, onNo) => {

      this.alertCallback.yesOnly = yesOnly;
      this.alertCallback.onOk = onOk;
      this.alertCallback.onNo = onNo;
      this.alertCallback.message = message;
      this.alertCallback.title = title;
      this.setState({ showInfo: true })

    }

    this.infoDialog = (message) => {
      this.alertDialog(message, "Info", true, blankFunc, blankFunc);
    }

    this.confirmDialog = (message, onOk, onNo) => {
      this.alertDialog(message, "Confirmation", false, onOk, onNo);
    }

  }

  componentDidUpdate() {
    if (this.props.requestId != this.state.requestId) {
      this.setState({ requestId: this.props.requestId });
      this.props.refreshLogin();

    }
  }


  componentDidMount() {
    this.requestAppId();
    this.setState({ loadingPercentage: 0 });
  }

  setMenus() {
    const additionalMenus = this.props.menus ? this.props.menus : [];
    const menus = new Array();
    for (let i = 0; i < additionalMenus.length; i++) {

      const menu = additionalMenus[i];
      const isNotAuthenticated = this.props.loginStatus != true && menu.authenticated == true;
      const isShoppingDisabled = !this.state.enableShopping && menu.code == 'cart';

      if (isNotAuthenticated) { continue; }
      if (isShoppingDisabled) { continue; }

      menus.push(menu);
    }

    return menus;

  }

  render() {

    if (!this.props.requestId) {
      return (<h2>LOADING</h2>)
    }
    return (
      <div className="App">
        {this.state.loading ? <Loading /> : null}
        <Header app={this} />
        <section className="container">
          <div className="columns">
            <div className="column">
              <Content app={this} />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

}


const Loading = () => {
  return (
    <div style={{
      width: '100%',
      zIndex: 1000,
      backgroundColor: 'wheat',
      position: 'fixed',
      textAlign: 'center'
    }}>
      Loading
    </div>
  )
}


const mapStateToProps = state => {
  //console.log(state);
  return {

    //user
    loginStatus: state.userState.loginStatus,
    menus: state.userState.menus,
    requestId: state.userState.requestId,
    applicationProfile: state.userState.applicationProfile, 
  }
}

const mapDispatchToProps = dispatch => ({
  performLogout: (app) => dispatch(actions.accountAction.performLogout(app)),
  requestAppId: (app) => dispatch(actions.accountAction.requestAppId(app)),
  refreshLogin: () => dispatch(actions.refreshLoginStatus()),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))

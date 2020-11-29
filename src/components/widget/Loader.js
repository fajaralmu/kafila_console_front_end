
import React, { Component } from 'react';
export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 1,
      show: true
    }
   
  }

  componentDidUpdate() {
   
  }


  render() {
    if (this.props.show == false) {
      return null;
    }
    return (
      <div className="has-background-info box" style={{
        width: 'min-content',
        zIndex: 500,
        // backgroundColor: 'wheat',
        position: 'fixed',
        textAlign: 'center',
        padding: '5px',
        color: '#ffffff',
        opacity: this.state.opacity
      }}>
        <span className="button is-loading is-info"></span>
              &nbsp;Loading
      </div>
    )
  }
}
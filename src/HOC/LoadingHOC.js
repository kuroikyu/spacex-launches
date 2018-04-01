import React, { Component } from 'react';
import './LoadingHOC.css';

const LoadingHOC = WrappedComponent =>
  class LoadingHOC extends Component {
    render() {
      console.log('loading');
      return this.props.launches.length === 0 ? (
        <div className="loading" />
      ) : (
        <WrappedComponent {...this.props} />
      );
    }
  };

export default LoadingHOC;

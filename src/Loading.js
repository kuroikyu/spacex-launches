import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Loading.css';

class Loading extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const { loading, children } = this.props;
    return loading ? <div className="loading" /> : children;
  }
}

export default Loading;

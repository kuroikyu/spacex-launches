/* eslint react/no-did-mount-set-state: 0 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Launch from './Launch';

export default class LaunchList extends PureComponent {
  static propTypes = {
    launches: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
  };

  render() {
    return (
      <LaunchGrid>
        {this.props.launches.map(launch => (
          <Launch key={launch.flight_number} launch={launch} type={this.props.type} />
        ))}
      </LaunchGrid>
    );
  }
}

const LaunchGrid = styled.div`
  display: grid;
  padding: 1rem;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
`;

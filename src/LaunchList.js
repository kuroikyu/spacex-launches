/* eslint react/no-did-mount-set-state: 0 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Launch from './Launch';
import LoadingHOC from './HOC/LoadingHOC';

class LaunchList extends PureComponent {
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
  font-family: var(--body-font);
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 2em;
  margin: 0 9em;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
    margin: 0 7em;
  }
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1em;
    margin: 0 4em;
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    margin: 0 0.5em;
  }
  @media (max-width: 374px) {
    grid-template-columns: repeat(1, 1fr);
    margin: 0 2em;
  }
`;

export default LoadingHOC(LaunchList);

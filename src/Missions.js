import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import LaunchList from './LaunchList';

const Missions = ({ futureLaunches, pastLaunches }) => (
  <Fragment>
    <h2>Upcoming Missions</h2>
    <LaunchList launches={futureLaunches} type="upcoming" />

    <h2>Past Missions</h2>
    <LaunchList launches={pastLaunches} type="past" reverse />
  </Fragment>
);

Missions.propTypes = {
  futureLaunches: PropTypes.array.isRequired,
  pastLaunches: PropTypes.array.isRequired,
};

export default Missions;

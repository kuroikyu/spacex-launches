/* eslint jsx-a11y/anchor-is-valid: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Launch = ({ launch, type }) => {
  const rocketName = `${launch.rocket.second_stage.payloads[0].payload_id} ${
    launch.rocket.rocket_name
  }`;
  const image = launch.links.mission_patch || 'http://i.imgur.com/eL73Iit.png';
  let launchDate;
  if (launch.launch_date_local) {
    launchDate = moment(launch.launch_date_local).fromNow();
  } else {
    launchDate = `Sometime in ${launch.launch_year}`;
  }
  const linkProps = {
    pathname: `/${type}/${launch.flight_number}`,
    launch,
  };

  const emoji = type === 'past' ? '📆' : '⏱';

  return (
    <Link to={linkProps} className="Launch-link">
      <LaunchWrapper>
        <Poster src={image} alt={rocketName} />
        <RocketDesc>
          {'🚀 '}
          <strong>{launch.flight_number}</strong>
          {` ${launch.rocket.second_stage.payloads[0].payload_id} `}
          <em>{launch.rocket.rocket_name}</em>
        </RocketDesc>
        <LaunchTime>{`${emoji} ${launchDate}`}</LaunchTime>
      </LaunchWrapper>
    </Link>
  );
};

Launch.propTypes = {
  launch: PropTypes.shape({
    flight_number: PropTypes.number,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

Launch.defaultProps = {};

export default Launch;

export const Poster = styled.img`
  width: 50%;
  height: auto;
`;

const LaunchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  width: 100%;
  padding: 1rem 0;
  border-radius: 3px;
  transition: all 150ms ease-in-out;
  &:hover {
    background: #eee;
    box-shadow: 0 10px 15px -10px #555;
  }
`;

const RocketDesc = styled.p`
  margin-top: 1.5rem;
  margin-bottom: 0;
`;

const LaunchTime = styled.p`
  margin-top: 0.5rem;
  margin-bottom: 0;
`;

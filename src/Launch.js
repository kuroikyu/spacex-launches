/* eslint jsx-a11y/anchor-is-valid: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Overdrive from 'react-overdrive';

import NoBadge from './temp-badge.png';

const Launch = ({ launch, type }) => {
  const rocketName = `${launch.rocket.second_stage.payloads[0].payload_id} ${
    launch.rocket.rocket_name
  }`;
  const image = launch.links.mission_patch || '';
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

  return (
    <Link to={linkProps} className="Launch-link">
      <LaunchWrapper>
        <Overdrive id={`${rocketName}-image`} animationDelay={1}>
          <StyledPoster src={image || NoBadge} alt={rocketName} />
        </Overdrive>
        <DetailsWrapper>
          <RocketDesc>
            <Light style={{ marginRight: '0.5em' }}>{launch.flight_number}</Light>
            {rocketName}
          </RocketDesc>
          <Light>{launchDate}</Light>
        </DetailsWrapper>
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
  height: auto;
  width: 65%;
  max-width: 200px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
    width: 14vw;
  }
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    width: 25vw;
  }
  @media (max-width: 374px) {
    grid-template-columns: repeat(1, 1fr);
    width: 45vw;
  }
`;

const StyledPoster = Poster.extend`
  filter: drop-shadow(0 4px 6px rgba(32, 63, 64, 0.2));
  will-change: filter, transform;
  transition: all 150ms ease;
`;

const DetailsWrapper = styled.div`
  margin-top: 0.5rem;
  padding: 1em 0;
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

  div {
    transition: all 150ms ease-in-out;
    margin-left: -1.5em;
    padding-left: 1.5em;
  }
  &:hover {
    ${DetailsWrapper} {
      box-shadow: -3px 0 0px 0px var(--teal), 100px 0 100px -50px rgba(1, 162, 166, 0.08) inset;
    }
    span {
      color: var(--teal) !important;
    }
    ${StyledPoster} {
      transform: translateY(-1px);
      filter: drop-shadow(0 7px 10px rgba(32, 63, 64, 0.2));
    }
  }
`;

const RocketDesc = styled.p`
  margin-top: 0;
  margin-bottom: 0;
`;

const Light = styled.span`
  transition: all 150ms ease;
  color: hsla(181, 25%, 36.1%, 0.6);
`;

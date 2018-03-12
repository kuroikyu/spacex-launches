import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Clock from 'react-feather/dist/icons/clock';
import Calendar from 'react-feather/dist/icons/calendar';

import LaunchList from './LaunchList';

const Missions = ({ futureLaunches, pastLaunches }) => (
  <MissionsWrapper>
    <HeaderWrapper>
      <h1>
        <Logo>
          Space<span>x</span>
        </Logo>
        <Stamp>Launches</Stamp>
      </h1>
    </HeaderWrapper>
    <SectionHeader>
      <HeaderBackground>
        <Clock /> Upcoming Missions
      </HeaderBackground>
      <Line />
    </SectionHeader>
    <LaunchList launches={futureLaunches} type="upcoming" />

    <SectionHeader>
      <HeaderBackground>
        <Calendar /> Past Missions
      </HeaderBackground>
      <Line />
    </SectionHeader>
    <LaunchList launches={pastLaunches} type="past" reverse />
  </MissionsWrapper>
);

Missions.propTypes = {
  futureLaunches: PropTypes.array.isRequired,
  pastLaunches: PropTypes.array.isRequired,
};

export default Missions;

const MissionsWrapper = styled.div`
  margin-bottom: 5em;
`;

const HeaderWrapper = styled.header`
  background: hsla(181, 1%, 99%, 0.6);
  padding-top: 2em;
  padding-bottom: 5.5em;

  @media (max-width: 700px) {
    font-size: 0.8em;
  }
  @media (max-width: 500px) {
    font-size: 0.6em;
  }
  @media (max-width: 300px) {
    font-size: 0.5em;
  }
`;

const Logo = styled.span`
  font-family: var(--header-font);
  color: var(--red);
  font-weight: 400;
  font-size: 1.75em;
  letter-spacing: 0.8em;
  span {
    letter-spacing: normal;
  }
`;

const Stamp = styled.span`
  font-family: var(--header-font);
  color: var(--teal);
  font-weight: 400;
  font-size: 1.1em;
  letter-spacing: 0.1em;

  position: absolute;
  padding: 0 0.5em;
  height: 1em;
  left: calc(50% - 0.75em);
  transform: rotate(-5deg);
  top: 3.75em;

  display: flex;
  justify-content: center;
  &:before {
    content: '';
    position: absolute;
    top: 0.2em;
    width: 100%;
    height: 110%;
    border-radius: 10px;
    box-shadow: 0 0 0 3px var(--teal);
  }
`;

const SectionHeader = styled.h2`
  color: var(--red);
  font-family: var(--header-font);
  font-weight: 400;
  font-size: 2em;
  margin: 2em 0 1.5em 0;
  position: relative;
  display: flex;
  justify-content: center;
  svg {
    margin-right: 0.5em;
  }
  @media (max-width: 700px) {
    font-size: 1.75em;
  }
`;

const HeaderBackground = styled.div`
  position: relative;
  background-color: var(--white);
  padding: 0 1em;
  display: inline-block;
  z-index: 3;
`;

const Line = styled.div`
  position: absolute;
  z-index: 0;
  top: 0.7em;
  left: 0;

  height: 2px;
  width: calc(100vw - 20em);
  margin: 0 10em;

  background-color: var(--red);
`;

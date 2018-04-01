/* eslint jsx-a11y/anchor-is-valid: 0 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ArrowLeft from 'react-feather/dist/icons/arrow-left';
import Overdrive from 'react-overdrive';

import { Poster } from './Launch';
import { TrueOrFalse, Loading } from './helpers';

// other data like images and json files
import NoBadge from './temp-badge.png';

const transitionMs = '0.15s';
const transitionFunc = 'ease';
const wrapperHeight = '5'; // em

const LiPropTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const LiDefaultProps = {
  value: '',
};

const ListedItem = ({ name, value }) => (
  <Li>
    <span>{name}</span>
    <span>{value}</span>
  </Li>
);

const ListedAnchor = ({ name, value }) => (
  <Li>
    <span>{name}</span>
    <span>
      {value && (
        <a href={value} target="_blank" rel="nofollow">
          Link
        </a>
      )}
    </span>
  </Li>
);

ListedItem.propTypes = LiPropTypes;
ListedItem.defaultProps = LiDefaultProps;
ListedAnchor.propTypes = LiPropTypes;
ListedAnchor.defaultProps = LiDefaultProps;

class LaunchDetail extends PureComponent {
  static propTypes = {
    launches: PropTypes.array,
  };

  static defaultProps = { launches: [] };

  state = {
    launch: undefined,
  };

  async componentWillMount() {
    // Scroll to the top
    window.scroll(0, 0);

    this.stretchWrapper();

    document.documentElement.style.setProperty('--wrapper-margin', `${wrapperHeight}em`);

    // Capture flight info from props or fetch it from API
    const { params } = this.props.match;
    const launch =
      this.props.launches.filter(el => el.flight_number === parseInt(params.launchId, 10))[0] ||
      (await this.APIFallback());

    this.setState({ launch });
  }

  componentWillUnmount() {
    // Decrease wrapper's height
    document.documentElement.style.setProperty('--wrapper-margin', this.state.originalMargin);
  }

  stretchWrapper() {
    const dom = document.documentElement;

    // Save original margin size
    const originalMargin = getComputedStyle(dom).getPropertyValue('--wrapper-margin');
    this.setState({ originalMargin });

    // Increase wrapper's height
    document.documentElement.style.setProperty('--wrapper-margin', wrapperHeight);
  }

  async APIFallback() {
    const { params } = this.props.match;
    const isUpcoming = params.folder === 'upcoming' ? params.folder : '';
    const response = await (await fetch(
      `https://api.spacexdata.com/v2/launches/${isUpcoming}/?flight_number=${params.launchId}`
    )).json();
    console.log('Query to Spacex API');
    return response[0];
  }

  render() {
    if (this.state.launch) {
      const { launch } = this.state;
      const image = launch.links.mission_patch || '';
      const rocketName = `${launch.rocket.second_stage.payloads[0].payload_id} ${
        launch.rocket.rocket_name
      }`;
      const launchDate = moment(launch.launch_date_local).format('LLLL');

      return (
        <LaunchWrapper>
          <BackLink to="/">
            <ArrowLeft size="30" />
          </BackLink>
          <LaunchInfo>
            <Overdrive id={`${rocketName}-image`} animationDelay={1}>
              <PosterDetail src={image || NoBadge} alt={rocketName} />
            </Overdrive>
            <DetailsWrapper>
              <MainHeader>{rocketName}</MainHeader>
              <Description>{launch.details}</Description>

              <SecondaryHeader>Launch</SecondaryHeader>
              <DetailsSection>
                <ListedItem name="No." value={launch.flight_number} />
                <ListedItem name="Success" value={TrueOrFalse(launch.launch_success)} />
                <ListedItem name="Date" value={launchDate} />
                <ListedItem name="Site" value={launch.launch_site.site_name_long} />
              </DetailsSection>

              <SecondaryHeader>Rocket</SecondaryHeader>
              <DetailsSection>
                <ListedItem name="Name" value={launch.rocket.rocket_name} />
                <ListedItem name="Type" value={launch.rocket.rocket_type} />

                <SecondaryHeader>First Stage</SecondaryHeader>
                {launch.rocket.first_stage.cores.map(stage => (
                  <DetailsSection key={stage.core_serial}>
                    <ListedItem name="Core Serial" value={stage.core_serial} />
                    <ListedItem name="Flights" value={stage.flight} />
                    <ListedItem name="Block" value={stage.block} />
                    <ListedItem name="Reused" value={TrueOrFalse(stage.reused)} />
                    <ListedItem name="Land Success" value={TrueOrFalse(stage.landing_success)} />
                    <ListedItem name="Landing Type" value={stage.landing_type} />
                    <ListedItem name="Landing Vehicle" value={stage.landing_vehicle} />
                  </DetailsSection>
                ))}

                <SecondaryHeader>Second Stage</SecondaryHeader>
                {launch.rocket.second_stage.payloads.map(payload => (
                  <DetailsSection key={payload.payload_id}>
                    <ListedItem name="Payload ID" value={payload.payload_id} />
                    <ListedItem name="Reused" value={TrueOrFalse(payload.reused)} />
                    <ListedItem name="Customers" value={payload.customers.toString()} />
                    <ListedItem name="Type" value={payload.payload_type} />
                    <ListedItem name="Mass In KG" value={payload.payload_mass_kg} />
                    <ListedItem name="Orbit" value={payload.orbit} />
                  </DetailsSection>
                ))}
              </DetailsSection>

              <SecondaryHeader>Reused</SecondaryHeader>
              <DetailsSection>
                <ListedItem name="Capsule" value={TrueOrFalse(launch.reuse.capsule)} />
                <ListedItem name="Core" value={TrueOrFalse(launch.reuse.core)} />
                <ListedItem name="Fairings" value={TrueOrFalse(launch.reuse.fairings)} />
                <ListedItem name="Side Core 1" value={TrueOrFalse(launch.reuse.side_core1)} />
                <ListedItem name="Side Core 2" value={TrueOrFalse(launch.reuse.side_core2)} />
              </DetailsSection>

              <SecondaryHeader>Links</SecondaryHeader>
              <DetailsSection>
                <ListedAnchor name="Article" value={launch.links.article_link} />
                <ListedAnchor name="Presskit" value={launch.links.presskit} />
                <ListedAnchor name="Reddit Campaign" value={launch.links.reddit_campaign} />
                <ListedAnchor name="Reddit Launch" value={launch.links.reddit_launch} />
                <ListedAnchor name="Reddit Media" value={launch.links.reddit_media} />
                <ListedAnchor name="Reddit Recovery" value={launch.links.reddit_recovery} />
                <ListedAnchor name="Video" value={launch.links.video_link} />
                <ListedAnchor name="Telemetry" value={launch.telemetry.flight_club} />
              </DetailsSection>
            </DetailsWrapper>
          </LaunchInfo>
        </LaunchWrapper>
      );
    }
    return <LoadingStyled />;
  }
}

export default LaunchDetail;

const PosterDetail = Poster.extend`
  height: 200px;
  width: auto;
  filter: drop-shadow(0 4px 6px rgba(32, 63, 64, 0.2));
  will-change: filter, transform;
  transition: all ${transitionMs} ${transitionFunc};
  &:hover {
    transform: translateY(-1px);
    filter: drop-shadow(0 7px 10px rgba(32, 63, 64, 0.2));
  }
  @media (max-width: 700px) {
    height: 100px;
  }
`;

const LoadingStyled = styled(Loading)`
  margin: 0;
  height: 100%;
  position: relative;
  color: var(--white);
  > span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const LaunchWrapper = styled.div`
  font-size: 20px;
  position: relative;
  @media (max-width: 700px) {
    margin-bottom: 4em;
  }
`;

const BackLink = styled(Link)`
  box-sizing: border-box;
  position: absolute;
  top: -${wrapperHeight}rem;
  left: 0;
  padding: ${wrapperHeight / 4}rem;
  color: var(--white);
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const LaunchInfo = styled.div`
  padding: 1.5em 15% 4em 15%;
  text-align: left;
  display: flex;

  img,
  #elp-badge {
    position: relative;
    top: -5rem;
    height: 200px;
    @media (max-width: 700px) {
      height: 150px;
      top: -3em;
    }
  }

  #elp-badge {
    margin: 0;
    font-size: 0.8em;
    &:hover {
      transform: translateY(-1px);
      filter: drop-shadow(0 7px 10px rgba(32, 63, 64, 0.2));
    }
  }

  @media (max-width: 700px) {
    padding: 0 1em 0 0em;
    flex-direction: column;
    font-size: 0.8em;

    img {
      margin: 0 auto;
      margin-top: 1rem;
      margin-bottom: -${wrapperHeight - 2}rem;
    }

    li {
      grid-template-columns: 9em 1fr;
    }
    h1 {
      margin-top: 0.5em;
    }
  }
`;

const DetailsWrapper = styled.div`
  margin-left: 2em;
  display: flex;
  flex-direction: column;
`;

const MainHeader = styled.h1`
  font-family: 'Unica One', sans-serif;
  font-weight: 400;
  color: var(--red);
  font-size: 46px;
  margin: 0;
`;

const DetailsSection = styled.ul`
  font-family: 'Roboto Slab', serif;
  margin-top: 0.25em;
  padding-left: 1.5em;
  box-shadow: -2px 0 0px 0px var(--teal);
  display: grid;
  grid-row-gap: 0.8em;
  will-change: box-shadow;
  transition: box-shadow ${transitionMs} ${transitionFunc};
  &:hover {
    box-shadow: -3px 0 0px 0px var(--teal), 100px 0 100px -50px rgba(1, 162, 166, 0.08) inset;
  }
  > ul {
    box-shadow: none;
    &:hover {
      box-shadow: none;
    }
  }
  + ul {
    margin-top: 1.5em;
  }
`;

const Li = styled.li`
  list-style: none;
  display: grid;
  grid-template-columns: 11.25em 1fr;

  span:first-child {
    color: rgba(69, 113, 115, 0.6);
  }

  span:last-child {
    color: #203f40;
    svg {
      vertical-align: bottom;
    }
  }

  span > a {
    color: var(--teal);
    text-decoration: none;
    will-change: color;
    transition: color ${transitionMs} ${transitionFunc};
    &:hover {
      color: var(--red);
    }
  }
`;

const SecondaryHeader = MainHeader.extend`
  margin-top: 30px;
  font-size: 36px;
`;

const Description = styled.p`
  font-family: 'Roboto Slab', serif;
  margin: 1em 0 1em 1.5em;
`;

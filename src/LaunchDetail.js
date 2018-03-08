/* eslint jsx-a11y/anchor-is-valid: 0 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router-dom';
import ArrowLeft from 'react-feather/dist/icons/arrow-left';

import { Poster } from './Launch';
import { TrueOrFalse, Loading } from './helpers';

// other data like images and json files
import spacexLogo from './data/spacexlogo.png';
import headerImg from './data/detailsHeader.jpg';

const transitionMs = '0.15s';
const transitionFunc = 'ease';

const LiPropTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOf([PropTypes.string, PropTypes.node]).isRequired,
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
ListedAnchor.propTypes = LiPropTypes;

class LaunchDetail extends PureComponent {
  static propTypes = {
    launches: PropTypes.array,
  };

  static defaultProps = { launches: [] };

  state = {
    launch: undefined,
  };

  async componentWillMount() {
    const { params } = this.props.match;
    const launch =
      this.props.launches.filter(el => el.flight_number === parseInt(params.launchId, 10))[0] ||
      (await this.APIFallback());

    this.setState({ launch });
    console.log(launch);
  }

  async APIFallback() {
    const { params } = this.props.match;
    const isUpcoming = params.folder === 'upcoming' ? params.folder : '';
    const response = await (await fetch(
      `https://api.spacexdata.com/v2/launches/${isUpcoming}/?flight_number=${params.launchId}`,
    )).json();
    console.log('Query to Spacex API');
    return response[0];
  }

  render() {
    if (this.state.launch) {
      const { launch } = this.state;
      const image = launch.links.mission_patch || spacexLogo;
      const rocketName = `${launch.rocket.second_stage.payloads[0].payload_id} ${
        launch.rocket.rocket_name
      }`;
      const launchDate = moment(launch.launch_date_local).format('LLLL');

      return (
        <LaunchWrapper backdrop={headerImg}>
          <Backdrop />
          <BackLink to="/">
            <ArrowLeft size="40" />
          </BackLink>
          <LaunchInfo>
            <PosterDetail src={image} alt={rocketName} />
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
          <Footerino />
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
`;

const LoadingStyled = styled(Loading)`
  margin: 0;
  height: 100%;
  position: relative;
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
  padding-top: 14em;
`;

const Backdrop = styled.div`
  background: red;
  background: URL(${headerImg}) no-repeat;
  background-size: cover;
  background-position: center bottom;
  position: absolute;
  left: 0;
  top: 0;
  height: 15.5em;
  width: 100%;
  z-index: -1000;
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  margin: 0.25em;
  padding: 0.5em;
  font-size: 2em;
  color: white;
  text-decoration: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const LaunchInfo = styled.div`
  background-color: #f2f5f5;
  padding: 1.5em 15% 4em 15%;
  text-align: left;
  display: flex;
  box-shadow: 0 -5px 10px 0 rgba(32, 63, 64, 0.2);
  img {
    position: relative;
    top: -5rem;
  }
  p {
    color: #203f40;
  }
`;

const DetailsWrapper = styled.div`
  margin-left: 3em;
  display: flex;
  flex-direction: column;
`;

const MainHeader = styled.h1`
  font-family: 'Unica One', sans-serif;
  font-weight: 400;
  color: #a6110f;
  font-size: 46px;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const DetailsSection = styled.ul`
  font-family: 'Roboto Slab', serif;
  margin-top: 0.25em;
  padding-left: 1.5em;
  box-shadow: -2px 0 0px 0px #01a2a6;
  display: flex;
  flex-direction: column;
  will-change: box-shadow;
  transition: box-shadow ${transitionMs} ${transitionFunc};
  &:hover {
    box-shadow: -3px 0 0px 0px #01a2a6, 100px 0 100px -50px rgba(1, 162, 166, 0.08) inset;
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
  padding: 0.75em 0;
  height: 1em;
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
    color: #01a2a6;
    text-decoration: none;
    will-change: color;
    transition: color ${transitionMs} ${transitionFunc};
    &:hover {
      color: #a6110f;
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
  font-size: 1em;
`;

const Footerino = styled.div`
  height: 4.5em;
  width: 100%;
  background: #203f40;
`;

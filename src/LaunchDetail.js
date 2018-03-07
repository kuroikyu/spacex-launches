/* eslint react/no-did-mount-set-state: 0 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import { Poster } from './Launch';

// other data like images and json files
import spacexLogo from './data/spacexlogo.png';
import headerImg from './data/spacexrocket.jpg';

const transitionMs = '0.15s';
const transitionFunc = 'ease';

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

const Loading = ({ className }) => (
  <h3 className={className}>
    <span className="loading-animation">Loading</span>
  </h3>
);

Loading.propTypes = {
  className: PropTypes.string,
};

Loading.defaultProps = {
  className: '',
};

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

const TrueOrFalse = val => (val ? <span>&#x2713; Yes</span> : <span>&times; No</span>);

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
    // const launch = this.props.location.launch || (await this.APIFallback());
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
    // const headerImg = 'http://www.spacex.com/sites/spacex/files/styles/new_gallery_large/public/2016_-_06_crs8_landed2.jpg?itok=w4ndFkxW';
    if (this.state.launch) {
      const { launch } = this.state;
      const image = launch.links.mission_patch || spacexLogo;
      const rocketName = `${launch.rocket.second_stage.payloads[0].payload_id} ${
        launch.rocket.rocket_name
      }`;
      const launchDate = moment(launch.launch_date_local).format('LLLL');

      return (
        <LaunchWrapper backdrop={headerImg}>
          <LaunchInfo>
            <PosterDetail src={image} alt={rocketName} />
            <DetailsWrapper>
              <MainHeader>{rocketName}</MainHeader>
              <Description>{launch.details}</Description>

              <SecondaryHeader>Launch</SecondaryHeader>
              <DetailsSection>
                <Li>
                  <span>No.</span>
                  <span>{launch.flight_number}</span>
                </Li>
                <Li>
                  <span>Success</span>
                  <span>{TrueOrFalse(launch.launch_success)}</span>
                </Li>
                <Li>
                  <span>Date</span>
                  <span>{launchDate}</span>
                </Li>
                <Li>
                  <span>Site</span>
                  <span>{launch.launch_site.site_name_long}</span>
                </Li>
              </DetailsSection>

              <SecondaryHeader>Rocket</SecondaryHeader>
              <DetailsSection>
                <Li>
                  <span>Name</span>
                  <span>{launch.rocket.rocket_name}</span>
                </Li>
                <Li>
                  <span>Type</span>
                  <span>{launch.rocket.rocket_type}</span>
                </Li>

                <SecondaryHeader>First Stage</SecondaryHeader>
                {launch.rocket.first_stage.cores.map(stage => (
                  <DetailsSection key={stage.core_serial}>
                    <Li>
                      <span>Core Serial</span>
                      <span>{stage.core_serial}</span>
                    </Li>
                    <Li>
                      <span>Flights</span>
                      <span>{stage.flight}</span>
                    </Li>
                    <Li>
                      <span>Block</span>
                      <span>{stage.block}</span>
                    </Li>
                    <Li>
                      <span>Reused</span>
                      <span>{TrueOrFalse(stage.reused)}</span>
                    </Li>
                    <Li>
                      <span>Land Success</span>
                      <span>{TrueOrFalse(stage.landing_success)}</span>
                    </Li>
                    <Li>
                      <span>Landing Type</span>
                      <span>{stage.landing_type}</span>
                    </Li>
                    <Li>
                      <span>Landing Vehicle</span>
                      <span>{stage.landing_vehicle}</span>
                    </Li>
                  </DetailsSection>
                ))}

                <SecondaryHeader>Second Stage</SecondaryHeader>
                {launch.rocket.second_stage.payloads.map(payload => (
                  <DetailsSection key={payload.payload_id}>
                    <Li>
                      <span>Payload ID</span>
                      <span>{payload.payload_id}</span>
                    </Li>
                    <Li>
                      <span>Reused</span>
                      <span>{TrueOrFalse(payload.reused)}</span>
                    </Li>
                    <Li>
                      <span>Customers</span>
                      <span>{payload.customers.toString()}</span>
                    </Li>
                    <Li>
                      <span>Type</span>
                      <span>{payload.payload_type}</span>
                    </Li>
                    <Li>
                      <span>Mass In KG</span>
                      <span>{payload.payload_mass_kg}</span>
                    </Li>
                    <Li>
                      <span>Orbit</span>
                      <span>{payload.orbit}</span>
                    </Li>
                  </DetailsSection>
                ))}
              </DetailsSection>

              <SecondaryHeader>Reused</SecondaryHeader>
              <DetailsSection>
                <Li>
                  <span>Capsule</span>
                  <span>{TrueOrFalse(launch.reuse.capsule)}</span>
                </Li>
                <Li>
                  <span>Core</span>
                  <span>{TrueOrFalse(launch.reuse.core)}</span>
                </Li>
                <Li>
                  <span>Fairings</span>
                  <span>{TrueOrFalse(launch.reuse.fairings)}</span>
                </Li>
                <Li>
                  <span>Side Core 1</span>
                  <span>{TrueOrFalse(launch.reuse.side_core1)}</span>
                </Li>
                <Li>
                  <span>Side Core 2</span>
                  <span>{TrueOrFalse(launch.reuse.side_core2)}</span>
                </Li>
              </DetailsSection>

              <SecondaryHeader>Links</SecondaryHeader>
              <DetailsSection>
                <Li>
                  <span>Article</span>
                  <span>
                    {launch.links.article_link && (
                      <a href={launch.links.article_link} target="_blank" rel="nofollow">
                        Link
                      </a>
                    )}
                  </span>
                </Li>
                <Li>
                  <span>Presskit</span>
                  <span>
                    {launch.links.presskit && (
                      <a href={launch.links.presskit} target="_blank" rel="nofollow">
                        Link
                      </a>
                    )}
                  </span>
                </Li>
                <Li>
                  <span>Reddit Campaign</span>
                  <span>
                    {launch.links.reddit_campaign && (
                      <a href={launch.links.reddit_campaign} target="_blank" rel="nofollow">
                        Link
                      </a>
                    )}
                  </span>
                </Li>
                <Li>
                  <span>Reddit Launch</span>
                  <span>
                    {launch.links.reddit_launch && (
                      <a href={launch.links.reddit_launch} target="_blank" rel="nofollow">
                        Link
                      </a>
                    )}
                  </span>
                </Li>
                <Li>
                  <span>Reddit Media</span>
                  <span>
                    {launch.links.reddit_media && (
                      <a href={launch.links.reddit_media} target="_blank" rel="nofollow">
                        Link
                      </a>
                    )}
                  </span>
                </Li>
                <Li>
                  <span>Reddit Recovery</span>
                  <span>
                    {launch.links.reddit_recovery && (
                      <a href={launch.links.reddit_recovery} target="_blank" rel="nofollow">
                        Link
                      </a>
                    )}
                  </span>
                </Li>
                <Li>
                  <span>Video</span>
                  <span>
                    {launch.links.video_link && (
                      <a href={launch.links.video_link} target="_blank" rel="nofollow">
                        Link
                      </a>
                    )}
                  </span>
                </Li>
                <Li>
                  <span>Telemetry</span>
                  <span>
                    {launch.telemetry.flight_club && (
                      <a href={launch.telemetry.flight_club} target="_blank" rel="nofollow">
                        Link
                      </a>
                    )}
                  </span>
                </Li>
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

const LaunchWrapper = styled.div`
  font-size: 20px;
  position: relative;
  padding-top: 300px;
  background: URL(${props => props.backdrop}) no-repeat;
  background-size: contain;
  background-position: top center;
`;

const LaunchInfo = styled.div`
  background-color: #f2f5f5;
  padding: 1.5em 15% 4em 15%;
  text-align: left;
  display: flex;
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
  background: #01a2a6;
`;

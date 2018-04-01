/* eslint jsx-a11y/anchor-is-valid: 0 */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'normalize.css';
import styled from 'styled-components';

import Missions from './Missions';
import LaunchDetail from './LaunchDetail';
import './App.css';

const futureLaunchesURI = 'https://api.spacexdata.com/v2/launches/upcoming';
const pastLaunchesURI = 'https://api.spacexdata.com/v2/launches';

class App extends Component {
  state = {
    futureLaunches: [],
    pastLaunches: [],
  };

  async componentWillMount() {
    const { futureLaunches, pastLaunches } = this.state;
    // 1. Check if both launches array are populated &&
    //    Fetch data from spacex api if they are empty
    const futureFromAPI = futureLaunches.length
      ? [...futureLaunches]
      : await this.fetchFromAPI(futureLaunchesURI);

    const pastFromAPI = pastLaunches.length
      ? [...pastLaunches]
      : await this.fetchFromAPI(pastLaunchesURI, true);

    // 2. Push results to state
    if (!futureLaunches.length || !pastLaunches.length) {
      this.setState({
        futureLaunches: futureFromAPI,
        pastLaunches: pastFromAPI,
      });
    }
  }

  fetchFromAPI = async (URI, reverse) => {
    console.log(`Query to Spacex API: ${URI}`);
    const launches = await (await fetch(URI)).json();
    const sorted = reverse ? launches.sort((a, b) => b.flight_number - a.flight_number) : launches;
    return sorted;
  };

  render() {
    console.log('Render App');
    const { futureLaunches, pastLaunches } = this.state;

    return (
      <Router basename={process.env.PUBLIC_URL}>
        <MainContainer>
          <AppWrapper className="App">
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Missions
                    futureLaunches={futureLaunches}
                    pastLaunches={pastLaunches}
                    {...props}
                  />
                )}
              />
              <Route
                path="/:folder/:launchId"
                render={props => (
                  <LaunchDetail launches={[...futureLaunches, ...pastLaunches]} {...props} />
                )}
              />
            </Switch>
          </AppWrapper>
          <Footer>
            <p>
              All data and images are property of Space Exploration Technologies Corporation (
              <a href="https://spacex.com" target="_blank" rel="noopener noreferrer">
                SpaceX
              </a>)
            </p>
            <p>
              Built using the API maintained by{' '}
              <a href="https://www.reddit.com/r/spacex/" target="_blank" rel="noopener noreferrer">
                /r/spacex
              </a>
              {' on '}
              <a
                href="https://github.com/r-spacex/SpaceX-API"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </p>
            <p>
              Made with love in 2018 by{' '}
              <a href="https://kuroikyu.com" target="_blank" rel="noopener noreferrer">
                Kuroi Kyu
              </a>
            </p>
          </Footer>
        </MainContainer>
      </Router>
    );
  }
}

const AppWrapper = styled.div`
  background: var(--white);
  margin-top: var(--wrapper-margin);
  margin-bottom: 4.5em;
  transition: margin 0.15s ease;
  box-shadow: 0 3px 6px 0 rgba(32, 63, 64, 0.2);
`;

const Footer = styled.footer`
  margin-bottom: 4.5em;
  padding: 0 1em;
  text-align: center;
  font-family: 'Roboto Slab', serif;
  color: var(--white);
  a {
    color: var(--white);
    text-decoration: none;
    box-shadow: 0 2px 0 var(--white);
    transition: box-shadow 0.15s ease;
    &:hover {
      box-shadow: 0 4px 0 var(--white);
    }
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default App;

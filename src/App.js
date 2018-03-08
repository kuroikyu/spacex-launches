/* eslint jsx-a11y/anchor-is-valid: 0 */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import 'normalize.css';

import Missions from './Missions';
import LaunchDetail from './LaunchDetail';
import spacexlogo from './data/spacexlogo.png';
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
    console.log('Query to Spacex API');
    const launches = await (await fetch(URI)).json();
    const sorted = reverse ? launches.sort((a, b) => b.flight_number - a.flight_number) : launches;
    return sorted;
  };

  render() {
    const { futureLaunches, pastLaunches } = this.state;

    console.log('Render App');

    return (
      <Router>
        <div className="App">
          {/* <header className="App-header">
            <Link to="/">
              <img src={spacexlogo} className="App-logo" alt="SpaceX logo" />
            </Link>
          </header> */}
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Missions futureLaunches={futureLaunches} pastLaunches={pastLaunches} {...props} />
              )}
            />
            <Route
              path="/:folder/:launchId"
              render={props => (
                <LaunchDetail launches={[...futureLaunches, ...pastLaunches]} {...props} />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;

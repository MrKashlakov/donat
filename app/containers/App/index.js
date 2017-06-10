/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import withProgressBar from 'components/ProgressBar';
import { Event, Socket } from 'react-socket-io';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
    };
  }

  onMessage(message) {
    console.log('------ START -----');
    console.log(message);
    console.log('------- END -------');
  }

  render() {
    const options = { transport: ['websocket'] };
    return (
      <Socket uri="http://localhost:5000" options={options}>
        <Event event="donation alert" handler={this.onMessage} />
      </Socket>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default withProgressBar(App);

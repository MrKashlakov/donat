/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import styled from 'styled-components';

import Alert from 'components/Alert';
import withProgressBar from 'components/ProgressBar';
import { Event, Socket } from 'react-socket-io';

const Wrapper = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;
  padding: 21px;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: [],
    };
  }

  onMessage(alert) {
    const alerts = Array.isArray(this.state.alerts) ? this.state.alerts : [];
    this.setState({
      alerts: [...alerts, alert]
    });
  }

  getAlert() {
    if (Array.isArray(this.state.alerts) && this.state.alerts.length !== 0) {
      const alert = this.state.alerts[0];

      setTimeout(() => {
        this.setState({
          alerts: this.state.alerts.slice(1),
        });
      }, 30000);

      return (
        <Alert username={alert.username} sum={alert.sum} message={alert.message} />
      );
    }
    return null;
  }

  render() {
    const options = { transport: ['websocket'] };
    return (
      <Socket uri="http://localhost:5000" options={options}>
        <Wrapper>
          <Event event="donation alert" handler={(alert) => this.onMessage(alert)} />
          {this.getAlert()}
        </Wrapper>
      </Socket>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default withProgressBar(App);

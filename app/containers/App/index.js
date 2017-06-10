/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Header from 'components/Header';
import Footer from 'components/Footer';
import withProgressBar from 'components/ProgressBar';
import Alert from 'components/Alert';

const Wrapper = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;
  padding: 21px;
`;

export function App(props) {
  return (
    <Wrapper>
      <Alert username="@test" sum="10" message="Hi! Donation here!!"/>
    </Wrapper>
  );
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default withProgressBar(App);

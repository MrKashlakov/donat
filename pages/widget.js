import React from 'react';
import {
  Html,
  Widget,
} from '../components';

export default ({ _id }) => (
  <Html page="widget">
    <Widget _id={_id} />
  </Html>
);



import React from 'react';
import {
  Html,
  AddWidget,
  Widgets,
} from '../components';

export default ({ widgets }) => (
  <Html>
    <AddWidget />
    <Widgets widgets={widgets} />
  </Html>
);


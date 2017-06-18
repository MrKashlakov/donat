import React from 'react';
import {
  Html,
  AddWidget,
  Widgets
} from '.';

export default ({ widgets }) => (
  <Html>
    <AddWidget />
    <Widgets widgets={widgets} />
  </Html>
);


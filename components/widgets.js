import React from 'react';
import { Widget } from '.';

export default ({ widgets }) => (
  <div>{widgets.map(({ _id }, key) => (
    <Widget key={key} _id={_id} />
  ))}</div>
);


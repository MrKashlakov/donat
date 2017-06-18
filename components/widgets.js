import React from 'react';
import { Widget } from '.';

export default ({ widgets }) => (
  <ul>
    {widgets.map(({ _id }, key) => (
      <li key={key}>
        <Widget _id={`${_id}`} />
      </li>
    ))}
  </ul>
);


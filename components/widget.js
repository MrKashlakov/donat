import React from 'react';

export default ({ _id }) => (
  <a href={`/widget?id=${_id}`}>widget {_id}</a>
);


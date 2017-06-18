import React from 'react';

export default ({ action, params }) => (
  <form method="post" action={action}>
    {Object.keys(params).map((name, key) => (
      <input key={key} type="hidden" name={name} value={params[name]} />
    ))}
    <button type="submit">Redirect</button>
  </form>
);


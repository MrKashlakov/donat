import React from 'react';
import { Html } from '../components';

export default ({ account }) => (
  <form method="post">
    <input type="hidden" name="account" value={account} />
    <input type="radio" name="type" value="wallet" defaultChecked={true} />
    <input type="radio" name="type" value="card" />
    <input type="number" name="amount" />
    <button type="submit">Pay</button>
  </form>
);


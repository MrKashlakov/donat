
export default ({ account }) => createElement('form', {
  method: 'post',
}, createElement('input', {
  type: 'hidden',
  name: 'account',
  value: account,
}), createElement('input', {
  type: 'radio',
  name: 'type',
  value: 'wallet',
  defaultChecked: true,
}), createElement('input', {
  type: 'radio',
  name: 'type',
  value: 'card',
}), createElement('input', {
  type: 'number',
  name: 'amount',
}), createElement('button', {
  type: 'submit',
}, 'Pay'));

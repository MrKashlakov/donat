
export default ({ action, params }) => createElement('form', {
  method: 'post',
  action,
}, Object.keys(params).map((name, key) => createElement('input', {
  key,
  type: 'hidden',
  name,
  value: params[name],
})), createElement('button', {
  type: 'submit',
}, 'Redirect'));

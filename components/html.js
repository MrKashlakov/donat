import React from 'react';

export default ({ page, children }) => (
  <html>
    <head>
      <title>Donat</title>
      {page === undefined ? null : (<script defer src={`/static/${page}.js`}></script>)}
    </head>
    <body>
      <div id="app">{children}</div>
    </body>
  </html>
);


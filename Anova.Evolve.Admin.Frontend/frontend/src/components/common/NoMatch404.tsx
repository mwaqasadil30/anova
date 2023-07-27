import React from 'react';
import { RouteComponentProps } from 'react-router';

const NoMatch404 = ({ location }: RouteComponentProps) => (
  <div style={{ textAlign: 'center' }}>
    {/* TODO: Make a nice 404 page */}
    <h3>
      Unable to find a page for <code>{location.pathname}</code>
    </h3>
  </div>
);

export default NoMatch404;

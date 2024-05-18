/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
const pageNotFound = require('images/404-not-found-t.jpg');

export default function NotFound() {
  return (
    <img
      src={pageNotFound}
      alt="Page Not Found 404"
      height="100%"
      width="100%"
    />
  );
}

import React from 'react';
import Helmet from 'react-helmet';
import { CLIENT_URL } from 'themes/config';

const HelmetCanonical = ({ ...props }) => {
  let canonical = CLIENT_URL;
  if (window && window.location) {
    const { pathname, search } = window.location;
    if (search !== '' || pathname !== '/') {
      canonical = `${canonical}${pathname}${search}`;
    }
  }
  return (
    <Helmet {...props}>
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
};

export default HelmetCanonical;

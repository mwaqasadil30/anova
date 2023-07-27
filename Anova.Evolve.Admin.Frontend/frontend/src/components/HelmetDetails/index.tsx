import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router';
import { getPageTitleForPathname } from 'utils/routes';

const HelmetDetails = () => {
  const { pathname } = useLocation();
  const pageTitle = getPageTitleForPathname(pathname);

  return (
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet>
  );
};

export default HelmetDetails;

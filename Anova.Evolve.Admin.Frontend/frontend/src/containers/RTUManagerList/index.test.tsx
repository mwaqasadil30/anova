import React from 'react';
import { render } from 'utils/test-utils';
import SiteManagerList from '.';

it('renders the page header', () => {
  const { getByText } = render(<SiteManagerList />);
  expect(getByText('RTU Manager')).toBeInTheDocument();
});

import React from 'react';
import { render } from 'utils/test-utils';
import DataChannelManagerList from '.';

it('renders the page header', () => {
  const { getByText } = render(<DataChannelManagerList />);
  expect(getByText('Data Channel Manager')).toBeInTheDocument();
});

import React from 'react';
import { render } from 'utils/test-utils';
import PollScheduleManager from '.';

it('renders the page header', () => {
  const { getByText } = render(<PollScheduleManager />);
  expect(getByText('Poll Schedule Manager')).toBeInTheDocument();
});

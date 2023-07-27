import React from 'react';
import { render } from 'utils/test-utils';
import AssetGroupEditor from '.';

it('renders the page header', () => {
  const { getByText } = render(<AssetGroupEditor />);
  expect(getByText('Edit Asset Group')).toBeInTheDocument();
});

import React from 'react';
import { render } from 'utils/test-utils';
import AssetGroupList from './index';

describe('AssetGroupList', () => {
  it('renders without crashing', () => {
    const { getAllByText } = render(<AssetGroupList />);
    const result = getAllByText('Asset Group Manager');
    expect(result.length).toEqual(1);
  });
});

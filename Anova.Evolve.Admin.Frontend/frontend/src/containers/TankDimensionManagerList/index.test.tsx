import React from 'react';
import { render } from 'utils/test-utils';
import TankDimensionManagerList from './index';

describe('TankDimensionManagerList', () => {
  it('renders without crashing', () => {
    const { getAllByText } = render(<TankDimensionManagerList />);
    const result = getAllByText('Tank Dimensions Manager');
    expect(result.length).toEqual(1);
  });
});

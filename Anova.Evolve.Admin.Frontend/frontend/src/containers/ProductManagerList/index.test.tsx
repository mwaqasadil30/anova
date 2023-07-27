import React from 'react';
import { render } from 'utils/test-utils';
import ProductManagerList from './index';

describe('ProductManagerList', () => {
  it('renders without crashing', () => {
    const { getAllByText } = render(<ProductManagerList />);
    const result = getAllByText('Product Manager');
    expect(result.length).toEqual(1);
  });
});

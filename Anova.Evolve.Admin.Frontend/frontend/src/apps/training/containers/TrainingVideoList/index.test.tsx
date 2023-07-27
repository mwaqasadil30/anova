import React from 'react';
import { render } from 'utils/test-utils';
import TrainingVideoList from './index';

describe('TrainingVideoList', () => {
  it('renders without crashing', () => {
    const { getAllByText } = render(<TrainingVideoList />);
    const result = getAllByText('Welcome to the Anova Training Hub');
    expect(result.length).toEqual(1);
  });
});

import React from 'react';

interface Props {
  value: number;
  onIncrement: () => void;
  onIncrementAsync: () => void;
  onDecrement: () => void;
  onIncrementIfOdd: () => void;
}

const SagasCounter = ({
  value,
  onIncrement,
  onIncrementAsync,
  onDecrement,
  onIncrementIfOdd,
}: Props) => (
  <p>
    Clicked: {value} times{' '}
    <button type="button" onClick={onIncrement}>
      +
    </button>{' '}
    <button type="button" onClick={onDecrement}>
      -
    </button>{' '}
    <button type="button" onClick={onIncrementIfOdd}>
      Increment if odd
    </button>{' '}
    <button type="button" onClick={onIncrementAsync}>
      Increment async
    </button>
  </p>
);

export default SagasCounter;

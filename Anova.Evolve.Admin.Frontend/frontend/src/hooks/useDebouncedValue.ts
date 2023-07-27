import React from 'react';
import useDebounce from 'react-use/lib/useDebounce';

const useDebouncedValue = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useDebounce(
    () => {
      setDebouncedValue(value);
    },
    delay,
    [value, delay]
  );

  return debouncedValue;
};

export default useDebouncedValue;

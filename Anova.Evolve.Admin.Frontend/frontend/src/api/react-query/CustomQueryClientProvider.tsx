import { queryClient } from 'api/react-query/helpers';
// import { ReactQueryDevtools } from 'react-query/devtools';
import React from 'react';
import { QueryClientProvider } from 'react-query';

interface Props {
  children: React.ReactNode;
}

const CustomQueryClientProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Optionally enable react-query devtools here if needed */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      {children}
    </QueryClientProvider>
  );
};

export default CustomQueryClientProvider;

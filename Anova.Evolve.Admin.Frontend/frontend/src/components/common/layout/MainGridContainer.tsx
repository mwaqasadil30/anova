import React from 'react';

interface Props {
  children: React.ReactNode;
}

// Container used to align content on the center of the page.
// This is kind of like a bootstrap <div class="container"></div>
const MainGridContainer = ({ children }: Props) => {
  // TODO: Use a bootstrap container/other sort of layout
  return <div>{children}</div>;
};

export default MainGridContainer;

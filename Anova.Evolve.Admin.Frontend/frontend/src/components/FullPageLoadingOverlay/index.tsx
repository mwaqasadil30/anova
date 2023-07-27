import React from 'react';
import styled from 'styled-components';
import CircularProgress from 'components/CircularProgress';

const Overlay = styled.div<{ $transparentBackground?: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  ${(props) =>
    !props.$transparentBackground && 'background-color: rgba(0, 0, 0, 0.2);'}
  z-index: ${(props) => props.theme.zIndex.tooltip + 1};
  width: 100%;
  height: 100vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  transparentBackground?: boolean;
}

const FullPageLoadingOverlay = ({ transparentBackground }: Props) => {
  return (
    <Overlay $transparentBackground={transparentBackground}>
      <CircularProgress />
    </Overlay>
  );
};

export default FullPageLoadingOverlay;

import CircularProgress from 'components/CircularProgress';
import DefaultTransition, {
  DefaultTransitionProps,
} from 'components/common/animations/DefaultTransition';
import MessageBlock from 'components/MessageBlock';
import React from 'react';
import styled from 'styled-components';

const PositionRelativeWrapper = styled.div`
  position: relative;
`;

const TransitionLoadingSpinner = (props: DefaultTransitionProps) => {
  return (
    // Absolute positioning is needed to prevent janking when the transition
    // is entering/exiting
    <PositionRelativeWrapper>
      <DefaultTransition unmountOnExit {...props}>
        <MessageBlock position="absolute" width="100%">
          <CircularProgress />
        </MessageBlock>
      </DefaultTransition>
    </PositionRelativeWrapper>
  );
};

export default TransitionLoadingSpinner;

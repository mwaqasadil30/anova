import Typography from '@material-ui/core/Typography';
import DefaultTransition, {
  DefaultTransitionProps,
} from 'components/common/animations/DefaultTransition';
import MessageBlock from 'components/MessageBlock';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const PositionRelativeWrapper = styled.div`
  position: relative;
`;

interface Props extends DefaultTransitionProps {
  message?: React.ReactNode;
}

const TransitionErrorMessage = ({ message, ...props }: Props) => {
  const { t } = useTranslation();
  const formattedMessage =
    message || t('ui.common.defaultError', 'An unexpected error occurred');

  return (
    // Absolute positioning is needed to prevent janking when the transition
    // is entering/exiting
    <PositionRelativeWrapper>
      <DefaultTransition unmountOnExit {...props}>
        <MessageBlock position="absolute" width="100%">
          <Typography variant="body2" color="error">
            {formattedMessage}
          </Typography>
        </MessageBlock>
      </DefaultTransition>
    </PositionRelativeWrapper>
  );
};

export default TransitionErrorMessage;

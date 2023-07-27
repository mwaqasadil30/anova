/* eslint-disable indent */
import Slide, { SlideProps } from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as CheckmarkIcon } from 'assets/icons/enabled-check.svg';
import Alert from 'components/Alert';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledSnackbar = styled(Snackbar)`
  margin-top: -24px;
`;

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  padding-top: 2px;
`;

const StyledAlert = styled(Alert)`
  border-radius: 0 0 10px 10px;
  background-color: #3bb573;
  height: 28px;
  & .MuiAlert-icon {
    padding: 3px 0;
  }
  & .MuiAlert-message {
    padding: 4px 0;
  }
`;

const StyledAlertText = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
`;

type TransitionProps = Omit<SlideProps, 'direction'>;

const SlideTransition = (props: TransitionProps) => (
  <Slide {...props} direction="down" />
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Styled outside this component to align itself depending on the icon used.
  customIcon?: React.ReactNode;
  customMessage?: React.ReactNode;
}

// "as React.RefObject..." solution on line 70: https://stackoverflow.com/a/63130433
const SuccessSnackbar = React.forwardRef((props: Props, ref) => {
  const { t } = useTranslation();
  const { isOpen, onClose, customIcon, customMessage } = props;
  return (
    <StyledSnackbar
      TransitionComponent={SlideTransition}
      autoHideDuration={5000}
      disableWindowBlurListener
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isOpen}
      onClose={onClose}
    >
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <StyledAlert icon={!customIcon ? <StyledCheckmarkIcon /> : customIcon}>
          <StyledAlertText>
            {!customMessage
              ? t('ui.common.changesSavedSuccess', 'Changes saved successfully')
              : customMessage}
          </StyledAlertText>
        </StyledAlert>
      </div>
    </StyledSnackbar>
  );
});

export default SuccessSnackbar;

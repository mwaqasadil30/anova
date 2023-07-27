import Typography from '@material-ui/core/Typography';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize.commonFontSize};
  font-weight: 400;
`;

export interface DeletionWarningDialogProps {
  children: React.ReactNode;
  errorMessage?: React.ReactNode;
  open: boolean;
  isDeleting?: boolean;
  hasError?: boolean;
  recordCount: number;
  handleConfirm: () => void;
  handleCancel: () => void;
}

const DeletionWarningDialog = ({
  children,
  open,
  isDeleting,
  hasError,
  errorMessage,
  recordCount,
  handleConfirm,
  handleCancel,
}: DeletionWarningDialogProps) => {
  const { t } = useTranslation();

  const mainTitle = t('ui.common.deleteConfirmation', 'Delete Confirmation');
  const confirmationButtonText = t('ui.common.delete', 'Delete');
  const mainContentText = t(
    'ui.common.areYouSureConfirmation',
    'Are you sure you would like to delete the following {{count}} items?',
    { count: recordCount }
  );

  return (
    <UpdatedConfirmationDialog
      open={open}
      maxWidth="sm"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      content={
        <>
          <StyledText>{mainContentText}</StyledText>
          {children}
        </>
      }
      confirmationButtonText={confirmationButtonText}
      closeDialog={handleCancel}
      onConfirm={handleConfirm}
      isDisabled={isDeleting}
      isError={hasError}
      customErrorMessage={errorMessage}
    />
  );
};

export default DeletionWarningDialog;

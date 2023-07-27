import { DialogProps } from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import UpdatedConfirmationDialog from '../UpdatedConfirmationDialog';

const DialogText = styled(Typography)`
  && {
    font-size: 1rem;
    text-align: center;
  }
`;

interface FormDialogProps extends DialogProps {
  content?: React.ReactNode;
  open: boolean;
  errors?: string | string[];
  icon?: React.ReactNode;
  mainTitle?: React.ReactNode;
  onConfirm: () => void;
}

const FormErrorDialog = ({
  open,
  errors,
  mainTitle,
  onConfirm,
  ...dialogProps
}: FormDialogProps) => {
  const { t } = useTranslation();

  const formattedMainTitle =
    mainTitle || t('ui.formErrorDialog.title', 'Save Operation Failed!');

  const hasMultipleErrors = Array.isArray(errors) && !!errors.length;

  return (
    <UpdatedConfirmationDialog
      open={open}
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={formattedMainTitle}
      content={
        <>
          {hasMultipleErrors && (
            <DialogText>
              <strong>
                {t('ui.formErrorDialog.errorPretext', 'System errors:')}
              </strong>
            </DialogText>
          )}

          {hasMultipleErrors ? (
            <ul>
              {(errors as string[]).map((error) => (
                <li key={error}>
                  <DialogText variant="body2" color="error">
                    {error}
                  </DialogText>
                </li>
              ))}
            </ul>
          ) : errors ? (
            <DialogText variant="body2" color="error">
              {errors}
            </DialogText>
          ) : null}
        </>
      }
      onConfirm={onConfirm}
      hideCancelButton
      {...dialogProps}
    />
  );
};

export default FormErrorDialog;

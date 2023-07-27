import * as React from 'react';
// import { styled } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import SaveButton from 'components/buttons/SaveButton';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}
const DialogTitleContainer = styled.div`
  padding: 10px;
  position: relative;
  height: 1.9rem;
  min-width: 350px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.custom.domainSecondaryColor};
  color: ${(props) => props.theme.palette.common.white};
`;
const IconCloseButton = styled(IconButton)`
  position: absolute;
  right: 0;
  color: ${(props) => props.theme.palette.grey[500]};
`;

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitleContainer {...other}>
      <Typography variant="caption">{children}</Typography>
      {onClose ? (
        <IconCloseButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconCloseButton>
      ) : null}
    </DialogTitleContainer>
  );
};
type ChannelsNewTemplateModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  onSaveTemplate?: () => void;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  error?: string;
};
const ChannelsNewTemplateModal = ({
  isOpen,
  handleClose,
  onSaveTemplate,
  description,
  setDescription,
  error,
}: ChannelsNewTemplateModalProps) => {
  const { t } = useTranslation();
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography>
            {t('ui.rtuhorner.saveasnewtemplate', 'Save as New Template')}
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {t('ui.common.description', 'Description')}
          </Typography>
          <StyledTextField
            value={description}
            onChange={(event) => {
              setDescription(event?.target?.value);
            }}
            error={error !== undefined && error?.length > 0}
          />
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box display="block" textAlign="center" width="100%">
            <SaveButton
              onClick={() => {
                onSaveTemplate?.();
              }}
              variant="contained"
            />
          </Box>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
};
export default ChannelsNewTemplateModal;

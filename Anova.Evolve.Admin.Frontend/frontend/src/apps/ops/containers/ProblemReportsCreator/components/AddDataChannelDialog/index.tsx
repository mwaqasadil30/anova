import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import {
  DataChannel_SummaryDto,
  ProblemReportAffectedDataChannelDto,
} from 'api/admin/api';
import AddAffectedDataChannelsManagerList from 'apps/ops/containers/ProblemReportsEditor/components/AddAffectedDataChannelsManagerList';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import { FieldArrayRenderProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface AddAffectedDataChannelDialogProps {
  open: boolean;
  hasError?: boolean;
  arrayHelpers: FieldArrayRenderProps;
  handleClose: () => void;
}

const AddAffectedDataChannelDialog = ({
  open,
  hasError,
  arrayHelpers,
  handleClose,
}: AddAffectedDataChannelDialogProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedRows, setSelectedRows] = useState<DataChannel_SummaryDto[]>(
    []
  );

  const handleAddSelectedAffectedDataChannels = (
    affectedDataChannel: DataChannel_SummaryDto
  ) => {
    setSelectedRows([...selectedRows, affectedDataChannel]);
  };

  const addSelectedAffectedDataChannels = () => {
    selectedRows.forEach((selectedRow) => {
      arrayHelpers.push(
        ProblemReportAffectedDataChannelDto.fromJS({
          ...selectedRow,
          isPrimary: false,
          isFaulty: false,
        })
      );
    });
  };

  const mainTitle = t(
    // Not sure why it uses addshipto but its in the en/translation file
    'ui.problemreport.addshipto',
    'Add Data Channel'
  );
  const confirmationButtonText = t(
    'ui.problemreport.addselected',
    'Add Selected'
  );
  const customErrorMessage = t(
    'ui.problemReport.failedToRetrieveDataChannels',
    'Failed to retrieve affected data channels'
  );

  return (
    <UpdatedConfirmationDialog
      open={open}
      maxWidth="md"
      isMdOrLarger
      PaperProps={{
        style: {
          backgroundColor:
            theme.palette.type === 'dark' ? '#666666' : '#f8f8f8',
        },
      }}
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      content={
        <Box m={3}>
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="flex-start"
            justify="center"
          >
            <Grid item xs={12}>
              <AddAffectedDataChannelsManagerList
                handleAddSelectedAffectedDataChannels={
                  handleAddSelectedAffectedDataChannels
                }
              />
            </Grid>
          </Grid>
        </Box>
      }
      confirmationButtonText={confirmationButtonText}
      closeDialog={() => {
        handleClose();
        setSelectedRows([]);
      }}
      onConfirm={() => {
        addSelectedAffectedDataChannels();
        setSelectedRows([]);
        handleClose();
      }}
      isConfirmationButtonDisabled={selectedRows.length === 0}
      isError={hasError}
      customErrorMessage={customErrorMessage}
    />
  );
};

export default AddAffectedDataChannelDialog;

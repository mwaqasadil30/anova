/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DataChannelDTO } from 'api/admin/api';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import DraggableDataChannelList from 'components/DraggableDataChannelList';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import { getDataChannelDTODescription } from 'utils/ui/helpers';
import { useUpdateDisplayPriority } from '../hooks/useUpdateDisplayPriority';
import { DisplayPriorityItem } from '../types';

const StyledHelpText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

interface Props<T> {
  assetId: string;
  dataChannelResult: DataChannelDTO[];
  isUpdateDisplayPriorityDialogOpen: boolean;
  closeUpdateDisplayPriorityDialog: () => void;
  setDataChannelsResult: (dataChannels: DataChannelDTO[]) => void;
}

function UpdateDisplayPriorityDndDialog<T extends DisplayPriorityItem>({
  assetId,
  dataChannelResult,
  isUpdateDisplayPriorityDialogOpen,
  closeUpdateDisplayPriorityDialog,
  setDataChannelsResult,
}: Props<T>) {
  const { t } = useTranslation();

  const theme = useTheme();

  const initialDisplayPriority = dataChannelResult.reduce((prev, current) => {
    prev[current.dataChannelId!] = current.displayPriority!;
    return prev;
  }, {} as { [key: string]: number });

  const [updatedDisplayPriority, setUpdatedDisplayPriority] = useState<{
    [key: string]: number;
  }>(initialDisplayPriority);

  const defaultDisplayPriorities: DisplayPriorityItem[] = [];

  const handleFormatDisplayPriorities = (
    displayPriorities: DisplayPriorityItem[]
  ) => {
    const displayPriorityList = displayPriorities.reduce(
      (prev, current, currentIndex) => {
        prev[current.id] = currentIndex;
        return prev;
      },
      {} as { [key: string]: number }
    );

    setUpdatedDisplayPriority(displayPriorityList);
  };

  const formattedDisplayProperties: DisplayPriorityItem[] = dataChannelResult.map(
    (dataChannel) =>
      ({
        id: dataChannel.dataChannelId!,
        content: dataChannel.description || '',
        description: getDataChannelDTODescription(dataChannel),
        rtuDeviceId: dataChannel.rtuDeviceId,
        channelNumber: dataChannel.channelNumber,
      } || defaultDisplayPriorities)
  );
  const items = formattedDisplayProperties;

  const updateDataChannelDisplayPriorityApi = useUpdateDisplayPriority();

  const { isLoading, isError } = updateDataChannelDisplayPriorityApi;

  const handleUpdateDisplayPriority = () => {
    updateDataChannelDisplayPriorityApi
      .mutateAsync({
        assetId,
        displayPriorityList: updatedDisplayPriority,
      })
      .then(() => {
        const priorityList = Object.entries(updatedDisplayPriority)
          .map(([dataChannelId, displayPriority]) => ({
            dataChannelId,
            displayPriority,
          }))
          .sort((a, b) => a.displayPriority - b.displayPriority);

        const updatedDataChannelResultOrder: DataChannelDTO[] = [];
        priorityList.forEach((item) => {
          const associatedDataChannel = dataChannelResult.find(
            (dataChannel) => dataChannel.dataChannelId === item.dataChannelId
          );
          if (associatedDataChannel) {
            updatedDataChannelResultOrder.push(associatedDataChannel);
          }
        });

        setDataChannelsResult(updatedDataChannelResultOrder);
      })
      .then(closeUpdateDisplayPriorityDialog);
  };

  const mainTitle = t(
    'ui.assetdetail.updatedisplaypriority',
    'Update Display Priority'
  );
  const confirmationButtonText = t('ui.common.save', 'Save');

  return (
    <UpdatedConfirmationDialog
      open={isUpdateDisplayPriorityDialogOpen}
      maxWidth="xs"
      mainTitle={mainTitle}
      content={
        <Box m={3} mt={1} mb={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledHelpText>
                {t(
                  'ui.assetdetail.draganddroptoupdatedisplayorder',
                  'Drag And Drop To Update Display Order'
                )}
                :
              </StyledHelpText>
            </Grid>
            <Grid item xs={12}>
              <DraggableDataChannelList
                id="dnd-display-priority-input"
                className="draggable-form-control"
                items={items}
                onChange={handleFormatDisplayPriorities}
                theme={theme}
              />
            </Grid>
          </Grid>
        </Box>
      }
      confirmationButtonText={confirmationButtonText}
      closeDialog={() => {
        updateDataChannelDisplayPriorityApi.reset();
        closeUpdateDisplayPriorityDialog();
      }}
      onConfirm={handleUpdateDisplayPriority}
      isDisabled={isLoading}
      isError={isError}
    />
  );
}

export default UpdateDisplayPriorityDndDialog;

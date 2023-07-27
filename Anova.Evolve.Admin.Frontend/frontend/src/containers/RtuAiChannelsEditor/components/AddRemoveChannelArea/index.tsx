import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { brandYellow } from 'styles/colours';
import { useTranslation } from 'react-i18next';
import { ChannelType } from 'containers/RtuAiChannelsEditor/types';

const CaptionGrid = styled(Grid)`
  display: flex;
  justify-content: center;
  align-self: center;
`;
type AddRemoveChannelAreaProps = {
  channelCount?: number;
  onDeleteRows: () => void;
  onAddRow: () => void;
  channelType: ChannelType;
};
const AddRemoveChannelArea = ({
  channelCount,
  onDeleteRows,
  onAddRow,
  channelType,
}: AddRemoveChannelAreaProps) => {
  const { t } = useTranslation();
  return (
    <Box mb={1}>
      <Grid container spacing={2}>
        <Grid item>
          <Button onClick={onDeleteRows}>
            <DeleteOutlineIcon htmlColor={brandYellow} />{' '}
            {t('ui.common.deleteselected', 'Delete Selected')}
          </Button>
        </Grid>
        <Grid item>
          <Button onClick={onAddRow}>
            <AddIcon htmlColor={brandYellow} />{' '}
            {channelType === 'AICHANNEL'
              ? t('ui.rtu.addaichannel', 'Add AI Channel')
              : t('ui.rtu.addtchannel', 'Add T Channel')}
          </Button>
        </Grid>
        <CaptionGrid item xs>
          <Typography variant="body2">
            {channelType === 'AICHANNEL'
              ? t('ui.rtu.aichannels', 'AI Channels')
              : t('ui.rtu.tchannels', 'T Channels')}
            {` `}({channelCount || 0})
          </Typography>
        </CaptionGrid>
      </Grid>
    </Box>
  );
};
export default AddRemoveChannelArea;

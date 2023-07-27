/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { AssetMapDataChannelInfo } from 'api/admin/api';
import MajorText from 'components/typography/MajorText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { formatModifiedDatetime } from 'utils/format/dates';
import { buildDataChannelTypeTextMapping } from 'utils/i18n/enum-to-text';
import {
  DataChannelLevelIcon,
  getTankColorForInventoryStatus,
  renderImportance,
} from 'utils/ui/helpers';
import { CardDateText } from '../../styles';
// import Map from './Map';

const AssetPanelMajorText = styled(Typography)`
  font-weight: 600;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.primary};
`;

const BorderlessPaperBox = styled(Box)`
  border: none;
`;

const BorderBottomPaperBox = styled(Box)`
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  background-color: ${(props) => props.theme.palette.background.paper};
`;

interface Props {
  // asset?: AssetDetailDto | null;
  dataChannel?: AssetMapDataChannelInfo | null;
}

const DataChannelSnippet = ({ dataChannel }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  const productAndDataChannelType = [
    dataChannel?.productName,
    dataChannelTypeTextMapping[dataChannel?.dataChannelType!],
  ]
    .filter(Boolean)
    .join(' ');

  const formattedEventDescriptions = () => {
    if (dataChannel?.eventStatus) {
      return dataChannel?.eventStatus.replace(',', ', ');
    }
    return '';
  };
  const joinedEventDescriptions = formattedEventDescriptions();

  const highestEventImportanceLevel = dataChannel?.eventImportanceLevel;
  const highestEventImportanceIcon = renderImportance(
    highestEventImportanceLevel
  );
  const ianaTimezoneId = useSelector(selectCurrentIanaTimezoneId);
  const latestReadingTimestamp = formatModifiedDatetime(
    dataChannel?.readingTime,
    ianaTimezoneId
  );

  const assetColor = getTankColorForInventoryStatus(
    dataChannel?.eventInventoryStatusId,
    theme.palette.type
  );

  return (
    <BorderBottomPaperBox
      minHeight="145px"
      boxSizing="border-box"
      style={{ width: '100%' }}
      px={2}
    >
      <BorderBottomPaperBox
        width="100%"
        textAlign="left"
        boxSizing="border-box"
        mr={0}
        py={1}
      >
        <Grid container>
          <Grid item xs={11}>
            <MajorText
              display="inline"
              title={dataChannel?.dataChannelDescription || ''}
              aria-label="Data channel description"
              style={{ fontSize: '12px' }}
            >
              {dataChannel?.dataChannelDescription || ''}
            </MajorText>
          </Grid>
          <Grid item xs={1}>
            <Grid container alignItems="center" justify="flex-end">
              {highestEventImportanceIcon && (
                <Grid item xs={12} style={{ textAlign: 'right' }}>
                  {highestEventImportanceIcon}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </BorderBottomPaperBox>

      <BorderlessPaperBox
        width="100%"
        height="calc(100% - 10px)"
        boxSizing="border-box"
        mr={0}
        pr={3}
        pl={3}
        py={2}
        display="inline-block"
        position="relative"
      >
        <Grid
          container
          spacing={10}
          alignItems="flex-start"
          justify="flex-start"
          style={{ height: '100%' }}
        >
          <Grid item xs={12}>
            <Grid container justify="space-between">
              <Grid item xs={3}>
                <Box textAlign="center" mx="auto" mt="4px">
                  <DataChannelLevelIcon
                    importanceLevel={highestEventImportanceLevel}
                    decimalPlaces={dataChannel?.decimalPlaces}
                    inventoryStatus={dataChannel?.eventInventoryStatusId}
                    tankType={dataChannel?.tankType}
                    tankFillPercentage={dataChannel?.percentfull}
                  />
                </Box>
              </Grid>

              <Grid item xs={8} style={{ margin: '0 auto' }}>
                <AssetPanelMajorText
                  align="left"
                  title={productAndDataChannelType}
                  aria-label="Data channel type"
                >
                  {productAndDataChannelType || '-'}
                </AssetPanelMajorText>
                <AssetPanelMajorText
                  align="left"
                  title={joinedEventDescriptions || '-'}
                  aria-label="Importance level"
                >
                  <span
                    style={{
                      color: assetColor,
                    }}
                  >
                    {joinedEventDescriptions || '-'}
                  </span>
                </AssetPanelMajorText>
                <CardDateText
                  align="left"
                  title={latestReadingTimestamp}
                  aria-label="Latest reading timestamp"
                >
                  {latestReadingTimestamp || '-'}
                </CardDateText>
              </Grid>
              <Grid item xs={1}>
                <ChevronRightIcon />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </BorderlessPaperBox>
    </BorderBottomPaperBox>
  );
};

export default DataChannelSnippet;

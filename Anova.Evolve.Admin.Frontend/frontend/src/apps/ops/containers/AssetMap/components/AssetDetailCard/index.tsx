/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
  AssetDetailDto,
  CustomPropertyDataType,
  EvolveAssetMapAssetInfoRecord,
  UserPermissionType,
} from 'api/admin/api';
import opsRoutes from 'apps/ops/routes';
import { StyledCustomBoxTitleAsButton } from 'components/StyledCustomBoxTitle';
import round from 'lodash/round';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, Link } from 'react-router-dom';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { massageCustomProperties } from 'utils/api/custom-properties';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { formatModifiedDatetime } from 'utils/format/dates';
import { isNumber } from 'utils/format/numbers';
import {
  DataChannelLevelIcon,
  getDataChannelDTODescription,
  getHighestPriorityEventRuleInventoryStatus,
  renderImportance,
} from 'utils/ui/helpers';
import { CardDateText } from '../../styles';
import ListComponent from '../ListComponent';

const StyledBox = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.paper};
  border: 1px solid ${(props) => props.theme.custom.palette.table.borderColor};
`;

const BoxWithPrimaryText = styled(Box)`
  color: ${(props) => props.theme.palette.text.primary};
`;

export const AssetPanelMajorText = styled(Typography)`
  font-weight: 600;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.primary};
`;

export const AssetPanelMinorText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

export const DetailCardWrapper = styled(Box)`
  height: 100%;
  width: 320px;
  display: flex;
  flex-direction: column;
`;

interface Props {
  asset?: AssetDetailDto | null;
  selectedDataChannelId: string | null;
  setSelectedSiteAsset: (asset: EvolveAssetMapAssetInfoRecord | null) => void;
  setSelectedAssetDetails: (asset: AssetDetailDto | null) => void;
  setZoomToSelectedSiteKey: React.Dispatch<React.SetStateAction<string>>;
}

const AssetDetailCard = ({
  asset,
  selectedDataChannelId,
  setSelectedSiteAsset,
  setSelectedAssetDetails,
  setZoomToSelectedSiteKey,
}: Props) => {
  const { t } = useTranslation();
  const customProperties = asset?.customProperties;
  const formattedCustomProperties = massageCustomProperties(customProperties);
  const hasPermission = useSelector(selectHasPermission);
  const canReadSiteNotes = hasPermission(
    UserPermissionType.SiteNotes,
    AccessType.Read
  );
  const canReadAssetNotes = hasPermission(
    UserPermissionType.AssetNotes,
    AccessType.Read
  );
  const canReadCustomProperties = hasPermission(
    UserPermissionType.AssetCustomProperties,
    AccessType.Read
  );

  const dataChannels = asset?.dataChannels;
  const dataChannel = dataChannels?.find(
    (dc) => dc.dataChannelId === selectedDataChannelId
  );

  const productAndDataChannelType = getDataChannelDTODescription(dataChannel);

  const valueAndUnitsAsText =
    isNumber(dataChannel?.uomParams?.latestReadingValue) &&
    dataChannel?.uomParams?.unit
      ? `${round(
          dataChannel?.uomParams?.latestReadingValue!,
          dataChannel.uomParams.decimalPlaces || 0
        )} ${dataChannel?.uomParams?.unit}`
      : '';
  const enabledEvents = dataChannel?.uomParams?.eventRules;
  const activeEvents = enabledEvents?.filter(
    (activeEvent) => activeEvent.isActive
  );
  const activeEventDescriptions = activeEvents?.map((item) => item.description);
  const eventImportanceLevels = activeEvents
    ?.map((item) => item.importanceLevel)
    .filter(isNumber)
    .sort((a, b) => b! - a!);

  const highestEventImportanceLevel = eventImportanceLevels?.[0];
  const highestEventImportanceIcon = renderImportance(
    highestEventImportanceLevel
  );
  const ianaTimezoneId = useSelector(selectCurrentIanaTimezoneId);
  const latestReadingTimestamp = formatModifiedDatetime(
    dataChannel?.latestReadingTimestamp,
    ianaTimezoneId
  );
  const joinedAddress = [
    asset?.siteInfo?.address1,
    asset?.siteInfo?.city,
    asset?.siteInfo?.state,
    asset?.siteInfo?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const contactNameAndPhone = [
    asset?.siteInfo?.customerContactName,
    asset?.siteInfo?.customerContactPhone,
  ]
    .filter(Boolean)
    .map((ci, i) => (
      <React.Fragment key={i}>
        {ci}
        <br />
      </React.Fragment>
    ));

  const inventoryStatus = getHighestPriorityEventRuleInventoryStatus(
    dataChannel?.uomParams?.eventRules
  );
  const assetId = asset?.assetId;

  return (
    <DetailCardWrapper>
      <StyledCustomBoxTitleAsButton
        fullWidth
        onClick={() => {
          setSelectedSiteAsset(null);
          setSelectedAssetDetails(null);
          // Reset the zoom to site key so if the user selects another data
          // channel within the same site, it'll still zoom into it
          setZoomToSelectedSiteKey('');
        }}
      >
        <Grid container justify="flex-start" alignItems="center">
          <Grid item xs={1} style={{ lineHeight: 0 }}>
            <ChevronLeftIcon />
          </Grid>
          <Grid item xs={11} aria-label="Asset title">
            {asset?.assetTitle}
          </Grid>
        </Grid>
      </StyledCustomBoxTitleAsButton>

      <StyledBox
        width="100%"
        minHeight="155px"
        boxSizing="border-box"
        mr={0}
        pr={3}
        pl={3}
        display="inline-block"
        position="relative"
        borderBottom="none"
      >
        {/* Manual Data Entry drawer */}
        <Box p="6px" height="calc(100% - 10px)" paddingTop={4}>
          <Grid
            container
            alignItems="flex-start"
            justify="flex-start"
            style={{ height: '100%' }}
          >
            <Grid item xs={12}>
              <Grid container justify="space-between">
                <Grid item xs={3}>
                  <Box textAlign="center" mx="auto" mt="4px">
                    <DataChannelLevelIcon
                      importanceLevel={dataChannel?.eventImportanceLevel}
                      decimalPlaces={dataChannel?.uomParams?.decimalPlaces}
                      inventoryStatus={inventoryStatus}
                      tankType={dataChannel?.tankType}
                      tankFillPercentage={
                        dataChannel?.uomParams?.latestReadingValueInPercentFull
                      }
                    />
                  </Box>
                </Grid>

                <Grid item xs={9} style={{ margin: '0 auto' }}>
                  <AssetPanelMajorText
                    title={productAndDataChannelType}
                    aria-label="Data Channel Type"
                  >
                    {productAndDataChannelType}
                  </AssetPanelMajorText>
                  <AssetPanelMinorText
                    title={valueAndUnitsAsText}
                    aria-label="Value and units"
                  >
                    {valueAndUnitsAsText || <em>-</em>}
                  </AssetPanelMinorText>
                  <CardDateText
                    title={latestReadingTimestamp}
                    aria-label="Latest reading timestamp"
                  >
                    {latestReadingTimestamp || <>&nbsp;</>}
                  </CardDateText>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ marginBottom: 16 }}>
              {activeEventDescriptions && activeEventDescriptions?.length > 0 && (
                <Grid container justify="flex-start" alignContent="flex-start">
                  {activeEventDescriptions?.map((aEvent, indexKey) => (
                    <React.Fragment key={indexKey}>
                      <Grid item xs={3} />
                      <Grid item xs={1}>
                        <Box textAlign="left">
                          <AssetPanelMajorText title="...">
                            {highestEventImportanceIcon}
                          </AssetPanelMajorText>
                        </Box>
                      </Grid>
                      <Grid item xs={8}>
                        <Box textAlign="left">
                          <AssetPanelMajorText
                            title={aEvent || ' '}
                            aria-label="Importance level"
                          >
                            {aEvent}
                          </AssetPanelMajorText>
                        </Box>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              )}
              <Grid
                container
                justify="space-between"
                alignContent="center"
                alignItems="center"
              >
                {/* TODO: update each datachannel type with proper icon */}
                <Grid item xs={12}>
                  <MuiLink
                    component={Link}
                    to={generatePath(opsRoutes.assetSummary.detail, {
                      assetId,
                    })}
                    // onClick={() => onClick?.(assetId)}
                  >
                    <BoxWithPrimaryText
                      textAlign="right"
                      height={24}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <AssetPanelMajorText
                        title={t('ui.assetdetail.detailsTab', 'Details')}
                        aria-label="Asset details"
                      >
                        {t('ui.assetdetail.detailsTab', 'Details')}
                      </AssetPanelMajorText>
                      <ChevronRightIcon />
                    </BoxWithPrimaryText>
                  </MuiLink>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </StyledBox>
      {/* LOWER PORTION OF DETAIL CARD */}
      <StyledBox
        width="100%"
        boxSizing="border-box"
        display="flex"
        flexGrow={1}
        mr={0}
        pt={3}
        pr={3}
        pl={3}
        position="relative"
        style={{ overflowY: 'auto' }}
      >
        <AutoSizer style={{ width: '100%' }}>
          {() => (
            <Box p="6px" width="100%">
              <Grid
                container
                alignItems="flex-start"
                alignContent="flex-start"
                justify="flex-start"
              >
                {/* TODO: Include logic to condtionally render geo coordinates 
        based on presence of GPS datachannel. If no GPS, use siteInfo */}
                <Grid item xs={12} style={{ marginBottom: 25 }}>
                  <Grid container justify="space-between">
                    <Grid item xs={12} style={{ margin: '0 auto' }}>
                      <AssetPanelMajorText>
                        {asset?.siteInfo?.customerName ||
                          t('ui.common.none', 'None')}
                      </AssetPanelMajorText>
                      <AssetPanelMinorText
                        title={asset?.siteInfo?.latitude?.toString()}
                        aria-label="Site address details"
                      >
                        {joinedAddress || t('ui.common.none', 'None')}
                      </AssetPanelMinorText>
                    </Grid>
                  </Grid>
                </Grid>

                {/* TODO: Create helper to fetch timezone 
        based on asset GPS lat/lon */}
                <Grid item xs={12} style={{ marginBottom: 25 }}>
                  <Grid container justify="space-between">
                    <Grid item xs={6} style={{ margin: '0 auto' }}>
                      <AssetPanelMajorText>
                        {t('ui.common.latitude', 'Latitude')}
                      </AssetPanelMajorText>
                      <AssetPanelMinorText
                        title={asset?.siteInfo?.latitude?.toString()}
                        aria-label="latitude"
                      >
                        {asset?.siteInfo?.latitude}
                      </AssetPanelMinorText>
                    </Grid>
                    <Grid item xs={6} style={{ margin: '0 auto' }}>
                      <AssetPanelMajorText>
                        {t('ui.common.longitude', 'Longitude')}
                      </AssetPanelMajorText>
                      <AssetPanelMinorText
                        title={asset?.siteInfo?.longitude?.toString()}
                        aria-label="longitude"
                      >
                        {asset?.siteInfo?.longitude}
                      </AssetPanelMinorText>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} style={{ marginBottom: 25 }}>
                  <Grid item xs={12} style={{ margin: '0 auto' }}>
                    <AssetPanelMajorText>
                      {t('ui.common.timezone', 'Time Zone')}
                    </AssetPanelMajorText>
                    <AssetPanelMinorText aria-label="Time zone">
                      {/* TODO: IMPORTANT DETERMINE HOW THIS IS TRANSLATED */}
                      {asset?.siteInfo?.siteTimeZoneDisplayName}
                    </AssetPanelMinorText>
                  </Grid>
                </Grid>

                <Grid item xs={12} style={{ marginBottom: 25 }}>
                  <AssetPanelMajorText>
                    {t('ui.assetdetail.contact', 'Contact')}
                  </AssetPanelMajorText>
                  <AssetPanelMinorText aria-label="Contact phone">
                    {contactNameAndPhone.length > 0 ? contactNameAndPhone : '-'}
                  </AssetPanelMinorText>
                </Grid>

                {canReadSiteNotes && (
                  <Grid item xs={12} style={{ marginBottom: 25 }}>
                    <AssetPanelMajorText>
                      {t('ui.assetdetail.sitenotes', 'Site Notes')}
                    </AssetPanelMajorText>
                    <AssetPanelMinorText aria-label="Site notes">
                      {asset?.siteInfo?.siteNotes ||
                        t('ui.common.none', 'None')}
                    </AssetPanelMinorText>
                  </Grid>
                )}

                {canReadAssetNotes && (
                  <Grid item xs={12} style={{ marginBottom: 25 }}>
                    <AssetPanelMajorText>
                      {t('ui.assetdetail.assetnotes', 'Asset Notes')}
                    </AssetPanelMajorText>
                    <AssetPanelMinorText aria-label="Asset notes">
                      {asset?.assetNotes || t('ui.common.none', 'None')}
                    </AssetPanelMinorText>
                  </Grid>
                )}

                {canReadCustomProperties && (
                  <Grid item xs={12} style={{ marginBottom: 25 }}>
                    <AssetPanelMajorText>
                      {t(
                        'ui.assetdetail.customproperties',
                        'Custom Properties'
                      )}
                    </AssetPanelMajorText>
                    <List
                      component="nav"
                      aria-label="asset information list"
                      dense
                    >
                      {formattedCustomProperties.map(
                        (customProperty, index, array) => {
                          const isLast = index === array.length - 1;
                          return (
                            <React.Fragment key={index}>
                              <ListComponent
                                titleText={customProperty.name}
                                contentText={
                                  customProperty.dataType ===
                                  CustomPropertyDataType.Boolean
                                    ? formatBooleanToYesOrNoString(
                                        customProperty.value,
                                        t
                                      )
                                    : customProperty.value
                                }
                              />
                              {!isLast && <Divider />}
                            </React.Fragment>
                          );
                        }
                      )}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </AutoSizer>
      </StyledBox>
    </DetailCardWrapper>
  );
};

export default AssetDetailCard;

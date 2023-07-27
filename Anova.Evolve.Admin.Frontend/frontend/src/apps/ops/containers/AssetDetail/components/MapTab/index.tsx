/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  AssetDetailDto,
  CustomPropertyDataType,
  DataChannelCategory,
  DataChannelDTO,
  EventRuleCategory,
  UserPermissionType,
} from 'api/admin/api';
import { isLatitudeValid, isLongitudeValid } from 'api/mapbox/helpers';
import { StyledExpandIcon } from 'apps/ops/components/icons/styles';
import ComponentTitle from 'components/typography/ComponentTitle';
import MajorText from 'components/typography/MajorText';
import round from 'lodash/round';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { gray200 } from 'styles/colours';
import { AccessType } from 'types';
import { massageCustomProperties } from 'utils/api/custom-properties';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { formatModifiedDatetime } from 'utils/format/dates';
import { isNumber } from 'utils/format/numbers';
import { buildDataChannelTypeTextMapping } from 'utils/i18n/enum-to-text';
import {
  DataChannelLevelIcon,
  getHighestPriorityEventRuleInventoryStatus,
  getTankColorForInventoryStatus,
  renderImportance,
} from 'utils/ui/helpers';
import {
  accordionBannerSize,
  CardDateText,
  StyledAccordionSummary,
} from '../../styles';
import { AssetDetailTab } from '../../types';
import ListComponent from '../ListComponent';
import Map from './Map';

export const drawerWidth = 320;
const topOffset = 24;

const StyledBox = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.paper};
  border: 1px solid ${(props) => props.theme.custom.palette.table.borderColor};
`;

const ExpandedAccordionSummary = styled(StyledAccordionSummary)`
  border-radius: 0 ${(props) => props.theme.shape.borderRadius}px 0 0;
  padding: 0;
  padding-left: 8px;
`;

const CollapsedAccordionSummary = styled(StyledAccordionSummary)`
  padding: 0;
  ${(props) => {
    const { borderRadius } = props.theme.shape;
    return `border-radius: 0 ${borderRadius}px ${borderRadius}px 0;`;
  }};
  /*
    Weird bug: paddingLeft is explicitly required since this
    same component is rendered twice
  */
  padding-left: 0;
  align-items: flex-start;
  position: absolute;
  right: 0;
  height: calc(100% - ${topOffset}px);
  top: ${topOffset}px;
  width: ${accordionBannerSize}px;
`;

const getFillLevel = (fillPercentage?: number | null) => {
  if (!isNumber(fillPercentage)) {
    return '';
  }

  const fillLevel = fillPercentage!;
  const roundedFillLevel = Math.round(fillLevel);
  const assetFillLevelAsString = roundedFillLevel.toString();
  const assetFillLevelString = `${assetFillLevelAsString}%`;
  return assetFillLevelString;
};

export const AssetPanelMajorText = styled(Typography)`
  font-weight: 600;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

export const AssetPanelMinorText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

export const DetailCardWrapper = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.default};
  height: 100%;
  width: 320px;
  display: flex;
  flex-direction: column;
`;

const useCustomDrawerStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'none',
    },
    mapBox: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: drawerWidth,
    },
    mapBoxFull: {
      width: `calc(100% - ${accordionBannerSize}px)`,
      marginRight: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      position: 'absolute',
      top: topOffset,
      height: `calc(100% - ${topOffset}px)`,
      borderRadius: `${(props: any) =>
        `0 ${props.theme.shape.borderRadius}px ${props.theme.shape.borderRadius}px 0`}`,
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  })
);

interface LocationState {
  tab: AssetDetailTab;
}

interface Props {
  asset?: AssetDetailDto | null;
  dataChannels?: DataChannelDTO[] | null;
}

const MapTab = ({ asset, dataChannels }: Props) => {
  const { t } = useTranslation();
  const location = useLocation<LocationState | undefined>();
  const history = useHistory();
  const [isAssetDetailOpen, setIsAssetDetailOpen] = useState(true);
  const gpsDataChannel = dataChannels?.find(
    (channel) =>
      channel.dataChannelTypeId === DataChannelCategory.Gps &&
      isLatitudeValid(channel.uomParams?.latestReadingValue) &&
      isLongitudeValid(channel.uomParams?.latestReadingValue2)
  );
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

  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  const canStaticAssetBeMapped =
    isLatitudeValid(asset?.siteInfo?.latitude) &&
    isLongitudeValid(asset?.siteInfo?.longitude);

  // NOTE: FOR DEMO PURPOSES USE .reverse() BEFORE .find()
  // TO FETCH A DIFFERENT ASSET CARD WHICH MAY HAVE AN ADDITIONAL WARNING
  const dataChannel = dataChannels?.find(
    (dc) => dc.dataChannelTypeId === DataChannelCategory.Level
  );
  const productAndDataChannelType = [
    dataChannel?.productDescription,
    dataChannelTypeTextMapping[dataChannel?.dataChannelTypeId!],
  ]
    .filter(Boolean)
    .join(' ');

  const valueAndUnitsAsText =
    isNumber(dataChannel?.uomParams?.latestReadingValue) &&
    dataChannel?.uomParams?.unit
      ? `${round(
          dataChannel?.uomParams?.latestReadingValue!,
          dataChannel.uomParams.decimalPlaces || 0
        )} ${dataChannel?.uomParams?.unit}`
      : '';
  const enabledEvents = dataChannel?.uomParams?.eventRules;
  const hasMissingDataEvent = !!enabledEvents?.find(
    (event) =>
      event.isActive && event.eventRuleType === EventRuleCategory.MissingData
  );
  const activeEvents = enabledEvents?.filter(
    (activeEvent) => activeEvent.isActive
  );
  const activeEventDescriptions = activeEvents?.map((item) => item.description);
  const joinedEventDescriptions = activeEventDescriptions?.join(', ');
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
    .map((ci) => (
      <>
        {ci}
        <br />
      </>
    ));

  const inventoryStatus = getHighestPriorityEventRuleInventoryStatus(
    dataChannel?.uomParams?.eventRules
  );
  const assetColor = getTankColorForInventoryStatus(inventoryStatus);
  const fillLevel = getFillLevel(
    dataChannel?.uomParams?.latestReadingValueInPercentFull
  );

  const classes = useCustomDrawerStyles();

  useEffect(() => {
    history.replace(location.pathname, {
      tab: AssetDetailTab.Map,
    } as LocationState);
  }, []);

  return (
    <Box
      style={{
        height: `calc(100% - ${topOffset}px)`,
        marginTop: topOffset,
      }}
    >
      <Box
        height="100%"
        className={isAssetDetailOpen ? classes.mapBox : classes.mapBoxFull}
      >
        {gpsDataChannel ? (
          <Map
            lat={gpsDataChannel?.uomParams?.latestReadingValue!}
            long={gpsDataChannel?.uomParams?.latestReadingValue2!}
            assetFillLevel={fillLevel}
            assetColor={assetColor}
            activeNonLevelEvent={!!hasMissingDataEvent}
          />
        ) : canStaticAssetBeMapped ? (
          <Map
            lat={asset?.siteInfo?.latitude!}
            long={asset?.siteInfo?.longitude!}
            assetFillLevel={fillLevel}
            assetColor={assetColor}
            activeNonLevelEvent={!!hasMissingDataEvent}
          />
        ) : (
          <Box
            height="100%"
            display="flex"
            alignContent="center"
            alignItems="center"
            justifyContent="center"
            justifyItems="center"
            bgcolor={gray200}
          >
            <Typography align="center">
              {t(
                'ui.assetdetail.nogps',
                'This Asset does not have GPS coordinates. You can add GPS coordinates using the Site Editor.'
              )}
            </Typography>
          </Box>
        )}
      </Box>
      <Box>
        {isAssetDetailOpen ? (
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={isAssetDetailOpen}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <DetailCardWrapper>
              <ExpandedAccordionSummary
                onClick={() => {
                  setIsAssetDetailOpen(false);
                }}
              >
                <Grid container alignItems="center" justify="space-between">
                  <Grid item>
                    <Box p={1}>
                      <Grid
                        container
                        alignItems="center"
                        spacing={2}
                        justify="space-between"
                      >
                        <Grid item style={{ padding: '4px' }}>
                          <StyledExpandIcon
                            style={{
                              transform: 'rotate(90deg)',
                            }}
                          />
                        </Grid>
                        <Grid item style={{ padding: '4px' }}>
                          <ComponentTitle>
                            {t('ui.asset.assetdetails', 'Asset Details')}
                          </ComponentTitle>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </ExpandedAccordionSummary>
              <StyledBox
                width="100%"
                height="130px"
                boxSizing="border-box"
                mr={0}
                pr={3}
                pl={3}
                display="inline-block"
                position="relative"
                borderBottom="none"
              >
                {/* Manual Data Entry drawer */}
                <Box p="6px" height="calc(100% - 10px)">
                  <Grid
                    container
                    alignItems="flex-start"
                    justify="flex-start"
                    style={{ height: '100%' }}
                  >
                    <Grid item xs={12}>
                      <Grid container alignItems="center" justify="flex-end">
                        <Grid item xs={highestEventImportanceIcon ? 11 : 12}>
                          {!!joinedEventDescriptions &&
                          !!highestEventImportanceIcon ? (
                            <Box textAlign="right" mr="4px">
                              <MajorText
                                display="inline"
                                title={joinedEventDescriptions || ''}
                              >
                                {joinedEventDescriptions}
                              </MajorText>
                            </Box>
                          ) : (
                            <>&nbsp;</>
                          )}
                        </Grid>
                        {highestEventImportanceIcon && (
                          <Grid item xs={1} style={{ textAlign: 'center' }}>
                            {highestEventImportanceIcon}
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                    <Grid item xs={12} style={{ marginBottom: 25 }}>
                      <Grid container justify="space-between">
                        <Grid item xs={4}>
                          <Box textAlign="center" mx="auto" mt="4px">
                            <DataChannelLevelIcon
                              importanceLevel={
                                dataChannel?.eventImportanceLevel
                              }
                              decimalPlaces={
                                dataChannel?.uomParams?.decimalPlaces
                              }
                              inventoryStatus={inventoryStatus}
                              tankType={dataChannel?.tankType}
                              tankFillPercentage={
                                dataChannel?.uomParams
                                  ?.latestReadingValueInPercentFull
                              }
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={8} style={{ margin: '0 auto' }}>
                          <AssetPanelMajorText
                            aria-label="Data channel type"
                            title={productAndDataChannelType}
                          >
                            {productAndDataChannelType}
                          </AssetPanelMajorText>
                          <AssetPanelMinorText
                            aria-label="Value and units"
                            title={valueAndUnitsAsText}
                          >
                            {valueAndUnitsAsText || <em>-</em>}
                          </AssetPanelMinorText>
                          <CardDateText
                            aria-label="Latest reading timestamp"
                            title={latestReadingTimestamp}
                          >
                            {latestReadingTimestamp || <>&nbsp;</>}
                          </CardDateText>
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
                style={{ overflowY: 'auto', borderRadius: '0 0 10px 0' }}
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
                              <AssetPanelMajorText aria-label="Customer name">
                                {asset?.siteInfo?.customerName ||
                                  t('ui.common.none', 'None')}
                              </AssetPanelMajorText>
                              {joinedAddress && (
                                <AssetPanelMinorText
                                  aria-label="Site address"
                                  title={joinedAddress}
                                >
                                  {joinedAddress}
                                </AssetPanelMinorText>
                              )}
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
                                aria-label="latitude"
                                title={asset?.siteInfo?.latitude?.toString()}
                              >
                                {asset?.siteInfo?.latitude}
                              </AssetPanelMinorText>
                            </Grid>
                            <Grid item xs={6} style={{ margin: '0 auto' }}>
                              <AssetPanelMajorText>
                                {t('ui.common.longitude', 'Longitude')}
                              </AssetPanelMajorText>
                              <AssetPanelMinorText
                                aria-label="longitude"
                                title={asset?.siteInfo?.longitude?.toString()}
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
                          {contactNameAndPhone.length > 0 && (
                            <AssetPanelMinorText aria-label="Contact phone">
                              {contactNameAndPhone}
                            </AssetPanelMinorText>
                          )}
                        </Grid>

                        {canReadSiteNotes && (
                          <Grid item xs={12} style={{ marginBottom: 25 }}>
                            <AssetPanelMajorText>
                              {t('ui.assetdetail.sitenotes', 'Site Notes')}
                            </AssetPanelMajorText>
                            {asset?.siteInfo?.siteNotes && (
                              <AssetPanelMinorText aria-label="Site notes">
                                {asset?.siteInfo?.siteNotes}
                              </AssetPanelMinorText>
                            )}
                          </Grid>
                        )}

                        {canReadAssetNotes && (
                          <Grid item xs={12} style={{ marginBottom: 25 }}>
                            <AssetPanelMajorText>
                              {t('ui.assetdetail.assetnotes', 'Asset Notes')}
                            </AssetPanelMajorText>
                            {asset?.assetNotes && (
                              <AssetPanelMinorText aria-label="Asset notes">
                                {asset?.assetNotes}
                              </AssetPanelMinorText>
                            )}
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
                                    <>
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
                                    </>
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
          </Drawer>
        ) : (
          <CollapsedAccordionSummary
            aria-controls="vertical-panel-content"
            id="vertical-panel-header"
            onClick={() => {
              setIsAssetDetailOpen(true);
            }}
          >
            <Grid
              container
              direction="column"
              spacing={1}
              alignItems="center"
              justify="center"
            >
              <Grid item>
                <StyledExpandIcon
                  style={{
                    transform: 'rotate(-90deg)',
                  }}
                />
              </Grid>
              <Grid item xs>
                <ComponentTitle
                  aria-label="Asset details panel header"
                  style={{
                    writingMode: 'vertical-lr',
                    lineHeight: 0.8,
                  }}
                >
                  {t('ui.asset.assetdetails', 'Asset Details')}
                </ComponentTitle>
              </Grid>
            </Grid>
          </CollapsedAccordionSummary>
        )}
      </Box>
    </Box>
  );
};

export default MapTab;

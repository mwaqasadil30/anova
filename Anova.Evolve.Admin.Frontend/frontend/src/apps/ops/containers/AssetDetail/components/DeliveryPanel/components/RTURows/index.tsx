/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelDTO,
  RtuDeviceCategory,
  RtuPollStatusEnum,
  RtuDeviceType,
  UserPermissionType,
} from 'api/admin/api';
import adminRoutes, { RtuDeviceId, tabName } from 'apps/admin/routes';
import { useGetRtuPollStatus } from 'apps/ops/containers/AssetDetail/hooks/useGetRtuPollStatus';
import { usePollRtuForInstantaneousReadings } from 'apps/ops/containers/AssetDetail/hooks/usePollRtuForInstantaneousReadings';
import {
  AccordionDetailsWrapper,
  CardDateText,
  CardMajorText,
  CardMinorText,
  StyledAccordionDetails,
} from 'apps/ops/containers/AssetDetail/styles';
import { ReactComponent as GreenCircle } from 'assets/icons/green-circle.svg';
import { ReactComponent as RedCircle } from 'assets/icons/red-circle.svg';
import { ReactComponent as RTUIcon } from 'assets/icons/rtu-narrow.svg';
import { ReactComponent as GreenPageIcon } from 'assets/icons/rtu-notes-page.svg';
import CircularProgress from 'components/CircularProgress';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import MinorText from 'components/typography/MinorText';
import { RTUEditorTab } from 'containers/RTUEditor/types';
import uniqBy from 'lodash/uniqBy';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, Link } from 'react-router-dom';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';
import {
  selectCanAccessRtuEditor,
  selectCanPollRtus,
  selectHasPermission,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { formatModifiedDatetime } from 'utils/format/dates';
import {
  buildRTUCategoryTypeTextMapping,
  buildRTUTypeTextMapping,
} from 'utils/i18n/enum-to-text';
import RtuNotesDrawer from '../../../DataChannelsLayout/RtuNotesDrawer';

const StyledPollRtuText = styled(Typography)`
  text-align: center;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledGreenCircle = styled(GreenCircle)`
  height: 8px;
  width: 6px;
`;
const StyledRedCircle = styled(RedCircle)`
  height: 8px;
  width: 6px;
`;

const StyledGreenPageIcon = styled(GreenPageIcon)`
  cursor: pointer;
`;

const StyledPollText = styled(Typography)`
  font-size: 12px;
  font-weight: 500;
`;

const StyledRtuNotesText = styled(Typography)`
  font-size: 12px;
  font-weight: 500;
  text-decoration-line: underline;
  cursor: pointer;
`;

const StyledRTUIcon = styled(RTUIcon)`
  color: ${(props) => props.theme.custom.palette.dataChannelIcon};
`;

const getTabName = (rtuCategory: RtuDeviceCategory) => {
  if (rtuCategory === RtuDeviceCategory.Horner) {
    return RTUEditorTab.Configuration;
  }

  return RTUEditorTab.PacketsAndCallHistory;
};

interface Props {
  isPublishedAsset?: boolean;
  publishedDomainName?: string | null;
  dataChannels: DataChannelDTO[];
  fetchRecords: () => void;
}

const RTURows = ({
  isPublishedAsset,
  publishedDomainName,
  dataChannels,
  fetchRecords,
}: Props) => {
  const { t } = useTranslation();
  const rtuCategoryTypeTextMapping = buildRTUCategoryTypeTextMapping(t);
  const rtuTypeTextMapping = buildRTUTypeTextMapping(t);

  const hasPermission = useSelector(selectHasPermission);

  const dataChannelsWithRTUs = dataChannels.filter(
    (channel) => !!channel.rtuId
  );
  const uniqueDataChannelRTUs = uniqBy(dataChannelsWithRTUs, 'rtuId');

  const canAccessRtuEditor = useSelector(selectCanAccessRtuEditor);
  const canPollRtus = useSelector(selectCanPollRtus);
  const ianaTimezoneId = useSelector(selectCurrentIanaTimezoneId);

  const uniqueRtusToPoll = canPollRtus
    ? (uniqueDataChannelRTUs
        .map((rtu) => {
          return rtu.rtuDeviceId;
        })
        .filter(Boolean) as string[])
    : [];

  const getRtuPollStatusApi = useGetRtuPollStatus(uniqueRtusToPoll);
  const rtuPollStatusApiData = getRtuPollStatusApi.map(
    (rtuPollStatus) => rtuPollStatus.data
  );

  const isFetchingRtuPollStatus = getRtuPollStatusApi.some(
    (rtuPollStatus) => rtuPollStatus.isFetching
  );

  const pollRtuForInstantaneousReadings = usePollRtuForInstantaneousReadings();

  // #region Poll confirmation dialog/modal
  const [
    isPollConfirmationDialogOpen,
    setIsPollConfirmationDialogOpen,
  ] = useState(false);
  const openPollConfirmationDialog = (deviceId: string) => {
    pollRtuForInstantaneousReadings.mutate(deviceId);
    setIsPollConfirmationDialogOpen(true);
  };
  const closePollConfirmationDialog = () => {
    setIsPollConfirmationDialogOpen(false);
  };
  // #endregion Poll confirmation dialog/modal

  const getDisplayedRtuPollStatus = (
    rtuPollStatus?: RtuPollStatusEnum,
    rtuDeviceIdToPoll?: string
  ) => {
    if (rtuPollStatus === RtuPollStatusEnum.NotPollable) {
      return null;
    }

    if (
      rtuPollStatus === RtuPollStatusEnum.NotPollableBatteryLow ||
      rtuPollStatus === RtuPollStatusEnum.PollingDisabled
    ) {
      return (
        <Grid container spacing={1} alignItems="flex-end" justify="flex-end">
          <Grid item>
            <StyledRedCircle />
          </Grid>
          <Grid item>
            <StyledPollText>{t('ui.rtumetron2.poll', 'Poll')}</StyledPollText>
          </Grid>
        </Grid>
      );
    }

    if (
      rtuPollStatus === RtuPollStatusEnum.InstantaneousAndHistoricalReadings ||
      rtuPollStatus === RtuPollStatusEnum.InstantaneousReadings
    ) {
      return (
        <Grid container spacing={1} alignItems="flex-end" justify="flex-end">
          <Grid item>
            <StyledGreenCircle />
          </Grid>
          <Grid item>
            <StyledPollText
              style={{
                textDecorationLine: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => {
                openPollConfirmationDialog(rtuDeviceIdToPoll!);
              }}
            >
              {t('ui.rtumetron2.poll', 'Poll')}
            </StyledPollText>
          </Grid>
        </Grid>
      );
    }

    return null;
  };

  // RtuNotesDrawer
  const [
    selectedDataChannelForRtuNotes,
    setSelectedDataChannelForRtuNotes,
  ] = useState<DataChannelDTO>();
  const [isRtuNotesDrawerOpen, setIsRtuNotesDrawerOpen] = useState(false);
  const closeRtuNotesDrawer = () => {
    setIsRtuNotesDrawerOpen(false);
  };

  const openRtuNotesDrawer = (dataChannel?: DataChannelDTO) => {
    setSelectedDataChannelForRtuNotes(dataChannel);
    setIsRtuNotesDrawerOpen(true);
  };

  return (
    <div aria-label="RTU accordion details">
      <UpdatedConfirmationDialog
        maxWidth="xs"
        mainTitle={t('enum.packettype.pollrequest', 'Poll Request')}
        open={isPollConfirmationDialogOpen}
        isDisabled={pollRtuForInstantaneousReadings.isLoading}
        onConfirm={closePollConfirmationDialog}
        content={
          pollRtuForInstantaneousReadings.isLoading ? (
            <Box textAlign="center">
              <CircularProgress size={24} />
            </Box>
          ) : pollRtuForInstantaneousReadings.data ? (
            <StyledPollRtuText>
              {t('ui.rtu.pollrequestaccepted', 'Poll Request accepted.')}
            </StyledPollRtuText>
          ) : (
            <StyledPollRtuText>
              {t('ui.rtu.errorpollingrtuchannel', 'Error polling RTU Channel.')}
            </StyledPollRtuText>
          )
        }
        hideCancelButton
      />
      <Drawer
        anchor="right"
        open={isRtuNotesDrawerOpen}
        onClose={closeRtuNotesDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <RtuNotesDrawer
            rtuType={selectedDataChannelForRtuNotes?.rtuType}
            rtuDeviceId={selectedDataChannelForRtuNotes?.rtuDeviceId}
            closeDrawer={closeRtuNotesDrawer}
            fetchRecords={fetchRecords}
          />
        </DrawerContent>
      </Drawer>
      {isPublishedAsset ? (
        <Box padding="16px 10px">
          <Grid container spacing={1} justify="space-between">
            <Grid item xs={3} container alignItems="center" justify="center">
              <StyledRTUIcon />
            </Grid>

            <Grid item xs={9} style={{ margin: '0 auto' }}>
              <CardMajorText>
                {t('ui.assetdetail.publishedAsset', 'Published Asset')}
              </CardMajorText>

              <CardDateText>
                {t('ui.datachannel.sourcedomain', 'Source Domain')}:
              </CardDateText>
              <CardMinorText
                title={publishedDomainName || ''}
                aria-label="Source domain"
              >
                {publishedDomainName || <>&nbsp;</>}
              </CardMinorText>
            </Grid>
          </Grid>
        </Box>
      ) : !uniqueDataChannelRTUs.length ? (
        <StyledAccordionDetails>
          <MinorText>
            {t(
              'ui.assetdetail.noDataSourceConfigured',
              'No data source configured'
            )}
          </MinorText>
        </StyledAccordionDetails>
      ) : (
        <AccordionDetailsWrapper>
          {uniqueDataChannelRTUs.map((channel, rtuIndex) => {
            const canReadRTU400SeriesEditor =
              hasPermission(
                UserPermissionType.RTU400SeriesEditor,
                AccessType.Read
              ) && channel.rtuCategory === RtuDeviceCategory.FourHundredSeries;

            const canReadRTUFileEditor =
              hasPermission(
                UserPermissionType.RTUFileEditor,
                AccessType.Read
              ) && channel.rtuCategory === RtuDeviceCategory.File;

            const canReadRTUHornerEditor =
              hasPermission(
                UserPermissionType.RTUHornerEditor,
                AccessType.Read
              ) && channel.rtuCategory === RtuDeviceCategory.Horner;

            const canReadRTUCloverEditor =
              hasPermission(
                UserPermissionType.RTUCloverEditor,
                AccessType.Read
              ) && channel.rtuCategory === RtuDeviceCategory.Clover;

            const canReadRTUMetron2Editor =
              hasPermission(
                UserPermissionType.RTUMetron2Editor,
                AccessType.Read
              ) && channel.rtuCategory === RtuDeviceCategory.Metron2;

            const canReadRTUWiredEditor =
              hasPermission(
                UserPermissionType.RTUWiredEditor,
                AccessType.Read
              ) && channel.rtuCategory === RtuDeviceCategory.Modbus;

            const canReadRtuWirelessEditor =
              hasPermission(
                UserPermissionType.RtuWirelessEditor,
                AccessType.Read
              ) && channel.rtuCategory === RtuDeviceCategory.SMS;

            const canReadRtuCommsHistory = hasPermission(
              UserPermissionType.MiscellaneousFeatureRTUCommsHistory,
              AccessType.Read
            );

            const canAccessRtuPacketsTab =
              canReadRtuCommsHistory &&
              (canReadRTU400SeriesEditor ||
                canReadRTUFileEditor ||
                canReadRTUHornerEditor ||
                canReadRTUCloverEditor ||
                canReadRTUMetron2Editor ||
                canReadRTUWiredEditor ||
                canReadRtuWirelessEditor);

            const latestReadingTimestamp = formatModifiedDatetime(
              channel?.latestReadingTimestamp,
              ianaTimezoneId
            );
            const rtuCategory =
              rtuCategoryTypeTextMapping[channel.rtuCategory!];
            const rtuType = rtuTypeTextMapping[channel.rtuType!];
            const rtuDetails = [rtuCategory, rtuType].filter(Boolean);

            // Set up aria-labels for E2E tests to access the RTU
            // category and type. This joins the span elements with a
            // hyphen separating the category and type
            const rtuDetailsElementsWithAriaLabels =
              rtuDetails.length === 0
                ? null
                : rtuDetails
                    .map<React.ReactNode>((content) => {
                      const ariaLabel =
                        content === rtuCategory ? 'RTU category' : 'RTU type';
                      return (
                        <span aria-label={ariaLabel} key={content}>
                          {content}
                        </span>
                      );
                    })
                    .reduce((prev, curr) => [prev, ' - ', curr]);

            const rtuDetailsTitle = rtuDetails.join(' - ');

            const {
              rtuType: currentRtuType,
              rtuDeviceId,
              hasRtuNotes,
            } = channel;

            const isNoneRtuType = currentRtuType === RtuDeviceType.None;

            const hasRtuDeviceId = !!rtuDeviceId && rtuDeviceId?.length > 0;

            // NOTE: Any new RTU category that needs access to the editor needs
            // to be added in the list below.
            const canAccessRtuEditorWithPermissions =
              canAccessRtuPacketsTab &&
              canAccessRtuEditor &&
              [
                RtuDeviceCategory.FourHundredSeries,
                RtuDeviceCategory.Modbus,
                RtuDeviceCategory.SMS,
                RtuDeviceCategory.File,
                RtuDeviceCategory.Metron2,
                RtuDeviceCategory.Horner,
              ].includes(channel.rtuCategory!);

            const rtuDeviceIdContent = (
              <CardMajorText
                aria-controls="Rtu device id"
                title={channel.rtuDeviceId!}
              >
                {channel.rtuDeviceId}
              </CardMajorText>
            );

            const rtuEditorPath = generatePath(adminRoutes.rtuManager.edit, {
              [RtuDeviceId]: channel.rtuDeviceId || '',
              // rtuCategory should always exist at this point
              [tabName]: getTabName(channel.rtuCategory!),
            });

            return (
              <Box
                padding="16px 10px"
                key={channel.dataChannelId!}
                style={{ position: 'relative' }}
              >
                {canPollRtus && (
                  <CardMinorText
                    title="rtu polling status"
                    aria-label="RTU details"
                    style={{
                      position: 'absolute',
                      top: 1,
                      right: 7,
                    }}
                  >
                    {isFetchingRtuPollStatus ? (
                      <Grid
                        container
                        spacing={1}
                        alignItems="flex-end"
                        justify="flex-end"
                      >
                        <Grid item>
                          <CircularProgress size={12} />
                        </Grid>
                      </Grid>
                    ) : (
                      rtuPollStatusApiData.map((rtuPollStatus, pollIndex) => {
                        // While mapping through each RTU (see above), match each rtu with the
                        // polled rtu from the getRtuPollStatus api result
                        if (pollIndex === rtuIndex) {
                          return getDisplayedRtuPollStatus(
                            rtuPollStatus,
                            channel.rtuDeviceId!
                          );
                        }

                        return null;
                      })
                    )}
                  </CardMinorText>
                )}

                <Grid container spacing={1} justify="space-between">
                  <Grid
                    item
                    xs={3}
                    container
                    alignItems="center"
                    justify="center"
                  >
                    <StyledRTUIcon />
                  </Grid>

                  <Grid item xs={9} style={{ margin: '0 auto' }}>
                    {canAccessRtuEditorWithPermissions && rtuEditorPath ? (
                      <MuiLink
                        component={Link}
                        to={rtuEditorPath}
                        color="inherit"
                        underline="always"
                      >
                        {rtuDeviceIdContent}
                      </MuiLink>
                    ) : (
                      rtuDeviceIdContent
                    )}

                    <CardMinorText
                      title={rtuDetailsTitle}
                      aria-label="RTU details"
                    >
                      {rtuDetailsElementsWithAriaLabels || <em>-</em>}
                    </CardMinorText>
                    {latestReadingTimestamp && (
                      <CardDateText
                        title={latestReadingTimestamp}
                        aria-label="Latest reading timestamp"
                      >
                        {latestReadingTimestamp}
                      </CardDateText>
                    )}

                    {!isNoneRtuType && (hasRtuNotes || hasRtuDeviceId) && (
                      <Grid container spacing={1}>
                        <Grid item>
                          <StyledGreenPageIcon
                            onClick={() => {
                              openRtuNotesDrawer(channel);
                            }}
                          />
                        </Grid>
                        <Grid item>
                          <StyledRtuNotesText
                            title={rtuDetailsTitle}
                            aria-label="Rtu notes"
                            onClick={() => {
                              openRtuNotesDrawer(channel);
                            }}
                          >
                            {hasRtuNotes &&
                              t('ui.assetdetail.rtuNotes', 'RTU Notes')}

                            {!hasRtuNotes &&
                              hasRtuDeviceId &&
                              t('ui.assetdetail.addRtuNotes', 'Add RTU Notes')}
                          </StyledRtuNotesText>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Box>
            );
          })}
        </AccordionDetailsWrapper>
      )}
    </div>
  );
};
export default RTURows;

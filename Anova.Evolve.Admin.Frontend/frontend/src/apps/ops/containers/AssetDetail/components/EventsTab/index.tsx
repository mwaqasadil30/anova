/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  EventRuleType,
  EventStatusType,
  DataChannelDTO,
  UserEventSettingGetResp,
  UserEventSettingUpdateReq,
  EventRuleCategory,
} from 'api/admin/api';
import { parseEventListQuery } from 'apps/ops/utils/routes';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import { usePreserveUserEventSettings } from 'components/PreserveUserEventSettings/hooks/usePreserveUserEventSettings';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import { MAX_GRAPHABLE_DATA_CHANNEL_COUNT } from 'env';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import {
  selectActiveDomainId,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { selectUserId } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AssetDetailTab } from '../../types';
import AssetCarousel from '../AssetCarousel';
import EventsTable from './components/EventsTable';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import { useRetrieveActiveEvents } from './hooks/useRetrieveActiveEvents';
import { useRetrieveInactiveEvents } from './hooks/useRetrieveInactiveEvents';

// Styled component to allow setting up overflow: hidden on a parent to prevent
// the table from exceeding the height of the page. The key properties being
// `display: flex` and `height:100%` which allows the overflow: hidden to
// work properly.
const Wrapper = styled(({ topOffset, ...props }) => <div {...props} />)`
  ${(props) =>
    props.topOffset &&
    `
      display: flex;
      flex-direction: column;
      height: 100%;
    `};
`;

const getPageSizeForEventStatusType = (eventStatusType: EventStatusType) =>
  eventStatusType === EventStatusType.Active ? 1000 : 500;

interface LocationState {
  eventStatus?: EventStatusType;
  eventTypes?: EventRuleType[];
  page?: number;
  startDate?: string;
  endDate?: string;
  sortByColumnId?: string;
  sortByColumnDirection?: boolean;
  selectedEventId?: number;
  selectedDataChannelIdsForEventsTable?: string[];
  tab?: AssetDetailTab;
}

export interface EventsTabWithUserSettingsProps {
  dataChannels?: DataChannelDTO[] | null;
  selectedDataChannels: DataChannelDTO[];
  isFetchingDataChannel?: boolean;
  setSelectedDataChannelIdsForEventsTable: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  fetchRecords: () => void;
  openUpdateDisplayPriorityDialog: () => void;
}

export interface Props extends EventsTabWithUserSettingsProps {
  userEventSettings?: UserEventSettingGetResp;
  saveUserEventSettings: (
    request: Omit<UserEventSettingUpdateReq, 'init' | 'toJSON'>
  ) => Promise<number>;
}

const EventsTab = ({
  dataChannels,
  selectedDataChannels,
  isFetchingDataChannel,
  userEventSettings,
  saveUserEventSettings,
  setSelectedDataChannelIdsForEventsTable,
  fetchRecords,
  openUpdateDisplayPriorityDialog,
}: Props) => {
  const { t } = useTranslation();
  const location = useLocation<LocationState | undefined>();
  const history = useHistory();
  const parsedQuery = parseEventListQuery(location.search);

  const domainId = useSelector(selectActiveDomainId);
  const userId = useSelector(selectUserId);

  const [selectedEventTypes, setSelectedEventTypes] = useState(
    location.state?.eventTypes ||
      userEventSettings?.eventTypeIds ||
      parsedQuery.eventTypes || [
        EventRuleType.Level,
        EventRuleType.MissingData,
        EventRuleType.ScheduledDeliveryTooEarly,
        EventRuleType.ScheduledDeliveryTooLate,
        EventRuleType.ScheduledDeliveryMissed,
        EventRuleType.RTUChannelEvent,
        EventRuleType.UsageRate,
        EventRuleType.GeoFencing,
      ]
  );
  const [selectedEventStatus, setSelectedEventStatus] = useState(
    location.state?.eventStatus || EventStatusType.Active
  );

  // Pagination
  const [pageSize, setPageSize] = useState(
    getPageSizeForEventStatusType(selectedEventStatus)
  );
  const [pageNumber, setPageNumber] = useState(location.state?.page || 0);
  const [pageCount, setPageCount] = useState<number | undefined>();

  // Datepicker
  const routeStartDate = location.state?.startDate
    ? moment(location.state?.startDate)
    : null;
  const routeEndDate = location.state?.endDate
    ? moment(location.state?.endDate)
    : null;
  const cleanRouteStartDate = routeStartDate?.isValid() ? routeStartDate : null;
  const cleanRouteEndDate = routeEndDate?.isValid() ? routeEndDate : null;
  const now = moment();
  const initialStartDate = moment(now).subtract(7, 'day');
  const initialEndDate = moment(now).endOf('day');

  const [startDate, setStartDate] = useState<moment.Moment | null>(
    cleanRouteStartDate || initialStartDate
  );

  const [endDate, setEndDate] = useState<moment.Moment | null>(
    cleanRouteEndDate || initialEndDate
  );

  const topOffset = useSelector(selectTopOffset);

  // API Hooks
  const retrieveActiveEventsApi = useRetrieveActiveEvents();
  const retrieveInactiveEventsApi = useRetrieveInactiveEvents();

  const {
    records: activeEventRecords,
    makeRequest: retrieveActiveEvents,
  } = retrieveActiveEventsApi;

  const {
    records: inactiveEventRecords,
    makeRequest: retrieveInactiveEvents,
  } = retrieveInactiveEventsApi;

  const isFetchingEvents =
    selectedEventStatus === EventStatusType.Active
      ? retrieveActiveEventsApi.isFetching
      : retrieveInactiveEventsApi.isFetching;

  const isLoadingInitial =
    selectedEventStatus === EventStatusType.Active
      ? retrieveActiveEventsApi.isLoadingInitial
      : retrieveInactiveEventsApi.isLoadingInitial;

  const error =
    selectedEventStatus === EventStatusType.Active
      ? retrieveActiveEventsApi.error
      : retrieveInactiveEventsApi.error;

  const records =
    selectedEventStatus === EventStatusType.Active
      ? activeEventRecords
      : inactiveEventRecords;

  // Make the API requests when changing filters
  useEffect(() => {
    if (selectedEventStatus === EventStatusType.Active) {
      retrieveActiveEvents({
        dataChannelIds: selectedDataChannels
          .map((channel) => channel.dataChannelId)
          .filter(Boolean) as string[],
        // TypeScript type adjustment for API change that renamed the enum
        eventTypeIds: (selectedEventTypes as unknown) as EventRuleCategory[],
      }).catch(() => {});
    } else if (startDate && endDate) {
      retrieveInactiveEvents({
        dataChannelIds: selectedDataChannels
          .map((channel) => channel.dataChannelId)
          .filter(Boolean) as string[],
        eventTypeIds: selectedEventTypes,
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      })
        .then((response) => {
          setPageCount(Math.ceil(response.length / pageSize));
        })
        .catch(() => {});
    }
  }, [
    retrieveActiveEvents,
    retrieveInactiveEvents,
    selectedEventStatus,
    selectedDataChannels,
    selectedEventTypes,
    startDate,
    endDate,
    pageSize,
  ]);

  useEffect(() => {
    saveUserEventSettings({
      userId,
      domainId,
      eventTypeIds: selectedEventTypes,
      // NOTE: Update tagIds and isPlaySoundOnNewEvent once the api starts
      // using them
      tagIds: null,
      isPlaySoundOnNewEvent: false,
    }).catch(() => {});
  }, [saveUserEventSettings, selectedEventTypes]);

  // #region Preserve table scroll state
  // Preserve the filter state in the browser history state so when the user
  // goes "back" (via the browser), the state would be restored.

  // NOTE/TODO: Do we keep this for the Events Tab in Asset Details?
  useEffect(() => {
    history.replace(location.pathname, {
      eventStatus: selectedEventStatus,
      eventTypes: selectedEventTypes,
      // sortByColumnId,
      // sortByColumnDirection,
      selectedEventId: location.state?.selectedEventId,
      selectedDataChannelIdsForEventsTable: selectedDataChannels
        .map((channel) => channel.dataChannelId)
        .filter(Boolean) as string[],
      tab: AssetDetailTab.Events,
    } as LocationState);
  }, [
    selectedDataChannels,
    selectedEventStatus,
    selectedEventTypes,
    pageNumber,
    pageSize,
    startDate,
    endDate,
    // sortByColumnId,
    // sortByColumnDirection,
  ]);
  useEffect(() => {
    const selectedEventId = location.state?.selectedEventId;
    if (selectedEventId && !isLoadingInitial && !error && records.length) {
      const tableRowElement = document.querySelector(
        `[data-event-id="${selectedEventId}"]`
      );
      if (tableRowElement) {
        tableRowElement.scrollIntoView({ block: 'center' });
      }
    }
  }, [
    isLoadingInitial,
    error,
    records.length,
    location.state?.selectedEventId,
  ]);
  // #endregion Preserve table scroll state

  const handleStartDateChange = (newStartDate: moment.Moment | null) => {
    if (newStartDate) {
      setStartDate(newStartDate);
      setPageNumber(0);
    }
  };

  const handleEndDateChange = (newEndDate: moment.Moment | null) => {
    if (newEndDate) {
      setEndDate(newEndDate);
      setPageNumber(0);
    }
  };

  const handleEventTypeSelectedChange = (eventTypes: EventRuleType[]) => {
    setSelectedEventTypes(eventTypes);
    setPageNumber(0);
  };

  const handleEventStatusSelectedChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    // @ts-ignore-line todo: fix grouping
    const eventStatus = event.target.value as EventStatusType;
    setSelectedEventStatus(eventStatus);
    setPageNumber(0);
    setPageSize(getPageSizeForEventStatusType(eventStatus));
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
    onChange: handleChangePage,
  });

  const handleSelectedDataChannelCheckboxChange = (
    dataChannel: DataChannelDTO,
    checked: boolean
  ) => {
    // Currently we only allow one data channel to be selected at a time.
    // In the future we'll allow multiple data channels to be set shown on the
    // graph.
    if (checked) {
      setSelectedDataChannelIdsForEventsTable((prevState) => {
        const selectedDataChannelsForEvents = [
          ...prevState,
          dataChannel.dataChannelId!,
        ];

        // We limit the amount of selected(graphed) data channels via an
        // environment variable.
        const slicedSelectedDataChannels = selectedDataChannelsForEvents.slice(
          Math.max(
            selectedDataChannelsForEvents.length -
              MAX_GRAPHABLE_DATA_CHANNEL_COUNT,
            0
          )
        );
        return slicedSelectedDataChannels;
      });
    } else {
      setSelectedDataChannelIdsForEventsTable((prevState) =>
        prevState.filter(
          (existingDataChannelId) =>
            existingDataChannelId !== dataChannel.dataChannelId
        )
      );
    }

    // Reset the page number since a data channel was checked/unchecked
    handleChangePage(undefined, 1);
  };

  return (
    <Wrapper topOffset={topOffset}>
      <Box mt={2} display="flex" flexDirection="column" flexGrow={1}>
        <AssetCarousel
          dataChannels={dataChannels}
          selectedDataChannels={selectedDataChannels}
          isFetchingDataChannel={isFetchingDataChannel}
          handleChangeSelectedDataChannel={
            handleSelectedDataChannelCheckboxChange
          }
          fetchRecords={fetchRecords}
          openUpdateDisplayPriorityDialog={openUpdateDisplayPriorityDialog}
          hideUnitOfMeasureButtons
        />
      </Box>
      <Box pt={2} pb={1}>
        <TableOptions
          isFetching={isFetchingEvents}
          startDate={startDate}
          endDate={endDate}
          handleChangeStartDate={handleStartDateChange}
          handleChangeEndDate={handleEndDateChange}
          selectedEventTypes={selectedEventTypes}
          selectedEventStatus={selectedEventStatus}
          handleEventTypeSelectedChange={handleEventTypeSelectedChange}
          handleEventStatusSelectedChange={handleEventStatusSelectedChange}
        />
      </Box>
      <BoxWithOverflowHidden pb={8}>
        <Fade
          in={isLoadingInitial || (records.length === 0 && isFetchingEvents)}
          unmountOnExit
        >
          <div>
            {(records.length === 0 && isFetchingEvents) || isLoadingInitial ? (
              <MessageBlock>
                <CircularProgress />
              </MessageBlock>
            ) : null}
          </div>
        </Fade>
        <Fade in={!isLoadingInitial && !!error} unmountOnExit>
          <div>
            {error && (
              <MessageBlock>
                <Typography variant="body2" color="error">
                  {t(
                    'ui.events.eventSummary.error',
                    'Unable to retrieve events'
                  )}
                </Typography>
              </MessageBlock>
            )}
          </div>
        </Fade>
        <Fade
          in={
            !isLoadingInitial &&
            !error &&
            !isFetchingEvents &&
            records.length === 0
          }
          unmountOnExit
        >
          <div>
            {!isLoadingInitial &&
              !error &&
              !isFetchingEvents &&
              records.length === 0 && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t('ui.events.eventSummary.empty', 'No events found')}
                  </LargeBoldDarkText>
                </MessageBlock>
              )}
          </div>
        </Fade>
        <Fade
          in={!isLoadingInitial && !error && records.length > 0}
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            {!isLoadingInitial && !error && records.length > 0 && (
              <>
                <Box py={1}>
                  <TableActionsAndPagination
                    totalRows={records.length}
                    pageIndex={pageNumber}
                    pageSize={pageSize}
                    items={items}
                    showPaginationControls={
                      selectedEventStatus === EventStatusType.Inactive
                    }
                    align="center"
                  />
                </Box>
                <Box py={1} height="100%">
                  <DarkFadeOverlay darken={isFetchingEvents} height="100%">
                    <EventsTable
                      initialSortByColumnId={location.state?.sortByColumnId}
                      initialSortByColumnIsDescending={
                        location.state?.sortByColumnDirection
                      }
                      isCellDisabled={isFetchingEvents}
                      selectedEventStatus={selectedEventStatus}
                      records={records}
                      pageIndex={pageNumber}
                      pageSize={pageSize}
                    />
                  </DarkFadeOverlay>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </BoxWithOverflowHidden>
    </Wrapper>
  );
};

const EventsTabWithUserSettings = (props: EventsTabWithUserSettingsProps) => {
  const {
    userEventSettings,
    isUserEventSettingsLoadingInitial,
    saveUserEventSettings,
  } = usePreserveUserEventSettings();

  return isUserEventSettingsLoadingInitial ? null : (
    <EventsTab
      {...props}
      userEventSettings={userEventSettings}
      saveUserEventSettings={saveUserEventSettings}
    />
  );
};

export default EventsTabWithUserSettings;

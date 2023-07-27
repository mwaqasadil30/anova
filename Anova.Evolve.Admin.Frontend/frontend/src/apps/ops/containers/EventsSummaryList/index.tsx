/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  DomainEventsDto,
  EventInfoRecord,
  EventRuleType,
  EventRuleCategory,
  SortDirectionEnum,
  EventRecordStatus,
} from 'api/admin/api';
import routes from 'apps/ops/routes';
import { parseEventListQuery } from 'apps/ops/utils/routes';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import TableCellCheckbox from 'components/forms/styled-fields/TableCellCheckbox';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import {
  PreserveUserEventSettingsData,
  usePreserveUserEventSettings,
} from 'components/PreserveUserEventSettings/hooks/usePreserveUserEventSettings';
import TableDateTimeCell from 'components/tables/components/TableDateTimeCell';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import { ACTIVE_EVENTS_API_POLLING_INTERVAL_IN_SECONDS } from 'env';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import {
  Cell,
  Column,
  Hooks,
  MetaBase,
  TableOptions as ReactTableOptions,
  useGlobalFilter,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import {
  selectActiveDomain,
  selectOpsNavigationData,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import { selectUser } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import {
  buildEventRuleTypeTextMapping,
  buildImportanceLevelTextMapping,
} from 'utils/i18n/enum-to-text';
import { caseInsensitive, sortNullableDates } from 'utils/tables';
import { renderImportance } from 'utils/ui/helpers';
import ActiveEventsTable from './components/ActiveEventsTable';
import { getInitialStateValues } from '../AssetSummaryLegacy/helpers';
import AssetLinkCell from './components/AssetLinkCell';
import InactiveEventsTable from './components/InactiveEventsTable';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  getActiveEventsColumnCustomDisplayableValue,
  getInactiveEventsColumnCustomDisplayableValue,
} from './downloadHelpers';
import { EventSummaryListColumnId } from './helpers';
import { useGetActiveDomainEvents } from './hooks/useGetActiveDomainEvents';
import { useRetrieveEventInfoRecordsByOptions } from './hooks/useRetrieveEventInfoRecordsByOptions';
import { useUpdateEventToAcknowledgeEvent } from './hooks/useUpdateEventToAcknowledgeEvent';
import { GetDisplayableValueOptions } from './types';

// Styled component to allow setting up overflow: hidden on a parent to prevent
// the table from exceeding the height of the page. The key properties being
// `display: flex` and `height: calc(...)` which allows the overflow: hidden to
// work properly.
const Wrapper = styled(({ topOffset, ...props }) => <div {...props} />)`
  ${(props) =>
    props.topOffset &&
    `
      display: flex;
      flex-direction: column;
      height: calc(100vh - ${props.topOffset}px - 16px);
    `};
`;

const getPageSizeForEventStatusType = (eventStatusType: EventRecordStatus) =>
  eventStatusType === EventRecordStatus.Active ? 1000 : 50;

interface LocationState {
  eventStatus?: EventRecordStatus;
  eventTypes?: EventRuleType[];
  page?: number;
  startDate?: string;
  endDate?: string;
  sortByColumnId?: string;
  sortByColumnDirection?: boolean;
  selectedEventId?: number;
  tagIds?: number[] | null;
}

// TODO
// signalR - > live feed of new and removed events doesnt impact table cells but the records

const EventSummaryList = ({
  userEventSettings,
  saveUserEventSettings,
}: PreserveUserEventSettingsData) => {
  const { t } = useTranslation();
  const location = useLocation<LocationState | undefined>();
  const history = useHistory();
  const parsedQuery = parseEventListQuery(location.search);

  const importanceLevelTextMapping = buildImportanceLevelTextMapping(t);
  const eventRuleTypeTextMapping = buildEventRuleTypeTextMapping(t);

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
    location.state?.eventStatus || EventRecordStatus.Active
  );

  const [selectedTagIds, setSelectedTagIds] = useState(
    location.state?.tagIds || userEventSettings?.tagIds || []
  );

  const tableFormatOptions: GetDisplayableValueOptions = {
    importanceLevelTextMapping,
    eventRuleTypeTextMapping,
    selectedEventStatus,
    t,
  };

  // Pagination
  const [pageSize, setPageSize] = useState(
    getPageSizeForEventStatusType(selectedEventStatus)
  );

  const [pageNumber, setPageNumber] = useState(location.state?.page || 0);

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

  const [lastRefreshedOn, setLastRefreshedOn] = useState<Date | null>(null);

  const topOffset = useSelector(selectTopOffset);
  const opsNavData = useSelector(selectOpsNavigationData);
  const activeDomain = useSelector(selectActiveDomain);
  const user = useSelector(selectUser);
  const userId =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.userId;
  const domainId = activeDomain?.domainId;

  const initialStateValues = getInitialStateValues({
    opsNavData,
    defaultDomainId: domainId,
    tagIds: location.state?.tagIds,
  });
  const { navigationDomainId, assetSearchExpression } = initialStateValues;

  // Separate API call to fetch ALL records to be used in a CSV download/export
  const allInactiveEventRecordsForCsvApi = useRetrieveEventInfoRecordsByOptions();
  const inactiveEventRecordsApi = useRetrieveEventInfoRecordsByOptions();
  const activeEventRecordsApi = useGetActiveDomainEvents();

  const eventRecordsApi =
    selectedEventStatus === EventRecordStatus.Inactive
      ? inactiveEventRecordsApi
      : activeEventRecordsApi;

  const {
    isFetching: isFetchingEventInfoRecords,
    isLoadingInitial,
    totalRows,
    pageCount,
    error: responseError,
  } = eventRecordsApi;

  const allInactiveEventsData = React.useMemo(
    () => [...allInactiveEventRecordsForCsvApi.records],
    [allInactiveEventRecordsForCsvApi.records]
  );
  const inactiveEventsData = React.useMemo(
    () => [...inactiveEventRecordsApi.records],
    [inactiveEventRecordsApi.records]
  );
  const activeEventsData = React.useMemo(
    () => [...activeEventRecordsApi.records],
    [activeEventRecordsApi.records]
  );
  const inactiveTableColumns = React.useMemo<Column<EventInfoRecord>[]>(
    () => [
      {
        id: EventSummaryListColumnId.EventId,
        Header: 'eventId',
        accessor: 'eventId',
      },
      {
        id: EventSummaryListColumnId.HasNotes,
        Header: t('ui.common.notes', 'Notes') as string,
        accessor: (row: EventInfoRecord) => {
          if (row.hasNotes !== undefined) {
            return formatBooleanToYesOrNoString(row.hasNotes, t);
          }
          return '';
        },
      },

      {
        id: EventSummaryListColumnId.CreatedDate,
        accessor: EventSummaryListColumnId.CreatedDate,
        Header: t('ui.events.createdon', 'Created On') as string,
        Cell: TableDateTimeCell,
        sortDescFirst: true,
      },
      {
        id: EventSummaryListColumnId.DeactivatedOn,
        accessor: EventSummaryListColumnId.DeactivatedOn,
        Header: t('ui.events.inactivedate', 'Inactive Date') as string,
        Cell: TableDateTimeCell,
        sortDescFirst: true,
      },
      {
        id: EventSummaryListColumnId.EventRuleDescription,
        Header: t('ui.events.eventname', 'Event Name') as string,
        accessor: 'eventRuleDescription',
      },
      {
        id: EventSummaryListColumnId.EventImportanceLevel,
        Header: t('ui.events.importancelevel', 'Importance Level') as string,
        accessor: EventSummaryListColumnId.EventImportanceLevel,
        Cell: (cell: Cell<EventInfoRecord>) => {
          const { row } = cell;
          const importanceLevel = row.original.eventImportanceLevel;

          const displayValue = getInactiveEventsColumnCustomDisplayableValue(
            cell.value,
            cell.column,
            cell.row,
            tableFormatOptions
          );

          return (
            <Grid
              container
              justify="space-between"
              alignItems="center"
              spacing={1}
            >
              <Grid item>{displayValue}</Grid>
              <Grid item>{renderImportance(importanceLevel)}</Grid>
            </Grid>
          );
        },
      },
      {
        id: EventSummaryListColumnId.AssetTitle,
        Header: t('ui.events.asset', 'Asset') as string,
        accessor: 'assetTitle',
        Cell: (props: Cell<EventInfoRecord>) => (
          // @ts-ignore
          <AssetLinkCell
            {...props}
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            onClick={() => setSelectedEventId(props.row.original.eventId)}
          />
        ),
      },

      {
        id: EventSummaryListColumnId.DataChannelType,
        Header: t('ui.common.datachannel', 'Data Channel') as string,
        accessor: (row: EventInfoRecord) => {
          if (row.dataChannelDescription) {
            return `${row.dataChannelDescription}`;
          }
          return '-';
        },
      },
      {
        id: EventSummaryListColumnId.Message,
        Header: t('ui.events.message', 'Message') as string,
        accessor: 'message',
      },
      {
        id: EventSummaryListColumnId.ReadingTimestamp,
        accessor: EventSummaryListColumnId.ReadingTimestamp,
        Header: t('ui.common.readingtime', 'Reading Time') as string,
        Cell: TableDateTimeCell,
        sortDescFirst: true,
      },
      {
        id: EventSummaryListColumnId.ReadingScaledValue,
        Header: t('ui.events.readingscaledvalue', 'Reading') as string,
        accessor: EventSummaryListColumnId.ReadingScaledValue,
        Cell: (cell: Cell<EventInfoRecord>) => {
          return getInactiveEventsColumnCustomDisplayableValue(
            cell.value,
            cell.column,
            cell.row,
            tableFormatOptions
          );
        },
      },
      {
        id: EventSummaryListColumnId.AcknowledgedOn,
        accessor: EventSummaryListColumnId.AcknowledgedOn,
        Header: t('ui.events.acknowledged', 'Acknowledged') as string,
        Cell: TableDateTimeCell,
        sortDescFirst: true,
      },
      {
        id: EventSummaryListColumnId.AcknowledgeUserName,
        Header: t('ui.events.acknowledgedname', 'Acknowledged Name') as string,
        accessor: 'acknowledgeUserName',
      },
      {
        id: EventSummaryListColumnId.FirstRosterName,
        Header: t('ui.events.rosters', 'Roster(s)') as string,
        accessor: 'firstRosterName',
      },
      {
        id: EventSummaryListColumnId.TagsAsText,
        Header: t('ui.common.tags', 'Tags') as string,
        accessor: 'tagsAsText',
      },
      {
        id: EventSummaryListColumnId.EventRuleType,
        Header: t('ui.events.eventtype', 'Event Type') as string,
        accessor: 'eventRuleType',
        Cell: (cell: Cell<EventInfoRecord>) =>
          getInactiveEventsColumnCustomDisplayableValue(
            cell.value,
            cell.column,
            cell.row,
            tableFormatOptions
          ),
      },
    ],
    [t, inactiveEventRecordsApi.records]
  );

  const activeTableColumns = React.useMemo<Column<DomainEventsDto>[]>(
    () => [
      {
        id: EventSummaryListColumnId.EventId,
        Header: 'eventId',
        accessor: 'eventId',
      },
      {
        id: EventSummaryListColumnId.HasNotes,
        Header: t('ui.common.notes', 'Notes') as string,
        accessor: (row: DomainEventsDto) => {
          if (row.hasNotes !== undefined) {
            return formatBooleanToYesOrNoString(row.hasNotes, t);
          }
          return '';
        },
      },

      {
        id: EventSummaryListColumnId.CreatedDate,
        Header: t('ui.events.createdon', 'Created On') as string,
        accessor: 'createdOn',
        Cell: TableDateTimeCell,
        sortType: sortNullableDates,
        sortDescFirst: true,
      },
      {
        id: EventSummaryListColumnId.EventRuleDescription,
        Header: t('ui.events.eventname', 'Event Name') as string,
        accessor: 'eventDescription',
      },
      {
        id: EventSummaryListColumnId.EventImportanceLevel,
        Header: t('ui.events.importancelevel', 'Importance Level') as string,
        accessor: EventSummaryListColumnId.EventImportanceLevel,
        Cell: (cell: Cell<DomainEventsDto>) => {
          const { row, value } = cell;

          const displayValue = getActiveEventsColumnCustomDisplayableValue(
            value,
            cell.column,
            cell.row,
            tableFormatOptions
          );

          const importanceLevel = row.original.eventImportanceLevel;
          return (
            <Grid
              container
              justify="space-between"
              alignItems="center"
              spacing={1}
            >
              <Grid item>{displayValue}</Grid>
              <Grid item>{renderImportance(importanceLevel)}</Grid>
            </Grid>
          );
        },
      },
      {
        id: EventSummaryListColumnId.AssetTitle,
        Header: t('ui.events.asset', 'Asset') as string,
        accessor: 'assetTitle',
        Cell: (props: Cell<DomainEventsDto>) => (
          // @ts-ignore
          <AssetLinkCell
            {...props}
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            onClick={() => setSelectedEventId(props.row.original.eventId)}
          />
        ),
      },

      {
        id: EventSummaryListColumnId.DataChannelType,
        Header: t('ui.common.datachannel', 'Data Channel') as string,
        accessor: (row: DomainEventsDto) => {
          if (row.dataChannelDescription) {
            return `${row.dataChannelDescription}`;
          }
          return '-';
        },
      },
      {
        id: EventSummaryListColumnId.Message,
        Header: t('ui.events.message', 'Message') as string,
        accessor: 'message',
      },
      {
        id: EventSummaryListColumnId.ReadingTimestamp,
        accessor: EventSummaryListColumnId.ReadingTimestamp,
        Header: t('ui.common.readingtime', 'Reading Time') as string,
        Cell: TableDateTimeCell,
        sortDescFirst: true,
      },
      {
        id: EventSummaryListColumnId.ReadingScaledValue,
        Header: t('ui.events.readingscaledvalue', 'Reading') as string,
        accessor: 'readingValue',
        Cell: (cell: Cell<DomainEventsDto>) => {
          return getActiveEventsColumnCustomDisplayableValue(
            cell.value,
            cell.column,
            cell.row,
            tableFormatOptions
          );
        },
        sortType: 'basic',
      },
      {
        id: EventSummaryListColumnId.AcknowledgedOn,
        accessor: EventSummaryListColumnId.AcknowledgedOn,
        Header: t('ui.events.acknowledged', 'Acknowledged') as string,
        Cell: TableDateTimeCell,
        sortDescFirst: true,
      },
      {
        id: EventSummaryListColumnId.AcknowledgeUserName,
        Header: t('ui.events.acknowledgedname', 'Acknowledged Name') as string,
        accessor: 'acknowledgeUserName',
      },
      {
        id: EventSummaryListColumnId.FirstRosterName,
        Header: t('ui.events.rosters', 'Roster(s)') as string,
        accessor: (row: DomainEventsDto) => {
          return row.rosters?.join(', ');
        },
      },
      {
        id: EventSummaryListColumnId.TagsAsText,
        Header: t('ui.common.tags', 'Tags') as string,
        accessor: (row: DomainEventsDto) => {
          return row.tags?.join(', ');
        },
      },
      {
        id: EventSummaryListColumnId.EventRuleType,
        Header: t('ui.events.eventtype', 'Event Type') as string,
        accessor: 'eventType',
        Cell: (cell: Cell<DomainEventsDto>) =>
          getActiveEventsColumnCustomDisplayableValue(
            cell.value,
            cell.column,
            cell.row,
            tableFormatOptions
          ),
      },
    ],
    [t, activeEventRecordsApi.records]
  );

  // Set up the event acknowledgement API and column
  const updateEventToAcknowledgeEventApi = useUpdateEventToAcknowledgeEvent();
  const getAcknowledgeColumn = useCallback((meta: MetaBase<any>) => {
    return {
      id: EventSummaryListColumnId.Acknowledge,
      Header: 'Ack',
      Cell: (props: any) => {
        const { row } = props;
        return (
          <TableCellCheckbox
            onChange={() => {
              updateEventToAcknowledgeEventApi.makeRequest(
                row.values.eventId,
                meta.instance.rows
              );
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
            checked={!!row.values.acknowledgedOn}
            disabled={!!row.values.acknowledgedOn}
          />
        );
      },
      defaultCanSort: false,
      disableSortBy: true,
    };
  }, []);

  const {
    isFetching: isFetchingAcknowledgeEvent,
  } = updateEventToAcknowledgeEventApi;

  const isFetching = isFetchingAcknowledgeEvent || isFetchingEventInfoRecords;

  const commonTableOptions: Partial<ReactTableOptions<any>> = {
    pageIndex: pageNumber,
    disableMultiSort: true,
    disableSortRemove: true,
    initialState: {
      pageSize,
      pageIndex: pageNumber,
      sortBy: [
        location.state?.sortByColumnId
          ? {
              id: location.state.sortByColumnId,
              desc: location.state.sortByColumnDirection,
            }
          : {
              id: 'createdDate',
              desc: true,
            },
      ],
    },
  };

  const inactiveTableOptions: Omit<
    ReactTableOptions<EventInfoRecord>,
    'columns'
  > = {
    ...commonTableOptions,
    manualSortBy: true,
    initialState: {
      ...commonTableOptions.initialState,
      hiddenColumns:
        selectedEventStatus === EventRecordStatus.Inactive
          ? [EventSummaryListColumnId.Acknowledge, 'eventId']
          : [EventSummaryListColumnId.Acknowledge, 'eventId', 'deactivatedOn'],
    },
  };

  const activeTableOptions: Omit<
    ReactTableOptions<DomainEventsDto>,
    'columns'
  > = {
    ...commonTableOptions,
    initialState: {
      ...commonTableOptions.initialState,
      hiddenColumns:
        selectedEventStatus === EventRecordStatus.Inactive
          ? ['eventId']
          : ['eventId', 'deactivatedOn'],
    },
  };

  const allInactiveTableHookData = useTable<EventInfoRecord>(
    {
      ...inactiveTableOptions,
      columns: inactiveTableColumns,
      data: allInactiveEventsData,
    },
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks: Hooks<EventInfoRecord>) => {
      hooks.visibleColumns.push((hookColumns: any, meta) => [
        getAcknowledgeColumn(meta),
        ...hookColumns,
      ]);
    }
  );

  const inactiveTableHookData = useTable<EventInfoRecord>(
    {
      ...inactiveTableOptions,
      columns: inactiveTableColumns,
      data: inactiveEventsData,
    },
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks: Hooks<EventInfoRecord>) => {
      hooks.visibleColumns.push((hookColumns, meta) => [
        getAcknowledgeColumn(meta),
        ...hookColumns,
      ]);
    }
  );

  const activeTableHookData = useTable<DomainEventsDto>(
    {
      ...activeTableOptions,
      columns: activeTableColumns,
      data: activeEventsData,
      sortTypes: {
        alphanumeric: caseInsensitive,
      },
    },
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks: Hooks<DomainEventsDto>) => {
      hooks.visibleColumns.push((hookColumns, meta) => [
        getAcknowledgeColumn(meta),
        ...hookColumns,
      ]);
    }
  );

  const tableHookData =
    selectedEventStatus === EventRecordStatus.Inactive
      ? inactiveTableHookData
      : activeTableHookData;
  const {
    rows,
    state: { sortBy },
  } = tableHookData;

  const tableStateForDownload = useMemo(() => {
    const tableHookDataForExport =
      selectedEventStatus === EventRecordStatus.Inactive
        ? allInactiveTableHookData
        : activeTableHookData;
    return {
      rows: tableHookDataForExport.rows,
      visibleColumns: tableHookDataForExport.visibleColumns,
      eventStatus: selectedEventStatus,
    };
  }, [
    selectedEventStatus,
    allInactiveTableHookData.rows,
    allInactiveTableHookData.visibleColumns,
    activeTableHookData.rows,
    activeTableHookData.visibleColumns,
  ]);

  useEffect(() => {
    saveUserEventSettings({
      userId,
      domainId,
      eventTypeIds: selectedEventTypes,
      // NOTE: Update isPlaySoundOnNewEvent once the api starts using them
      tagIds: selectedTagIds,
      isPlaySoundOnNewEvent: false,
    }).catch(() => {});
  }, [saveUserEventSettings, selectedEventTypes, selectedTagIds]);

  const sortByColumnId = sortBy?.[0]?.id;
  const sortByColumnDirection = sortBy?.[0]?.desc;
  const inactiveSortByColumnId = inactiveTableHookData.state.sortBy?.[0]?.id;
  const inactiveSortByColumnDirection =
    inactiveTableHookData.state.sortBy?.[0]?.desc;

  const refetchInactiveRecordsForCsv = useCallback(() => {
    allInactiveEventRecordsForCsvApi.makeRequest({
      pageIndex: pageNumber,
      // TODO: itemsPerPage cannot be null (like AssetSummary) so we can't tell
      // the API to retrieve ALL results. For now we limit the maximum
      // exportable results to 10000.
      itemsPerPage: 10000,
      sortColumnName: inactiveSortByColumnId,
      sortDirection: inactiveSortByColumnDirection
        ? SortDirectionEnum.Descending
        : SortDirectionEnum.Ascending,
      navigationDomainId: navigationDomainId || domainId,
      tagIds: selectedTagIds,
      eventRuleTypeIds: selectedEventTypes,
      eventStatus: selectedEventStatus,
      assetSearchExpression,
      eventDateFrom: startDate?.startOf('day').toDate(),
      eventDateTo: endDate?.endOf('day').toDate(),
    });
  }, [
    inactiveEventRecordsApi.makeRequest,
    userId,
    domainId,
    navigationDomainId,
    selectedTagIds,
    pageSize,
    pageNumber,
    inactiveSortByColumnId,
    inactiveSortByColumnDirection,
    selectedEventTypes,
    selectedEventStatus,
    assetSearchExpression,
    startDate,
    endDate,
  ]);

  const refetchRecords = useCallback(() => {
    if (selectedEventStatus === EventRecordStatus.Inactive) {
      inactiveEventRecordsApi.makeRequest({
        pageIndex: pageNumber,
        itemsPerPage: pageSize,
        sortColumnName: inactiveSortByColumnId,
        sortDirection: inactiveSortByColumnDirection
          ? SortDirectionEnum.Descending
          : SortDirectionEnum.Ascending,
        navigationDomainId: navigationDomainId || domainId,
        tagIds: selectedTagIds,
        eventRuleTypeIds: selectedEventTypes,
        eventStatus: selectedEventStatus,
        assetSearchExpression,
        eventDateFrom: startDate?.startOf('day').toDate(),
        eventDateTo: endDate?.endOf('day').toDate(),
        // tags: selectedTagIds,
      });
    } else {
      activeEventRecordsApi.makeRequest(
        (selectedEventTypes as unknown) as EventRuleCategory[],
        selectedTagIds
      );
    }
  }, [
    inactiveEventRecordsApi.makeRequest,
    userId,
    domainId,
    navigationDomainId,
    selectedTagIds,
    pageSize,
    pageNumber,
    inactiveSortByColumnId,
    inactiveSortByColumnDirection,
    selectedEventTypes,
    selectedEventStatus,
    assetSearchExpression,
    startDate,
    endDate,
    selectedTagIds,
  ]);
  useEffect(() => {
    refetchRecords();
    setLastRefreshedOn(new Date());
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [refetchRecords]);

  // #region Preserve table scroll state
  // Preserve the filter state in the browser history state so when the user
  // goes "back" (via the browser), the state would be restored.
  useEffect(() => {
    history.replace(location.pathname, {
      eventStatus: selectedEventStatus,
      eventTypes: selectedEventTypes,
      page: pageNumber,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      sortByColumnId,
      sortByColumnDirection,
      selectedEventId: location.state?.selectedEventId,
      tagIds: selectedTagIds,
    } as LocationState);
  }, [
    selectedEventStatus,
    selectedEventTypes,
    pageNumber,
    startDate,
    endDate,
    sortByColumnId,
    sortByColumnDirection,
    selectedTagIds,
  ]);
  const setSelectedEventId = (eventId?: number) => {
    history.replace(routes.events.list, {
      eventStatus: selectedEventStatus,
      eventTypes: selectedEventTypes,
      page: pageNumber,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      sortByColumnId,
      sortByColumnDirection,
      selectedEventId: eventId,
      tagIds: selectedTagIds,
    } as LocationState);
  };
  useEffect(() => {
    const selectedEventId = location.state?.selectedEventId;
    if (selectedEventId && !isLoadingInitial && !responseError && rows.length) {
      const tableRowElement = document.querySelector(
        `[data-event-id="${selectedEventId}"]`
      );
      if (tableRowElement) {
        tableRowElement.scrollIntoView({ block: 'center' });
      }
    }
  }, [
    isLoadingInitial,
    responseError,
    rows.length,
    location.state?.selectedEventId,
  ]);
  // #endregion Preserve table scroll state

  // Poll the API to constantly get the latest records
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedEventStatus === EventRecordStatus.Active) {
        activeEventRecordsApi.makeRequest(
          (selectedEventTypes as unknown) as EventRuleCategory[],
          selectedTagIds
        );
      }
    }, ACTIVE_EVENTS_API_POLLING_INTERVAL_IN_SECONDS * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    selectedEventStatus,
    selectedEventTypes,
    selectedTagIds,
    lastRefreshedOn,
  ]);

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
    const eventStatus = event.target.value as EventRecordStatus;
    setSelectedEventStatus(eventStatus);
    setPageNumber(0);
    setPageSize(getPageSizeForEventStatusType(eventStatus));
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPageNumber(newPage - 1);
  };

  const handleSelectTag = (tagId: number) => {
    setSelectedTagIds([...(selectedTagIds || []), tagId]);
  };

  const handleDeselectTag = (tagId: number) => () => {
    setSelectedTagIds(
      [...(selectedTagIds || [])].filter(
        (selectedTagId) => selectedTagId !== tagId
      )
    );
  };

  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: pageCount,
    page: pageNumber + 1,
    onChange: handleChangePage,
  });

  const isDownloadButtonDisabled =
    allInactiveEventRecordsForCsvApi?.isFetching ||
    (selectedEventStatus === EventRecordStatus.Inactive
      ? inactiveEventRecordsApi.error
      : activeEventRecordsApi.error) ||
    // If the regular paginated API doesn't return records, then there most
    // likely aren't ANY records to be exported
    (selectedEventStatus === EventRecordStatus.Inactive
      ? !inactiveEventRecordsApi.records.length
      : !activeEventRecordsApi.records.length);

  return (
    <Wrapper topOffset={topOffset}>
      <PageIntroWrapper>
        <PageIntro
          isFetching={isFetching}
          tableStateForDownload={tableStateForDownload}
          tableFormatOptions={tableFormatOptions}
          selectedEventStatus={selectedEventStatus}
          isDownloadButtonDisabled={isDownloadButtonDisabled}
          allInactiveEventRecordsForCsvApi={allInactiveEventRecordsForCsvApi}
          refetchInactiveRecordsForCsv={refetchInactiveRecordsForCsv}
          refetchRecords={refetchRecords}
        />
      </PageIntroWrapper>

      <TableOptions
        disableFilterOptions={
          isFetching || allInactiveEventRecordsForCsvApi.isFetching
        }
        startDate={startDate}
        endDate={endDate}
        handleChangeStartDate={handleStartDateChange}
        handleChangeEndDate={handleEndDateChange}
        selectedEventTypes={selectedEventTypes}
        selectedEventStatus={selectedEventStatus}
        handleEventTypeSelectedChange={handleEventTypeSelectedChange}
        handleEventStatusSelectedChange={handleEventStatusSelectedChange}
        selectedTagIds={selectedTagIds}
        handleSelectTag={handleSelectTag}
        handleDeselectTag={handleDeselectTag}
      />

      <BoxWithOverflowHidden pt={1} pb={8}>
        <Fade
          in={isLoadingInitial || (rows.length === 0 && isFetching)}
          unmountOnExit
        >
          <div>
            {(rows.length === 0 && isFetching) || isLoadingInitial ? (
              <MessageBlock>
                <CircularProgress />
              </MessageBlock>
            ) : null}
          </div>
        </Fade>
        <Fade in={!isLoadingInitial && !!responseError} unmountOnExit>
          <div>
            {responseError && (
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
            !responseError &&
            !isFetching &&
            rows.length === 0
          }
          unmountOnExit
        >
          <div>
            {!isLoadingInitial &&
              !responseError &&
              !isFetching &&
              rows.length === 0 && (
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
          in={!isLoadingInitial && !responseError && rows.length > 0}
          style={{ height: '100%' }}
        >
          <Box height="100%" display="flex" flexDirection="column">
            <Box py={1}>
              <TableActionsAndPagination
                totalRows={totalRows}
                pageIndex={pageNumber}
                pageSize={pageSize}
                items={items}
                showPaginationControls={
                  selectedEventStatus === EventRecordStatus.Inactive
                }
                align="center"
              />
            </Box>
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                {selectedEventStatus === EventRecordStatus.Inactive ? (
                  <InactiveEventsTable
                    isFetching={isFetching}
                    tableHookData={inactiveTableHookData}
                    setSelectedEventId={setSelectedEventId}
                  />
                ) : (
                  <ActiveEventsTable
                    isFetching={isFetching}
                    tableHookData={activeTableHookData}
                    setSelectedEventId={setSelectedEventId}
                  />
                )}
              </DarkFadeOverlay>
            </Box>
          </Box>
        </Fade>
      </BoxWithOverflowHidden>
    </Wrapper>
  );
};

const EventsSummaryListWithUserSettings = () => {
  const {
    userEventSettings,
    isUserEventSettingsLoadingInitial,
    saveUserEventSettings,
  } = usePreserveUserEventSettings();

  return isUserEventSettingsLoadingInitial ? null : (
    <EventSummaryList
      userEventSettings={userEventSettings}
      saveUserEventSettings={saveUserEventSettings}
    />
  );
};

export default EventsSummaryListWithUserSettings;

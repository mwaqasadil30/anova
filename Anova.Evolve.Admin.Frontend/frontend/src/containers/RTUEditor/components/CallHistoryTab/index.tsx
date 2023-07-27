/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import {
  EventRuleType,
  EventStatusType,
  RcmJournalItemStatusEnum,
  RtuDeviceCategory,
  RtuCommDirection,
} from 'api/admin/api';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import FullPageLoadingOverlay from 'components/FullPageLoadingOverlay';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import { useGetRtuCategoryByRtuDeviceId } from 'containers/RTUEditor/hooks/useGetRtuCategoryByRtuDeviceId';
import {
  GetModbusCallHistoryRequest,
  useGetModbusRtuCallHistory,
} from 'containers/RTUEditor/hooks/useGetModbusRtuCallHistory';
import {
  GetMetron2CallHistoryRequest,
  useGetMetronRtuCallHistory,
} from 'containers/RTUEditor/hooks/useGetMetronRtuCallHistory';
import {
  GetHornerCallHistoryRequest,
  useGetHornerRtuCallHistory,
} from 'containers/RTUEditor/hooks/useGetHornerRtuCallHistory';
import { RTUEditorTab } from 'containers/RTUEditor/types';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { RtuPacketsChannelTypeForFilter } from 'utils/i18n/enum-to-text';
import CallHistoryTable from './components/CallHistoryTable';
import TableOptions from './components/TableOptions';

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
      height: 100%
    `};
`;

interface LocationState {
  eventStatus?: EventStatusType;
  eventTypes?: EventRuleType[];
  beginTime?: string;
  endTime?: string;
  tab?: RTUEditorTab;
  // RTU stuff
  rtuStatusTypes?: RcmJournalItemStatusEnum[];
  rowCount?: number | null;
  direction?: RtuPacketsChannelTypeForFilter;
}

export interface PacketsTabProps {
  rtuDeviceId: string;
}

export interface Props extends PacketsTabProps {}

const CallHistoryTab = ({ rtuDeviceId }: Props) => {
  const { t } = useTranslation();
  const location = useLocation<LocationState | undefined>();

  const [selectedRtuStatusTypes, setSelectedRtuStatusTypes] = useState(
    location.state?.rtuStatusTypes || [
      RcmJournalItemStatusEnum.Complete,
      RcmJournalItemStatusEnum.Failed,
      RcmJournalItemStatusEnum.Initialized,
      RcmJournalItemStatusEnum.Partial,
      RcmJournalItemStatusEnum.Processing,
    ]
  );

  const [rowCount, setRowCount] = useState<number | null>(
    location.state?.rowCount || 500
  );
  const [
    selectedDirection,
    setSelectedDirection,
  ] = useState<RtuPacketsChannelTypeForFilter>(
    location.state?.direction || RtuPacketsChannelTypeForFilter.Any
  );

  // Datepicker
  const routeBeginTime = location.state?.beginTime
    ? moment(location.state?.beginTime)
    : null;

  const cleanRouteBeginTime = routeBeginTime?.isValid() ? routeBeginTime : null;

  const now = moment();

  const initialStartDate = moment(now);

  const [beginTime, setBeginTime] = useState<moment.Moment | null>(
    cleanRouteBeginTime || initialStartDate
  );
  const getRtuCategoryByRtuDeviceIdApi = useGetRtuCategoryByRtuDeviceId(
    rtuDeviceId
  );
  const rtuCategoryApiData = getRtuCategoryByRtuDeviceIdApi.data;

  const topOffset = useSelector(selectTopOffset);

  const handleRtuStatusTypeChange = (
    rtuStatusTypes: RcmJournalItemStatusEnum[]
  ) => {
    setSelectedRtuStatusTypes(rtuStatusTypes);
  };

  const handleRowCountChange = (rowCountValue: number | null) => {
    setRowCount(rowCountValue);
  };
  const handleDirectionChange = (
    directionValue: RtuPacketsChannelTypeForFilter
  ) => {
    setSelectedDirection(directionValue);
  };

  const [
    filterOptionsForModbus,
    setFilterOptionsForModbus,
  ] = useState<GetModbusCallHistoryRequest>();

  const [
    filterOptionsForMetron2,
    setFilterOptionsForMetron2,
  ] = useState<GetMetron2CallHistoryRequest>();

  const [
    filterOptionsForHorner,
    setFilterOptionsForHorner,
  ] = useState<GetHornerCallHistoryRequest>();

  const isModbusRtu = rtuCategoryApiData === RtuDeviceCategory.Modbus;
  const isMetron2Rtu = rtuCategoryApiData === RtuDeviceCategory.Metron2;
  const isHornerRtu = rtuCategoryApiData === RtuDeviceCategory.Horner;

  const handleApplyFilters = () => {
    const formattedBeginTime = beginTime?.isSame(now, 'day')
      ? now
      : beginTime?.endOf('day');

    const selectedBeginTime = formattedBeginTime?.toDate();

    const filterOptionsForApiRequest = {
      deviceId: rtuDeviceId,
      beginTime: selectedBeginTime,
      // Back-end times out with an endTime, so we keep it null and rely on
      // the user's input for the limit/'rowCount' number.
      endTime: null,
      statuses: selectedRtuStatusTypes,
      direction:
        selectedDirection === -1
          ? null
          : ((selectedDirection as unknown) as RtuCommDirection),
      limit: rowCount,
    };
    if (isModbusRtu) {
      setFilterOptionsForModbus(filterOptionsForApiRequest);
    }
    if (isHornerRtu) {
      setFilterOptionsForHorner(filterOptionsForApiRequest);
    }
    if (isMetron2Rtu) {
      setFilterOptionsForMetron2(filterOptionsForApiRequest);
    }
  };

  useEffect(() => {
    handleApplyFilters();
  }, []);

  const getModbusRtuCallHistoryApi = useGetModbusRtuCallHistory(
    filterOptionsForModbus
  );

  const getMetron2RtuCallHistoryApi = useGetMetronRtuCallHistory(
    filterOptionsForMetron2
  );

  const getHornerCallHistoryApi = useGetHornerRtuCallHistory(
    filterOptionsForHorner
  );

  const isFetching =
    getModbusRtuCallHistoryApi.isFetching ||
    getMetron2RtuCallHistoryApi.isFetching ||
    getHornerCallHistoryApi.isFetching;
  const isLoading =
    getModbusRtuCallHistoryApi.isLoading ||
    getMetron2RtuCallHistoryApi.isLoading ||
    getHornerCallHistoryApi.isLoading;
  const isError =
    getMetron2RtuCallHistoryApi.error || getHornerCallHistoryApi.error;

  const records =
    getMetron2RtuCallHistoryApi.data ||
    getHornerCallHistoryApi.data ||
    getModbusRtuCallHistoryApi.data ||
    [];

  const isEmptyCase =
    !isLoading && !isError && !isFetching && records.length === 0;
  const isNonEmptyCase = !isLoading && !isError && records.length > 0;

  return (
    <Wrapper topOffset={topOffset}>
      <Box pt={2} pb={1}>
        <TableOptions
          isFetching={isFetching}
          // 'Status'
          selectedRtuStatusTypes={selectedRtuStatusTypes}
          setSelectedRtuStatusTypes={setSelectedRtuStatusTypes}
          handleRtuStatusTypeChange={handleRtuStatusTypeChange}
          // 'Row Count'
          rowCount={rowCount}
          handleRowCountChange={handleRowCountChange}
          // 'Direction'
          selectedDirection={selectedDirection}
          handleDirectionChange={handleDirectionChange}
          // Time Pickers
          beginTime={beginTime}
          setBeginTime={setBeginTime}
          // api call
          handleApplyFilters={handleApplyFilters}
        />
      </Box>
      <BoxWithOverflowHidden pb={1}>
        <div style={{ height: '100%' }}>
          {/*
            NOTE: For some reason using the <DarkFadeOverlay /> component causes
            virtualization performance issues. Not sure how the issue is happening.
          */}
          {isFetching && <FullPageLoadingOverlay />}
          <TransitionErrorMessage in={!isLoading && !!isError} />

          <Fade in={isEmptyCase} unmountOnExit>
            <div>
              {isEmptyCase && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t('ui.callHistoryList.empty', 'No call history found')}
                  </LargeBoldDarkText>
                </MessageBlock>
              )}
            </div>
          </Fade>

          <Fade
            in={isNonEmptyCase}
            // Only apply full-height styles when there are records to show.
            // Otherwise, this non-empty content will make the page scrollable.
            style={isNonEmptyCase ? { height: '100%' } : {}}
          >
            <div
              style={
                isNonEmptyCase
                  ? {
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }
                  : {}
              }
            >
              {isNonEmptyCase && (
                <>
                  {/* <Box py={1}>
                    <TableActionsAndPagination totalRows={records.length} />
                  </Box> */}

                  <CallHistoryTable
                    records={records}
                    pageIndex={0}
                    pageSize={10}
                  />
                </>
              )}
            </div>
          </Fade>
        </div>
      </BoxWithOverflowHidden>
    </Wrapper>
  );
};

export default CallHistoryTab;

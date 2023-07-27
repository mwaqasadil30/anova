/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import {
  EventRuleType,
  EventStatusType,
  RtuPacketCategory,
  RtuDeviceCategory,
  RtuCommDirection,
} from 'api/admin/api';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import FullPageLoadingOverlay from 'components/FullPageLoadingOverlay';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import {
  Get400SeriesPacketsRequest,
  useGet400SeriesPackets,
} from 'containers/RTUEditor/hooks/useGet400SeriesPackets';
import { useGetRtuCategoryByRtuDeviceId } from 'containers/RTUEditor/hooks/useGetRtuCategoryByRtuDeviceId';
import {
  GetSmsRtuPacketsRequest,
  useGetSmsRtuPackets,
} from 'containers/RTUEditor/hooks/useGetSmsRtuPackets';
import { RTUEditorTab } from 'containers/RTUEditor/types';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import {
  RtuPacketsChannelType,
  RtuPacketsChannelTypeForFilter,
} from 'utils/i18n/enum-to-text';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import VirtualizedTable from './components/VirtualizedTable';

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
  packetCategory?: RtuPacketCategory[];
  rtuChannelTypes?: RtuPacketsChannelType[];
  rowCount?: number | null;
  direction?: RtuPacketsChannelTypeForFilter;
}

export interface PacketsTabProps {
  rtuDeviceId: string;
}

export interface Props extends PacketsTabProps {}

const PacketsTab = ({ rtuDeviceId }: Props) => {
  const { t } = useTranslation();
  const location = useLocation<LocationState | undefined>();

  const [selectedRtuChannelTypes, setSelectedRtuChannelTypes] = useState(
    location.state?.rtuChannelTypes || []
  );
  const [selectedPacketCategories, setSelectedPacketCategories] = useState(
    location.state?.packetCategory || [
      RtuPacketCategory.Configuration,
      RtuPacketCategory.Data,
      RtuPacketCategory.Initial,
      RtuPacketCategory.Unknown,
    ]
  );
  const [rowCount, setRowCount] = useState<number | null>(
    location.state?.rowCount || 200
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

  const topOffset = useSelector(selectTopOffset);

  const handleRtuChannelTypeChange = (
    rtuChannelTypes: RtuPacketsChannelType[]
  ) => {
    setSelectedRtuChannelTypes(rtuChannelTypes);
  };
  const handlePacketCategoryChange = (
    packetCategories: RtuPacketCategory[]
  ) => {
    setSelectedPacketCategories(packetCategories);
  };
  const handleRowCountChange = (rowCountValue: number | null) => {
    setRowCount(rowCountValue);
  };
  const handleDirectionChange = (
    directionValue: RtuPacketsChannelTypeForFilter
  ) => {
    setSelectedDirection(directionValue);
  };

  const getRtuCategoryByRtuDeviceIdApi = useGetRtuCategoryByRtuDeviceId(
    rtuDeviceId
  );

  const rtuCategoryApiData = getRtuCategoryByRtuDeviceIdApi.data;

  const [
    filterOptionsFor400Series,
    setFilterOptionsFor400Series,
  ] = useState<Get400SeriesPacketsRequest>();

  const [
    filterOptionsForSmsRtu,
    setFilterOptionsForSmsRtu,
  ] = useState<GetSmsRtuPacketsRequest>();

  const [
    filterOptionsForFileRtu,
    setFilterOptionsForFileRtu,
  ] = useState<GetSmsRtuPacketsRequest>();

  const handleApplyFilters = () => {
    const formattedBeginTime = beginTime?.isSame(now, 'day')
      ? now
      : beginTime?.endOf('day');

    const selectedBeginTime = formattedBeginTime?.toDate();

    const is400SeriesRtu =
      rtuCategoryApiData === RtuDeviceCategory.FourHundredSeries;
    const isSmsRtu = rtuCategoryApiData === RtuDeviceCategory.SMS;
    const isFileRtu = rtuCategoryApiData === RtuDeviceCategory.File;

    const filterOptionsForApiRequest = {
      deviceId: rtuDeviceId,
      beginTime: selectedBeginTime,
      // Back-end times out with an endTime, so we keep it null and rely on
      // the user's input for the limit/'rowCount' number.
      endTime: null,
      categories: selectedPacketCategories,
      channels: selectedRtuChannelTypes,
      direction:
        selectedDirection === -1
          ? null
          : ((selectedDirection as unknown) as RtuCommDirection),
      limit: rowCount,
    };

    if (is400SeriesRtu) {
      setFilterOptionsFor400Series(filterOptionsForApiRequest);
    }
    if (isSmsRtu) {
      setFilterOptionsForSmsRtu(filterOptionsForApiRequest);
    }
    if (isFileRtu) {
      setFilterOptionsForFileRtu(filterOptionsForApiRequest);
    }
  };
  useEffect(() => {
    handleApplyFilters();
  }, []);

  const get400SeriesPacketsApi = useGet400SeriesPackets(
    filterOptionsFor400Series
  );
  const getSmsRtuPacketsApi = useGetSmsRtuPackets(filterOptionsForSmsRtu);
  const getFileRtuPacketsApi = useGetSmsRtuPackets(filterOptionsForFileRtu);

  const isFetching =
    get400SeriesPacketsApi.isFetching ||
    getSmsRtuPacketsApi.isFetching ||
    getFileRtuPacketsApi.isFetching;
  const isLoading =
    get400SeriesPacketsApi.isLoading ||
    getSmsRtuPacketsApi.isLoading ||
    getFileRtuPacketsApi.isLoading;
  const error =
    get400SeriesPacketsApi.error ||
    getSmsRtuPacketsApi.error ||
    getFileRtuPacketsApi.error;

  const records =
    get400SeriesPacketsApi.data ||
    getSmsRtuPacketsApi.data ||
    getFileRtuPacketsApi.data ||
    [];

  const isEmptyCase =
    !isLoading && !error && !isFetching && records.length === 0;
  const isNonEmptyCase = !isLoading && !error && records.length > 0;

  return (
    <Wrapper topOffset={topOffset}>
      <Box pt={2} pb={1}>
        <TableOptions
          isFetching={isFetching}
          // 'Channel'
          selectedRtuChannelTypes={selectedRtuChannelTypes}
          setSelectedRtuChannelTypes={setSelectedRtuChannelTypes}
          handleRtuChannelTypeChange={handleRtuChannelTypeChange}
          // 'Packet Category'
          selectedPacketCategories={selectedPacketCategories}
          setSelectedPacketCategories={setSelectedPacketCategories}
          handlePacketCategoryChange={handlePacketCategoryChange}
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
          <TransitionErrorMessage in={!isLoading && !!error} />

          <Fade in={isEmptyCase} unmountOnExit>
            <div>
              {isEmptyCase && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t('ui.rtuPacketsList.empty', 'No RTU packets found')}
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
                  <Box py={1}>
                    <TableActionsAndPagination totalRows={records.length} />
                  </Box>

                  <VirtualizedTable
                    isLoadingInitial={isLoading}
                    responseError={error}
                    apiResponse={records}
                    overscanCount={1}
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

export default PacketsTab;

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh-icon.svg';
import Button from 'components/Button';
import ApplyButton from 'components/buttons/ApplyButton';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import FieldLabel from 'components/forms/labels/FieldLabel';
import SelectCustomStyled from 'containers/RtuAiChannelsEditor/components/SelectCustomStyled';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { getExportFilenameWithDatetime } from 'utils/format/dataExport';
import DateRangePicker from './components/DateRangePicker';
import TransactionJournalTable from './components/TransactionJournalTable';
import useTransactionJournals from './hook/useTransactionJournals';
import { TransactionDateRange } from './types';

const Wrapper = styled(({ topOffset, ...props }) => <div {...props} />)`
  ${(props) =>
    props.topOffset &&
    `
    display: flex;
    flex-direction: column;
    height: 100%
  `};
`;

const TransactionDetailsTab = ({ rtuDeviceId }: { rtuDeviceId: string }) => {
  const topOffset = useSelector(selectTopOffset);
  const [
    transactionDateRange,
    setTransactionDateRange,
  ] = useState<TransactionDateRange>({
    startDate: null,
    endDate: null,
  });

  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());

  const [dateRange, setDateRange] = useState('2');
  const { t } = useTranslation();
  const d = new Date();
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useTransactionJournals(rtuDeviceId || '', transactionDateRange);

  const timeList = [
    { label: '2 hours', value: '2' },
    { label: '4 hours', value: '4' },
    { label: '12 hours', value: '12' },
    { label: '1 Day', value: '24' },
    { label: '2 Days', value: '48' },
    { label: '4 Days', value: '96' },
    { label: '1 Week', value: '168' },
    { label: 'Custom', value: 'Custom' },
  ];

  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const openDownloadDialog = () => {
    setIsDownloadDialogOpen(true);
  };
  const closeDownloadDialog = () => {
    setIsDownloadDialogOpen(false);
    setIsDownloading(false);
  };

  const filenamePrefix = t(
    'exportFilenames.rtueditor.transactionDetails',
    `transaction-details-for-${rtuDeviceId}`
  );
  const csvExportFilename = getExportFilenameWithDatetime(filenamePrefix);

  return (
    <Wrapper topOffset={topOffset}>
      <Box pt={2} pb={1}>
        <Grid container spacing={1}>
          <Grid container direction="column" md={3}>
            <Grid item style={{ paddingTop: '4px' }}>
              <FieldLabel>{t('ui.common.timerange', 'Time Range')}</FieldLabel>
            </Grid>
            <Grid item style={{ padding: '8px 0 4px 0' }}>
              <SelectCustomStyled
                itemArray={timeList}
                value={dateRange}
                onChange={(event: any) => {
                  setDateRange(event?.target?.value);
                }}
                label={t('ui.common.timerange', 'Time Range')}
              />
            </Grid>
          </Grid>
          {dateRange === 'Custom' && (
            <Grid item>
              <DateRangePicker
                isFetching={isFetching}
                startDate={customStartDate}
                endDate={customEndDate}
                setStartDate={setCustomStartDate}
                setEndDate={setCustomEndDate}
              />
            </Grid>
          )}
          <Grid item style={{ display: 'flex', alignItems: 'end' }}>
            <ApplyButton
              onClick={() => {
                if (dateRange === 'Custom') {
                  setTransactionDateRange({
                    startDate: customStartDate,
                    endDate: customEndDate,
                  });
                } else {
                  const end: Date = d;
                  const timeRangeNumber = parseInt(dateRange, 10);
                  const start: Date = new Date(
                    d.getTime() - timeRangeNumber * 60 * 60 * 1000
                  );
                  setTransactionDateRange({ startDate: start, endDate: end });
                }
              }}
            />
          </Grid>
          <Grid item style={{ display: 'flex', alignSelf: 'end', flexGrow: 1 }}>
            <Box textAlign="right" width="100%">
              <Button
                variant="text"
                useDomainColorForIcon
                startIcon={<RefreshIcon />}
                onClick={() => {
                  refetch();
                }}
              >
                {t('ui.common.refresh', 'Refresh')}
              </Button>
              <Button
                variant="text"
                disabled={!data?.length}
                useDomainColorForIcon
                startIcon={<DownloadIcon />}
                onClick={openDownloadDialog}
              >
                {t('ui.common.download', 'Download')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box pt={2} pb={1}>
        {isError && (
          <Wrapper topOffset={topOffset}>
            <Box mt={3} style={{ height: '300px' }}>
              <TransitionErrorMessage in />
            </Box>
          </Wrapper>
        )}
        {isLoading && (
          <Wrapper topOffset={topOffset}>
            <Box mt={3} style={{ height: '300px' }}>
              <TransitionLoadingSpinner in />
            </Box>
          </Wrapper>
        )}
        {data && (
          <TransactionJournalTable
            csvExportFilename={csvExportFilename}
            closeDownloadDialog={closeDownloadDialog}
            isDownloading={isDownloading}
            setIsDownloading={setIsDownloading}
            isDownloadDialogOpen={isDownloadDialogOpen}
            data={data}
            transactionDate={transactionDateRange}
          />
        )}
      </Box>
    </Wrapper>
  );
};
export default TransactionDetailsTab;

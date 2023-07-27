import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { EventRecordStatus } from 'api/admin/api';
import DownloadDialog from 'apps/ops/components/DownloadDialog';
import DownloadButton from 'components/DownloadButton';
import PageHeader from 'components/PageHeader';
import RefreshButton from 'components/RefreshButton';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { selectActiveDomainName } from 'redux-app/modules/app/selectors';
import { GeoCsvFormat } from 'types';
import {
  getExportFilenameWithDatetime,
  TableDataForDownload,
  formatCsvSeparator,
} from 'utils/format/dataExport';
import { formatTableDataForCsv } from '../../downloadHelpers';
import {
  GetDisplayableValueOptions,
  InactiveEventSummaryApiHook,
} from '../../types';

interface Props {
  tableStateForDownload: TableDataForDownload<any> | null;
  tableFormatOptions: GetDisplayableValueOptions;
  selectedEventStatus: EventRecordStatus;
  allInactiveEventRecordsForCsvApi?: InactiveEventSummaryApiHook;
  isFetching: boolean;
  isDownloadButtonDisabled?: boolean;
  refetchInactiveRecordsForCsv: () => void;
  refetchRecords: () => void;
}

const PageIntro = ({
  tableStateForDownload,
  tableFormatOptions,
  selectedEventStatus,
  allInactiveEventRecordsForCsvApi,
  isFetching,
  isDownloadButtonDisabled,
  refetchInactiveRecordsForCsv,
  refetchRecords,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const domainName = useSelector(selectActiveDomainName);
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  // #region CSV download/export
  // The changing of the `csvData` state is used to trigger the download of the
  // CSV file (i.e. after the data from the API is populated into the
  // react-table `useTable` instance). Note that if the event status is
  // "Active", there is no API call needed since all the current table data is
  // exported. If the event status is "Inactive" an API call is made to
  // retrieve ALL events.
  const csvLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [csvData, setCsvData] = useState<any>();
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<
    GeoCsvFormat | null | undefined
  >(null);
  const [
    isWaitingForApiDownloadData,
    setIsWaitingForApiDownloadData,
  ] = useState(false);

  const downloadData = () => {
    setCsvData(undefined);
    setIsWaitingForApiDownloadData(false);
    if (selectedEventStatus === EventRecordStatus.Active) {
      const formattedCsvData = formatTableDataForCsv(
        tableStateForDownload,
        tableFormatOptions,
        downloadFormat
      );
      setCsvData(formattedCsvData);
    } else {
      setIsWaitingForApiDownloadData(true);
      refetchInactiveRecordsForCsv();
    }
  };
  const openDownloadDialog = () => {
    setIsDownloadDialogOpen(true);
  };

  const closeDownloadDialog = () => {
    setIsDownloadDialogOpen(false);
    setIsDownloading(false);
  };

  useUpdateEffect(() => {
    if (!isDownloading) {
      setDownloadFormat(null);
    }
  }, [isDownloadDialogOpen]);

  useUpdateEffect(() => {
    if (downloadFormat) {
      downloadData();
    }
  }, [downloadFormat]);

  // Set the CSV data after the API data has been populated into the table
  useEffect(() => {
    if (
      !allInactiveEventRecordsForCsvApi?.isFetching &&
      isWaitingForApiDownloadData &&
      // EventRecordStatus.Inactive is for the paginated table case
      selectedEventStatus === EventRecordStatus.Inactive &&
      tableStateForDownload &&
      !csvData
    ) {
      const formattedCsvData = formatTableDataForCsv(
        tableStateForDownload,
        tableFormatOptions
      );
      setCsvData(formattedCsvData);
      setIsWaitingForApiDownloadData(false);
    }
  }, [
    isWaitingForApiDownloadData,
    allInactiveEventRecordsForCsvApi?.isFetching,
  ]);

  // Trigger the download of the CSV file when csvData changes
  useEffect(() => {
    // @ts-ignore
    if (csvLinkRef.current?.link && csvData) {
      // On Safari, the file gets downloaded before the CSV data can be set.
      // Adding a timeout seems to get around the issue.
      setTimeout(() => {
        closeDownloadDialog();
        // @ts-ignore
        csvLinkRef.current.link.click();
      });
    }
  }, [csvData]);
  // #endregion CSV download/export

  const filenamePrefix = t(
    'exportFilenames.operations.eventSummary',
    '{{domainName}} {{viewType}} Event Summary',
    {
      domainName,
      viewType:
        selectedEventStatus === EventRecordStatus.Active
          ? t('enum.eventrulestatetype.active', 'Active')
          : t('enum.eventrulestatetype.inactive', 'Inactive'),
    }
  );
  const csvExportFilename = getExportFilenameWithDatetime(filenamePrefix);

  return (
    <Grid container spacing={2} alignItems="center" justify="space-between">
      <Grid item>
        <PageHeader dense>{t('ui.common.Events', 'Events')}</PageHeader>
      </Grid>
      <Grid item>
        <Box clone justifyContent={{ xs: 'space-between', md: 'flex-end' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
              <RefreshButton
                onClick={refetchRecords}
                fullWidth
                disabled={isFetching}
              />
            </Grid>
            <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
              <CSVLink
                // @ts-ignore
                ref={csvLinkRef}
                separator={formatCsvSeparator(downloadFormat)}
                data={csvData || []}
                filename={csvExportFilename}
                style={{ display: 'none' }}
              />
              <DownloadDialog
                open={isDownloadDialogOpen}
                handleClose={closeDownloadDialog}
                setDownloadFormat={setDownloadFormat}
                downloadData={downloadData}
                isDownloading={isDownloading}
                setIsDownloading={setIsDownloading}
              />

              <DownloadButton
                disabled={isDownloadButtonDisabled}
                isLoading={allInactiveEventRecordsForCsvApi?.isFetching}
                fullWidth
                onClick={openDownloadDialog}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PageIntro;

/* eslint-disable @typescript-eslint/no-unused-vars */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import { ProblemReportFilter, SortDirectionEnum } from 'api/admin/api';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh.svg';
import DownloadButton from 'components/DownloadButton';
import PageHeader from 'components/PageHeader';
import RefreshButton from 'components/RefreshButton';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomainName } from 'redux-app/modules/app/selectors';
import { getExportFilenameWithDatetime } from 'utils/format/dataExport';
import { formatTableDataForCsv } from '../../downloadHelpers';
import { ProblemReportsApiHook, TableDataForDownload } from '../../types';

interface Props {
  refetchRecords?: () => void;
  filterBy?: ProblemReportFilter;
  filterText?: string | null;
  statusType?: ProblemReportStatusFilterEnum;
  sortColumnName?: string | null;
  sortDirection?: SortDirectionEnum;
  assetSearchExpression?: string | null;
  navigationDomainId?: string | null;
  tableStateForDownload: TableDataForDownload | null;
  allProblemReportsDataApi?: ProblemReportsApiHook;
  isDownloadButtonDisabled?: boolean;
}

const PageIntro = ({
  refetchRecords,
  statusType,
  tableStateForDownload,
  allProblemReportsDataApi,
  isDownloadButtonDisabled,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const domainName = useSelector(selectActiveDomainName);
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  // CSV download/export related hooks.
  // The changing of the `csvData` state is used to trigger the download of the
  // CSV file (i.e. after the data from the API is populated into the
  // react-table `useTable` instance)
  const csvLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [csvData, setCsvData] = useState<any>();
  const [
    isWaitingForApiDownloadData,
    setIsWaitingForApiDownloadData,
  ] = useState(false);

  const downloadData = () => {
    setCsvData(undefined);

    allProblemReportsDataApi?.refetchRecords();
  };

  // Set the CSV data after the API data has been populated into the table
  useEffect(() => {
    if (
      allProblemReportsDataApi?.apiResponse &&
      tableStateForDownload &&
      !csvData
    ) {
      const formattedCsvData = formatTableDataForCsv(tableStateForDownload);

      setCsvData(formattedCsvData);
    }
  }, [tableStateForDownload]);

  // Trigger the download of the CSV file when csvData changes
  useEffect(() => {
    // @ts-ignore
    if (csvLinkRef.current?.link && csvData) {
      // On Safari, the file gets downloaded before the CSV data can be set.
      // Adding a timeout seems to get around the issue.
      setTimeout(() => {
        // @ts-ignore
        csvLinkRef.current.link.click();
      });
    }
  }, [csvData]);

  let statusTypeText = t('ui.common.all', 'All');

  if (statusType === ProblemReportStatusFilterEnum.Open) {
    statusTypeText = t('ui.problemreport.open', 'Open');
  } else if (statusType === ProblemReportStatusFilterEnum.Closed) {
    statusTypeText = t('ui.problemreport.closed', 'Closed');
  }

  const filenamePrefix = t(
    'exportFilenames.operations.problemReports',
    '{{domainName}} {{statusType}} Problem Reports',
    {
      domainName,
      statusType: statusTypeText,
    }
  );
  const csvExportFilename = getExportFilenameWithDatetime(filenamePrefix);

  return (
    <>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PageHeader dense>
                {t('ui.problemreport.problemreports', 'Problem Reports')}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Box
            clone
            justifyContent={['space-between', 'space-between', 'flex-end']}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                {isBelowSmBreakpoint ? (
                  <Tooltip title={t('ui.common.refresh', 'Refresh') as string}>
                    <div>
                      <IconButton aria-label="Refresh" onClick={refetchRecords}>
                        <RefreshIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
                ) : (
                  <RefreshButton onClick={refetchRecords} fullWidth />
                )}
              </Grid>

              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <CSVLink
                  // @ts-ignore
                  ref={csvLinkRef}
                  data={csvData || []}
                  filename={csvExportFilename}
                  style={{ display: 'none' }}
                />
                {isBelowSmBreakpoint ? (
                  <Tooltip
                    title={t('ui.common.download', 'Download') as string}
                  >
                    <div>
                      <IconButton
                        aria-label="Download"
                        disabled={isDownloadButtonDisabled}
                        onClick={downloadData}
                      >
                        <CloudDownloadOutlinedIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
                ) : (
                  <DownloadButton
                    disabled={isDownloadButtonDisabled}
                    isLoading={allProblemReportsDataApi?.isFetching}
                    fullWidth
                    onClick={downloadData}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default PageIntro;

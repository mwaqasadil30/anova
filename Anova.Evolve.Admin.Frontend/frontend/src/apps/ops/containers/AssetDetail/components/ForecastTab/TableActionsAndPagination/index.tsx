import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import DownloadButton from 'components/DownloadButton';
import DownloadDialog from 'apps/ops/components/DownloadDialog';
import PageNumberPagination, {
  Props as PageNumberPaginationProps,
} from 'components/PageNumberPagination';
import PaginationRange, {
  Props as PaginationRangeProps,
} from 'components/PaginationRange';
import ItemCount from 'components/typography/ItemCount';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { GeoCsvFormat } from 'types';
import {
  getExportFilenameWithDatetime,
  TableDataForDownload,
  formatCsvSeparator,
} from 'utils/format/dataExport';
import { formatTableDataForCsv } from '../helpers';

interface Props extends PageNumberPaginationProps, PaginationRangeProps {
  assetTitle?: string | null;
  tableStateForDownload: TableDataForDownload<any> | null;
  shouldShowActions?: boolean;
  shouldDisableActions?: boolean;
  showPaginationControls?: boolean;
}

const TableActionsAndPagination = ({
  assetTitle,
  totalRows,
  pageIndex,
  pageSize,
  items,
  tableStateForDownload,
  showPaginationControls,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  // CSV download/export related hooks.
  // The changing of the `csvData` state is used to trigger the download of the
  // CSV file.
  const csvLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [csvData, setCsvData] = useState<any>();

  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<
    GeoCsvFormat | null | undefined
  >(null);

  const downloadData = () => {
    setCsvData(undefined);
    const formattedCsvData = formatTableDataForCsv(
      tableStateForDownload,
      downloadFormat
    );
    setCsvData(formattedCsvData);
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

  const isDownloadButtonDisabled = totalRows === 0;

  const downloadButton = (
    <DownloadButton
      disabled={isDownloadButtonDisabled}
      onClick={openDownloadDialog}
    />
  );

  const filenamePrefix = t(
    'exportFilenames.assetDetail.forecastTab',
    '{{assetTitle}} forecast readings',
    {
      assetTitle:
        assetTitle || t('ui.common.asset', 'Asset').toLocaleLowerCase(),
    }
  );
  const csvExportFilename = getExportFilenameWithDatetime(filenamePrefix);

  return (
    <Box
      p={0.5}
      minHeight={40}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
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

      {!showPaginationControls ? (
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={4}>
            {downloadButton}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <ItemCount count={totalRows} />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={1} alignItems="center">
          {!isBelowSmBreakpoint && (
            <Grid item xs={12} md={4}>
              {downloadButton}
            </Grid>
          )}

          <Grid item xs md={4}>
            <Box justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
              <PaginationRange
                totalRows={totalRows}
                pageIndex={pageIndex}
                pageSize={pageSize}
                align={isBelowSmBreakpoint ? 'left' : 'center'}
              />
            </Box>
          </Grid>
          <Grid item xs="auto" md={4}>
            <Box
              display="flex"
              justifyContent={['center', 'center', 'flex-end']}
            >
              <PageNumberPagination items={items} />
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default TableActionsAndPagination;

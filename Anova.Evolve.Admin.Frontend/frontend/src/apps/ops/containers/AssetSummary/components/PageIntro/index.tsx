import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Popover from '@material-ui/core/Popover';
import { useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  AssetListFilterOptions,
  AssetSummaryGroupingOptions,
  DataChannelType,
  ListSortDirection,
} from 'api/admin/api';
import DownloadDialog from 'apps/ops/components/DownloadDialog';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import { ReactComponent as FavouriteIcon } from 'assets/icons/favouriteStarThemeable.svg';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh.svg';
import { ReactComponent as ThemableFavouriteIcon } from 'assets/icons/themable-favourite-icon.svg';
import Button from 'components/Button';
import DownloadButton from 'components/DownloadButton';
import PageHeader from 'components/PageHeader';
import RefreshButton from 'components/RefreshButton';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { selectOpsNavigationData } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { GeoCsvFormat, OpsNavItemType } from 'types';
import { formatCsvSeparator } from 'utils/format/dataExport';
import { formatTableDataForCsv } from '../../downloadHelpers';
import { AssetSummaryApiHook, TableDataForDownload } from '../../types';
import DeleteFavouriteDialog from '../FavouriteDialogs/DeleteFavouriteDialog';
import FavouriteEditorDialog from '../FavouriteDialogs/FavouriteEditorDialog';

const StyledFavouriteIcon = styled(ThemableFavouriteIcon)`
  fill: ${(props) => props.theme.custom.domainColor};
`;

const StyledListItemText = styled(ListItemText)`
  & .MuiListItemText-primary {
    font-weight: 500;
    font-size: 14px;
  }
`;

interface Props {
  refetchRecords?: () => void;
  filterBy?: AssetListFilterOptions;
  filterText?: string | null;
  groupByColumn?: AssetSummaryGroupingOptions;
  groupBySortDirection?: ListSortDirection;
  displayUnit?: any;
  dataChannelTypes?: DataChannelType[] | null;
  inventoryStates?: string[] | null;
  sortColumnName?: string | null;
  sortDirection?: ListSortDirection;
  assetSearchExpression?: string | null;
  navigationDomainId?: string | null;
  tableStateForDownload: TableDataForDownload | null;
  allAssetSummaryDataApi?: AssetSummaryApiHook;
  isDownloadButtonDisabled?: boolean;
}

const PageIntro = ({
  refetchRecords,
  filterBy,
  filterText,
  groupByColumn,
  groupBySortDirection,
  displayUnit,
  dataChannelTypes,
  inventoryStates,
  sortColumnName,
  sortDirection,
  assetSearchExpression,
  navigationDomainId,
  tableStateForDownload,
  allAssetSummaryDataApi,
  isDownloadButtonDisabled,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));
  const opsNavData = useSelector(selectOpsNavigationData);

  // Popover
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isAddFavouriteDialogOpen, setIsAddFavouriteDialogOpen] = useState(
    false
  );

  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<
    GeoCsvFormat | null | undefined
  >(null);

  // CSV download/export related hooks.
  // The changing of the `csvData` state is used to trigger the download of the
  // CSV file (i.e. after the data from the API is populated into the
  // react-table `useTable` instance)
  const csvLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [csvData, setCsvData] = useState<any>();

  const [
    isDeleteFavouriteDialogOpen,
    setIsDeleteFavouriteDialogOpen,
  ] = useState(false);

  const openAddFavouriteDialog = () => {
    setIsAddFavouriteDialogOpen(true);
  };
  const closeAddFavouriteDialog = () => {
    setIsAddFavouriteDialogOpen(false);
    setAnchorEl(null);
  };

  const openDeleteFavouriteDialog = () => {
    setIsDeleteFavouriteDialogOpen(true);
  };
  const closeDeleteFavouriteDialog = () => {
    setIsDeleteFavouriteDialogOpen(false);
    setAnchorEl(null);
  };

  const openDownloadDialog = () => {
    setIsDownloadDialogOpen(true);
  };
  const closeDownloadDialog = () => {
    setIsDownloadDialogOpen(false);
    setAnchorEl(null);
    setIsDownloading(false);
  };

  const downloadData = () => {
    setCsvData(undefined);
    allAssetSummaryDataApi?.refetchRecords();
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
      !allAssetSummaryDataApi?.isFetching &&
      tableStateForDownload &&
      !csvData
    ) {
      const formattedCsvData = formatTableDataForCsv(
        tableStateForDownload,
        downloadFormat
      );
      setCsvData(formattedCsvData);
    }
  }, [tableStateForDownload, csvData]);

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

  return (
    <>
      {opsNavData?.type === OpsNavItemType.Favourite && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{ style: { width: 80 } }}
        >
          <List>
            <ListItem button dense onClick={openAddFavouriteDialog}>
              <StyledListItemText primary={t('ui.common.edit', 'Edit')} />
            </ListItem>
            <ListItem button dense onClick={openDeleteFavouriteDialog}>
              <StyledListItemText primary={t('ui.common.delete', 'Delete')} />
            </ListItem>
          </List>
        </Popover>
      )}
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PageHeader dense>
                {t('ui.main.assetSummary', 'Asset Summary')}
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
                {opsNavData?.type === OpsNavItemType.Favourite ? (
                  <>
                    {isBelowSmBreakpoint ? (
                      <Tooltip
                        // @ts-ignore
                        title={t('ui.main.editFavourite', 'Edit Favourite')}
                      >
                        <div>
                          <IconButton
                            aria-label="Favourite"
                            onClick={handleClick}
                          >
                            <StyledFavouriteIcon />
                          </IconButton>
                        </div>
                      </Tooltip>
                    ) : (
                      <Button
                        variant="text"
                        startIcon={<StyledFavouriteIcon />}
                        fullWidth
                        onClick={handleClick}
                      >
                        {t('ui.main.favourite', 'Favourite')}
                      </Button>
                    )}

                    <DeleteFavouriteDialog
                      open={isDeleteFavouriteDialogOpen}
                      handleClose={closeDeleteFavouriteDialog}
                      favourite={opsNavData.item}
                    />
                  </>
                ) : isBelowSmBreakpoint ? (
                  // @ts-ignore
                  <Tooltip title={t('ui.main.addfavourite', 'Add Favourite')}>
                    <div>
                      <IconButton
                        aria-label="Add Favourite"
                        onClick={openAddFavouriteDialog}
                      >
                        <FavouriteIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
                ) : (
                  <Button
                    variant="text"
                    useDomainColorForIcon
                    onClick={openAddFavouriteDialog}
                    startIcon={<FavouriteIcon />}
                    fullWidth
                  >
                    {t('ui.main.addfavourite', 'Add Favourite')}
                  </Button>
                )}
                <FavouriteEditorDialog
                  open={isAddFavouriteDialogOpen}
                  handleClose={closeAddFavouriteDialog}
                  favourite={
                    opsNavData?.type === OpsNavItemType.Favourite
                      ? opsNavData.item
                      : null
                  }
                  // filters
                  filterBy={filterBy}
                  filterText={filterText}
                  groupByColumn={groupByColumn}
                  groupBySortDirection={groupBySortDirection}
                  displayUnit={displayUnit}
                  dataChannelTypes={dataChannelTypes}
                  inventoryStates={inventoryStates}
                  sortColumnName={sortColumnName}
                  sortDirection={sortDirection}
                  assetSearchExpression={assetSearchExpression}
                  navigationDomainId={navigationDomainId}
                />
              </Grid>
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
                  separator={formatCsvSeparator(downloadFormat)}
                  data={csvData || []}
                  filename="asset-summary.csv"
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
                        onClick={openDownloadDialog}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
                ) : (
                  <DownloadButton
                    disabled={isDownloadButtonDisabled}
                    isLoading={allAssetSummaryDataApi?.isFetching}
                    fullWidth
                    onClick={openDownloadDialog}
                  />
                )}
                <DownloadDialog
                  open={isDownloadDialogOpen}
                  handleClose={closeDownloadDialog}
                  setDownloadFormat={setDownloadFormat}
                  downloadData={downloadData}
                  isDownloading={isDownloading}
                  setIsDownloading={setIsDownloading}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default PageIntro;

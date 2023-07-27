import Grid from '@material-ui/core/Grid';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { usePagination as useMuiPagination } from '@material-ui/lab/Pagination';
import {
  EditAssetDataChannel,
  EvolveDeleteDataChannelRequest,
  EvolveProblemDetails,
  EvolveRetrieveAssetEditDetailsByIdResponse as Response,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { FormikProps } from 'formik';
import get from 'lodash/get';
import React, { useState } from 'react';
import DataChannelsTable from './components/DataChannelTable';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';

const getKeysWithTruthyValues = (obj: Record<any, boolean>) => {
  return Object.entries(obj)
    .filter(([_, value]) => !!value)
    .map(([key]) => key);
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  })
);

const defaultRecords: EditAssetDataChannel[] = [];

export const utilizedFieldsNamespace = 'asset';

const DataChannelsTab = ({ formik }: { formik: FormikProps<Response> }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<
    any | EvolveProblemDetails | null
  >(null);
  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const records = formik.values.asset?.dataChannels || defaultRecords;
  const { items } = useMuiPagination({
    showFirstButton: true,
    showLastButton: true,
    count: 1,
    page: 1,
  });

  const openDeletionDialog = () => {
    setIsDeletionDialogOpen(true);
  };
  const closeDeletionDialog = () => {
    setIsDeletionDialogOpen(false);
    setDeleteError(null);
  };

  const handleAddDataChannels = (dataChannels: any[]) => {
    formik.setFieldValue(
      'asset.dataChannels',
      [...records, ...dataChannels].filter(Boolean)
    );
    setSelectedRows({});
  };

  const deleteDataChannelsByIds = (dataChannelIds: string[]) => {
    const assetId = formik.values.asset?.assetId;

    setIsDeleting(true);
    setDeleteError(null);
    return ApiService.DataChannelService.deleteDataChannel_DeleteDataChannel({
      assetId,
      dataChannelId: dataChannelIds,
    } as EvolveDeleteDataChannelRequest)
      .then(() => {
        const remainingDataChannels = records.filter(
          (record) =>
            !record.dataChannelId ||
            !dataChannelIds.includes(record.dataChannelId!)
        );
        formik.setFieldValue(
          'asset.dataChannels',
          remainingDataChannels.filter(Boolean)
        );
        setSelectedRows({});
      })
      .catch((error) => {
        setDeleteError(error);
        throw error;
      })
      .finally(() => setIsDeleting(false));
  };

  const handleRemoveSelectedDataChannels = () => {
    openDeletionDialog();
  };

  const deleteSelectedDataChannels = () => {
    const selectedDataChannelIds = getKeysWithTruthyValues(selectedRows);
    deleteDataChannelsByIds(selectedDataChannelIds)
      .then(() => {
        closeDeletionDialog();
      })
      .catch();
  };

  const selectedRowCount = Object.values(selectedRows).filter(Boolean).length;
  const shouldDisableActions = selectedRowCount === 0;

  const editComponentsResult = formik.values.asset;

  const dataChannels = editComponentsResult?.dataChannels;
  const selectedDataChannelIds = getKeysWithTruthyValues(selectedRows);
  const selectedDataChannels = dataChannels?.filter((dataChannel) =>
    selectedDataChannelIds.includes(dataChannel.dataChannelId!)
  );

  const dataChannelTemplates =
    formik.values.assetEditOptions?.dataChannelTemplates;
  const eventRuleGroups = formik.values.assetEditOptions?.eventRuleGroups;

  return (
    <div className={classes.root}>
      <DeletionWarningDialog
        open={isDeletionDialogOpen}
        handleCancel={closeDeletionDialog}
        handleConfirm={deleteSelectedDataChannels}
        hasError={!!deleteError}
        errorMessage={deleteError?.validationErrors?.dataChannelId}
        isDeleting={isDeleting}
        recordCount={selectedDataChannels?.length || 0}
      >
        <ul>
          {selectedDataChannels?.map((channel) => {
            return (
              <li>
                <Typography>
                  {channel.description}{' '}
                  {channel.productDescription &&
                    `- ${channel.productDescription}`}
                </Typography>
              </li>
            );
          })}
        </ul>
      </DeletionWarningDialog>
      {/*
        TODO: At some point it may be worth replacing these hard-coded values
        with something like `react-sticky`.
      */}
      <PageIntroWrapper sticky topOffset={isBelowSmBreakpoint ? 236 : 180}>
        <PageIntro
          assetId={editComponentsResult?.assetId}
          dataChannels={dataChannels}
          selectedDataChannels={selectedDataChannels}
          editComponentsResult={editComponentsResult}
          handleAddDataChannels={handleAddDataChannels}
          dataChannelTemplates={dataChannelTemplates}
          eventRuleGroups={eventRuleGroups}
        />
      </PageIntroWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div>
            {records.length > 0 && (
              <TableActionsAndPagination
                showActions
                disableActions={shouldDisableActions}
                handleRemoveDataChannels={handleRemoveSelectedDataChannels}
                totalRows={get(formik.values, `asset.dataChannels.length`) || 0}
                pageIndex={0}
                pageSize={get(formik.values, `asset.dataChannels.length`) || 0}
                align="center"
                items={items}
              />
            )}
          </div>
          <DataChannelsTable
            formik={formik}
            setSelectedRows={setSelectedRows}
            selectedRows={selectedRows}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DataChannelsTab;

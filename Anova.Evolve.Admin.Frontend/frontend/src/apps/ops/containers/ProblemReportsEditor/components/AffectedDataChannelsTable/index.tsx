import IconButton from '@material-ui/core/IconButton';
import MuiLink from '@material-ui/core/Link';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ProblemReportAffectedDataChannelDto } from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import routes from 'apps/ops/routes';
import { ReactComponent as DeleteTrashIcon } from 'assets/icons/trash-simple.svg';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import EmptyContent from 'components/EmptyContent';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { generatePath, Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { convertToNumber } from 'utils/forms/values';
import { useDeleteProblemReportAffectedDataChannel } from '../../hooks/useDeleteAffectedDataChannel';
import { useUpdateProblemReportAffectedDataChannel } from '../../hooks/useUpdateAffectedDataChannel';

const StyledTableContainer = styled(TableContainer)`
  max-height: 300px;
`;

const CustomSizedTable = styled(Table)`
  min-width: 2000px;
`;

const PaddedHeadCell = styled(TableHeadCell)`
  padding: 12px 16px;
  width: ${({ width }: { width: number }) => `${width}px`};
`;

const PaddedCell = styled(TableCell)`
  padding: 0px 16px;
`;

const CellDarkText = styled(Typography)`
  font-weight: 500;
  font-size: 15px;
  color: ${(props) => props.theme.palette.text.primary};
`;

const CustomTrashIcon = styled(DeleteTrashIcon)`
  height: 17px;
  width: 17px;
  color: ${(props) => props.theme.palette.text.primary};
`;

const DeleteNotePreviewText = styled(Typography)`
  font-size: 14px;
  font-style: italic;
`;

interface RouteParams {
  problemReportId?: string;
}

interface Props {
  affectedDataChannels?: ProblemReportAffectedDataChannelDto[] | null;
  isFetching: boolean;
  canUpdateProblemReport?: boolean;
}

const AffectedDataChannelsTable = ({
  affectedDataChannels,
  isFetching,
  canUpdateProblemReport,
}: Props) => {
  const { t } = useTranslation();

  const params = useParams<RouteParams>();
  const editingProblemReportId = convertToNumber(params.problemReportId);

  const queryClient = useQueryClient();

  // #region isPrimary & isFaulty checkbox api / handlers
  const updateAffectedDataChannelApi = useUpdateProblemReportAffectedDataChannel(
    {
      onSuccess: () => {
        queryClient.invalidateQueries(APIQueryKey.getProblemReportDetails);
      },
    }
  );

  const handleIsFaultyToggle = (
    affectedDataChannel: ProblemReportAffectedDataChannelDto,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateAffectedDataChannelApi
      .mutateAsync({
        problemReportId: editingProblemReportId!,
        affectedDataChannelId: affectedDataChannel.dataChannelId!,
        isFaulty: event.target.checked,
        isPrimary: affectedDataChannel.isPrimary!,
      })
      .catch(() => {});
  };

  const handleIsPrimaryToggle = (
    affectedDataChannel: ProblemReportAffectedDataChannelDto
  ) => {
    updateAffectedDataChannelApi
      .mutateAsync({
        problemReportId: editingProblemReportId!,
        affectedDataChannelId: affectedDataChannel.dataChannelId!,
        isFaulty: affectedDataChannel.isFaulty!,
        isPrimary: true,
      })
      .catch(() => {});
  };
  // #endregion isPrimary & isFaulty checkbox api / handlers

  const [
    selectedAffectedDataChannelToDelete,
    setSelectedAffectedDataChannelToDelete,
  ] = useState<ProblemReportAffectedDataChannelDto | null>();

  // Delete Affected Data Channels Dialog and API
  const [
    isDeleteAffectedDataChannelDialogOpen,
    setIsDeleteAffectedDataChannelDialogOpen,
  ] = React.useState(false);

  const handleOpenDeleteAffectedDataChannelDialog = (
    affectedDataChannel: ProblemReportAffectedDataChannelDto
  ) => {
    setIsDeleteAffectedDataChannelDialogOpen(true);
    setSelectedAffectedDataChannelToDelete(affectedDataChannel);
  };

  const deleteApi = useDeleteProblemReportAffectedDataChannel({
    onSuccess: () => {
      queryClient.refetchQueries(APIQueryKey.getProblemReportDetails);
    },
  });

  const handleCloseDeleteAffectedDataChannelDialog = () => {
    setIsDeleteAffectedDataChannelDialogOpen(false);
    setSelectedAffectedDataChannelToDelete(null);
    deleteApi.reset(); // Clear any old error state, if any.
  };

  const handleDeleteAffectedDataChannel = () => {
    deleteApi
      .mutateAsync({
        problemReportId: editingProblemReportId!,
        affectedDataChannelId: selectedAffectedDataChannelToDelete?.dataChannelId!,
      })
      .then(() => {
        handleCloseDeleteAffectedDataChannelDialog();
      })
      .catch(() => {});
  };

  return (
    <>
      <StyledTableContainer>
        <CustomSizedTable stickyHeader>
          <TableHead>
            <TableRow>
              <TableHeadCell style={{ width: 10 }} />
              <PaddedHeadCell width={45}>
                {t('ui.problemreport.primary', 'Primary')}
              </PaddedHeadCell>
              <PaddedHeadCell width={45}>
                {t('ui.problemreport.faulty', 'Faulty')}
              </PaddedHeadCell>
              <PaddedHeadCell width={70}>
                {t('enum.problemreportdatachannelfilterby.shipto', 'Ship To')}*
              </PaddedHeadCell>
              <PaddedHeadCell width={300}>
                {t('ui.common.asset', 'Asset')}
              </PaddedHeadCell>
              <PaddedHeadCell width={150}>
                {t('ui.common.description', 'Description')}*
              </PaddedHeadCell>
              <PaddedHeadCell width={100}>
                {t('ui.common.rtu', 'RTU')}*
              </PaddedHeadCell>
              <PaddedHeadCell width={100}>
                {t('ui.common.channel', 'Channel')}*
              </PaddedHeadCell>
              <PaddedHeadCell width={100}>
                {t('ui.common.scaledmax', 'Scaled Max')}
              </PaddedHeadCell>
              <PaddedHeadCell width={150}>
                {t(
                  'ui.problemreport.devicenetworkaddress',
                  'Device Network Address'
                )}
              </PaddedHeadCell>
              <PaddedHeadCell width={130}>
                {t('ui.problemreport.businessunit', 'Business Unit')}
              </PaddedHeadCell>
              <PaddedHeadCell width={100}>
                {t('ui.problemreport.region', 'Region')}
              </PaddedHeadCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!affectedDataChannels?.length ? (
              <TableCell colSpan={12}>
                <EmptyContent>
                  {t(
                    'ui.problemReportsEditor.noAffectedDataChannels',
                    'No affected data channels'
                  )}
                </EmptyContent>
              </TableCell>
            ) : (
              affectedDataChannels?.map((affectedDataChannel) => {
                return (
                  <TableRow style={{ height: 42 }}>
                    <TableCell style={{ padding: 0 }} align="center">
                      {!affectedDataChannel.isPrimary && (
                        <IconButton
                          onClick={() => {
                            handleOpenDeleteAffectedDataChannelDialog(
                              affectedDataChannel
                            );
                          }}
                          disabled={!canUpdateProblemReport}
                        >
                          <CustomTrashIcon />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell style={{ padding: 0 }} align="center">
                      <Checkbox
                        style={{ padding: 5 }}
                        checked={affectedDataChannel.isPrimary!}
                        onChange={() => {
                          handleIsPrimaryToggle(affectedDataChannel);
                        }}
                        disabled={
                          !canUpdateProblemReport ||
                          updateAffectedDataChannelApi.isLoading ||
                          isFetching ||
                          affectedDataChannel.isPrimary!
                        }
                      />
                    </TableCell>
                    <TableCell style={{ padding: 0 }} align="center">
                      <Checkbox
                        style={{ padding: 5 }}
                        checked={affectedDataChannel.isFaulty!}
                        onChange={(event) => {
                          handleIsFaultyToggle(affectedDataChannel, event);
                        }}
                        disabled={
                          !canUpdateProblemReport ||
                          updateAffectedDataChannelApi.isLoading ||
                          isFetching
                        }
                      />
                    </TableCell>
                    <PaddedCell>{affectedDataChannel.shipToNumber}</PaddedCell>
                    <PaddedCell>
                      {affectedDataChannel.assetId ? (
                        <CellDarkText>
                          <MuiLink
                            component={Link}
                            to={generatePath(routes.assetSummary.detail, {
                              assetId: affectedDataChannel.assetId!,
                            })}
                            color="inherit"
                            underline="always"
                          >
                            {affectedDataChannel.assetTitle}
                          </MuiLink>
                        </CellDarkText>
                      ) : (
                        <CellDarkText>-</CellDarkText>
                      )}
                    </PaddedCell>
                    <PaddedCell>{affectedDataChannel.description}</PaddedCell>
                    <PaddedCell>
                      {/* NOTE/TODO: will need a linkTo/styling once RTU editor is implemented */}
                      <CellDarkText>
                        {affectedDataChannel.deviceId}
                      </CellDarkText>
                    </PaddedCell>
                    <PaddedCell>{affectedDataChannel.channelNumber}</PaddedCell>
                    <PaddedCell>{affectedDataChannel.scaledMax}</PaddedCell>
                    <PaddedCell>
                      {affectedDataChannel.deviceNetworkAddress}
                    </PaddedCell>
                    <PaddedCell>{affectedDataChannel.businessUnit}</PaddedCell>
                    <PaddedCell>{affectedDataChannel.region}</PaddedCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </CustomSizedTable>
      </StyledTableContainer>

      <DeletionWarningDialog
        open={isDeleteAffectedDataChannelDialogOpen}
        handleCancel={handleCloseDeleteAffectedDataChannelDialog}
        handleConfirm={handleDeleteAffectedDataChannel}
        hasError={deleteApi.isError}
        errorMessage={t('ui.common.failedToDelete', 'Failed to delete')}
        isDeleting={deleteApi.isLoading}
        recordCount={1}
      >
        <DeleteNotePreviewText>
          {selectedAffectedDataChannelToDelete?.description}
        </DeleteNotePreviewText>
      </DeletionWarningDialog>
    </>
  );
};

export default AffectedDataChannelsTable;

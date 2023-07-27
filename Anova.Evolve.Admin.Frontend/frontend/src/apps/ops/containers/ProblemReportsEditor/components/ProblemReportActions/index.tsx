import Grid from '@material-ui/core/Grid';
import {
  ProblemReportStatusEnum,
  UserPermissionType,
  UserWatchListDto,
  WatchListTypeEnum,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import { useDeleteWatchList } from 'apps/ops/hooks/useDeleteWatchList';
import { useGetUserWatchlist } from 'apps/ops/hooks/useGetUserWatchlist';
import { useSaveWatchList } from 'apps/ops/hooks/useSaveWatchList';
import { ReactComponent as WatchlistIcon } from 'assets/icons/asset-detail-watchlist-icon.svg';
import { ReactComponent as ClosePRCheckmarkIcon } from 'assets/icons/close-pr-checkmark.svg';
import { ReactComponent as PaperAirPlaneIcon } from 'assets/icons/paper-air-plane.svg';
import Button from 'components/Button';
import PageSubHeader from 'components/PageSubHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import {
  selectHasPermission,
  selectUserId,
} from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';

interface RouteParams {
  problemReportId: string;
}

interface Props {
  problemReportStatusType?: ProblemReportStatusEnum;
  handleOpenCloseProblemReportDialog: () => void;
  openSendEmailDrawer: () => void;
}

const ProblemReportActions = ({
  problemReportStatusType,
  handleOpenCloseProblemReportDialog,
  openSendEmailDrawer,
}: Props) => {
  const { t } = useTranslation();

  const hasPermission = useSelector(selectHasPermission);

  const canCloseProblemReport = hasPermission(
    UserPermissionType.ProblemReportClose,
    AccessType.Update
  );

  const domainId = useSelector(selectActiveDomainId);
  const userId = useSelector(selectUserId);

  const params = useParams<RouteParams>();

  const editingProblemReportId = params.problemReportId;

  const queryClient = useQueryClient();

  const isOpenProblemReport =
    problemReportStatusType === ProblemReportStatusEnum.Open;

  // Watchlist hooks
  const getWatchListItemsApi = useGetUserWatchlist(userId, domainId);
  const saveWatchListApi = useSaveWatchList({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getUserWatchList);
    },
  });
  const deleteWatchListApi = useDeleteWatchList({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getUserWatchList);
    },
  });

  const addToWatchlist = () => {
    return saveWatchListApi.mutate({
      domainId,
      userId,
      watchListTypeId: WatchListTypeEnum.ProblemReports,
      intItemId: Number(editingProblemReportId),
    } as UserWatchListDto);
  };

  const currentAssetInWatchList = getWatchListItemsApi?.data?.find(
    (item) => item.intItemId === Number(editingProblemReportId)
  );

  const removeFromWatchlist = () => {
    const editingProblemReportIdAsNumber = Number(editingProblemReportId);

    return deleteWatchListApi.mutate({
      domainId,
      userId,
      watchListTypeId: WatchListTypeEnum.ProblemReports,
      intItemId: editingProblemReportIdAsNumber,
    } as UserWatchListDto);
  };

  return (
    <Grid container alignItems="center" justify="space-between">
      <Grid item>
        <PageSubHeader dense>
          {t('ui.common.generalinfo', 'General Information')}
        </PageSubHeader>
      </Grid>
      <Grid item>
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            {currentAssetInWatchList ? (
              <Button
                useDomainColorForIcon
                startIcon={<WatchlistIcon />}
                onClick={removeFromWatchlist}
                disabled={
                  deleteWatchListApi.isLoading ||
                  getWatchListItemsApi.isFetching
                }
                aria-label="Change watchlist status"
              >
                {t('ui.main.removefromwatchlist', 'Remove From Watch List')}
              </Button>
            ) : (
              <Button
                useDomainColorForIcon
                startIcon={<WatchlistIcon />}
                onClick={addToWatchlist}
                disabled={
                  saveWatchListApi.isLoading || getWatchListItemsApi.isFetching
                }
                aria-label="Change watchlist status"
              >
                {t('ui.main.addtowatchlist', 'Add To Watch List')}
              </Button>
            )}
          </Grid>
          <Grid item>
            <Button
              useDomainColorForIcon
              startIcon={<PaperAirPlaneIcon />}
              onClick={openSendEmailDrawer}
              aria-label="Send email"
            >
              {t('ui.problemreport.sendemail', 'Send Email')}
            </Button>
          </Grid>
          {canCloseProblemReport && (
            <Grid item>
              <Button
                useDomainColorForIcon
                startIcon={<ClosePRCheckmarkIcon />}
                onClick={handleOpenCloseProblemReportDialog}
                aria-label={
                  isOpenProblemReport
                    ? 'Close problem report'
                    : 'Reopen problem report'
                }
              >
                {isOpenProblemReport
                  ? t('ui.problemreport.close', 'Close PR')
                  : t('ui.problemreport.reopenPr', 'Reopen PR')}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProblemReportActions;

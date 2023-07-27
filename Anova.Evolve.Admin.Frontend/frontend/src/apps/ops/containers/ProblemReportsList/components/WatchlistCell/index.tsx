import Grid from '@material-ui/core/Grid';
import {
  ProblemReport_SummaryDto,
  UserWatchListDto,
  WatchListTypeEnum,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import { useDeleteWatchList } from 'apps/ops/hooks/useDeleteWatchList';
import { useSaveWatchList } from 'apps/ops/hooks/useSaveWatchList';
import { ReactComponent as WatchlistIcon } from 'assets/icons/asset-detail-watchlist-icon.svg';
import Button from 'components/Button';
import React from 'react';
import { useQueryClient } from 'react-query';
import { Cell } from 'react-table';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  && {
    padding: 6px 6px 6px 5px;
    min-width: 20px;
  }
`;

const FadedWatchlistIcon = styled(WatchlistIcon)`
  color: #9e9e9e;
`;

interface Props<T extends object> extends Cell<T> {
  userId?: string;
  domainId?: string;
  isInWatchlist: boolean;
  record?: ProblemReport_SummaryDto | null;
}

function WatchlistCell<T extends object>({
  userId,
  domainId,
  isInWatchlist,
  record,
}: Props<T>) {
  const queryClient = useQueryClient();

  // Watchlist hooks
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
      intItemId: record?.problemReportId,
    } as UserWatchListDto);
  };

  const removeFromWatchlist = () => {
    return deleteWatchListApi.mutate({
      domainId,
      userId,
      watchListTypeId: WatchListTypeEnum.ProblemReports,
      intItemId: record?.problemReportId,
    } as UserWatchListDto);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item>
          {isInWatchlist ? (
            <StyledButton
              aria-label="Remove from watch list"
              onClick={removeFromWatchlist}
              useDomainColorForIcon
            >
              <WatchlistIcon />
            </StyledButton>
          ) : (
            <StyledButton
              aria-label="Add to watch list"
              onClick={addToWatchlist}
              disabled={saveWatchListApi.isLoading}
            >
              <FadedWatchlistIcon />
            </StyledButton>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default WatchlistCell;

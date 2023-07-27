/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { UserWatchListDto, WatchListTypeEnum } from 'api/admin/api';
import { useGetUserWatchlist } from 'apps/ops/hooks/useGetUserWatchlist';
import opsRoutes from 'apps/ops/routes';
import { ReactComponent as WatchlistEye } from 'assets/icons/watchlist-eye.svg';
import CircularProgress from 'components/CircularProgress';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, Link, matchPath, useLocation } from 'react-router-dom';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import {
  selectCanReadProblemReportDetails,
  selectUserId,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { DomainThemeColor } from 'styles/colours';
import { RouteParams, TabPanel } from '../../helpers';
import {
  StyledListItemIcon,
  StyledListItemText,
  StyledNavMenuItemIcon,
} from '../../styles';

const StyledWatchlistEye = styled(WatchlistEye)`
  color: ${(props) =>
    props.theme.custom.domainColor === DomainThemeColor.Yellow &&
    props.theme.palette.type === 'light'
      ? '#464646'
      : props.theme.custom.domainColor};
`;

interface WatchlistTabProps {
  selectedTab: number;
  handleClose: () => void;
}

const WatchlistTab = ({ selectedTab, handleClose }: WatchlistTabProps) => {
  const { t } = useTranslation();

  const domainId = useSelector(selectActiveDomainId);
  const userId = useSelector(selectUserId);

  const watchlistApi = useGetUserWatchlist(userId, domainId);
  const watchlistData = watchlistApi.data;

  const location = useLocation();
  const canReadProblemReportDetails = useSelector(
    selectCanReadProblemReportDetails
  );

  const matchAsset = matchPath<RouteParams>(location.pathname, {
    path: opsRoutes.assetSummary.detail,
  });
  const matchProblemReport = matchPath<RouteParams>(location.pathname, {
    path: opsRoutes.problemReports.edit,
  });

  const isSelectedWatchlistItem = (currentItem: UserWatchListDto) => {
    // Asset Detail
    if (currentItem.watchListTypeId === WatchListTypeEnum.AssetDetails) {
      return matchAsset?.params.assetId === currentItem.guidItemId;
    }
    // Problem Report
    if (currentItem.watchListTypeId === WatchListTypeEnum.ProblemReports) {
      return (
        Number(matchProblemReport?.params.problemReportId) ===
        currentItem.intItemId
      );
    }

    return false;
  };

  const generatePathForWatchlistItem = (currentItem: UserWatchListDto) => {
    // Asset Detail
    if (currentItem.watchListTypeId === WatchListTypeEnum.AssetDetails) {
      return generatePath(opsRoutes.assetSummary.detail, {
        assetId: currentItem.guidItemId as string,
      });
    }
    // Problem Report
    if (currentItem.watchListTypeId === WatchListTypeEnum.ProblemReports) {
      return generatePath(opsRoutes.problemReports.edit, {
        problemReportId: currentItem.intItemId!.toString() as string,
      });
    }

    return '';
  };

  const { isFetching, isError } = watchlistApi;

  if (isFetching || isError) {
    return (
      <TabPanel value={selectedTab} index={0}>
        <Box p={2} height={150}>
          <Grid container spacing={2} alignItems="center" justify="center">
            <Grid item>
              {isFetching && <CircularProgress />}

              {isError && (
                <TransitionErrorMessage in={!isFetching && isError} />
              )}
            </Grid>
          </Grid>
        </Box>
      </TabPanel>
    );
  }

  return (
    <TabPanel value={selectedTab} index={0}>
      {!watchlistData?.length ? (
        <MessageBlock height={125}>
          <Box>
            <StyledNavMenuItemIcon as={StyledWatchlistEye} size="large" />
          </Box>
          <LargeBoldDarkText>
            {t('ui.assetnav.noWatchedItemsFound', 'No watched items found')}
          </LargeBoldDarkText>
        </MessageBlock>
      ) : (
        <List component="nav" aria-label="Watchlist items nav">
          {watchlistData
            .filter(
              (item) =>
                (item.watchListTypeId === WatchListTypeEnum.AssetDetails &&
                  item.guidItemId) ||
                (item.watchListTypeId === WatchListTypeEnum.ProblemReports &&
                  item.intItemId &&
                  canReadProblemReportDetails)
            )
            .map((item, index) => {
              return (
                <ListItem
                  key={index}
                  button
                  selected={isSelectedWatchlistItem(item)}
                  onClick={() => {
                    handleClose();
                  }}
                  component={Link}
                  to={generatePathForWatchlistItem(item)}
                >
                  <StyledListItemIcon>
                    <StyledNavMenuItemIcon as={StyledWatchlistEye} />
                  </StyledListItemIcon>
                  <StyledListItemText
                    primary={item.description}
                    aria-label="Watchlist item title"
                  />
                </ListItem>
              );
            })}
        </List>
      )}
    </TabPanel>
  );
};

export default WatchlistTab;

/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import {
  AssetDetailGetResp,
  UserWatchListDto,
  WatchListTypeEnum,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import { useDeleteWatchList } from 'apps/ops/hooks/useDeleteWatchList';
import { useGetUserWatchlist } from 'apps/ops/hooks/useGetUserWatchlist';
import { useSaveWatchList } from 'apps/ops/hooks/useSaveWatchList';
import { ReactComponent as RefreshIcon } from 'assets/icons/asset-detail-refresh-icon.svg';
import { ReactComponent as WatchlistIcon } from 'assets/icons/asset-detail-watchlist-icon.svg';
import { ReactComponent as EllipsisIcon } from 'assets/icons/card-ellipsis.svg';
import { ReactComponent as TrendingUpIcon } from 'assets/icons/trending-up.svg';
import Button from 'components/Button';
import BackIconButton from 'components/buttons/BackIconButton';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import IconWithDomainThemeColor from 'components/IconWithDomainThemeColor';
import Menu from 'components/Menu';
import PageHeader from 'components/PageHeader';
import RefreshButton from 'components/RefreshButton';
import Tab from 'components/Tab';
import Tabs from 'components/Tabs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import {
  selectActiveDomain,
  selectHasVirtualFlowMeterEnabled,
} from 'redux-app/modules/app/selectors';
import { selectUserId } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AssetDetailTab } from '../../types';
import VirtualFlowMeterDrawer from '../VirtualFlowMeterDrawer';

const StyledBox = styled(Box)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

const StyledMenuItem = styled(MenuItem)`
  min-width: 200px;

  & .MuiListItemIcon-root {
    min-width: 36px;
  }
`;

const StyledMenuItemText = styled(ListItemText)`
  & .MuiListItemText-primary {
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => props.theme.palette.text.primary};
  }
`;

const StyledEllipsisIcon = styled(EllipsisIcon)`
  color: ${(props) => props.theme.palette.text.primary};
`;

interface Props {
  assetTitle?: string | null;
  activeTab: AssetDetailTab;
  canViewEvents?: boolean;
  canViewMap?: boolean;
  canViewReadings?: boolean;
  assetDetails: AssetDetailGetResp | null;
  handleTabChange: (event: React.ChangeEvent<{}>, newValue: unknown) => void;
  refetchRecords: () => void;
}

const PageIntro = ({
  assetTitle,
  activeTab,
  canViewEvents,
  canViewMap,
  canViewReadings,
  assetDetails,
  handleTabChange,
  refetchRecords,
}: Props) => {
  const { t } = useTranslation();
  const activeDomain = useSelector(selectActiveDomain);
  const hasVirtualFlowMeterEnabled = useSelector(
    selectHasVirtualFlowMeterEnabled
  );

  const domainId = assetDetails?.asset?.domainId || activeDomain?.domainId;

  const userId = useSelector(selectUserId);

  const [
    isVirtualFlowMeterDrawerOpen,
    setIsVirtualFlowMeterDrawerOpen,
  ] = useState(false);

  const [
    buttonMenuAnchorEl,
    setButtonMenuAnchorEl,
  ] = React.useState<null | HTMLElement>(null);
  const handleButtonMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setButtonMenuAnchorEl(event.currentTarget);
  };
  const handleButtonMenuClose = () => {
    setButtonMenuAnchorEl(null);
  };

  const queryClient = useQueryClient();

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
      description: assetDetails?.asset?.assetTitle,
      watchListTypeId: WatchListTypeEnum.AssetDetails,
      guidItemId: assetDetails?.asset?.assetId,
    } as UserWatchListDto);
  };

  const currentAssetInWatchList = getWatchListItemsApi?.data?.find(
    (item) => item.guidItemId === assetDetails?.asset?.assetId
  );

  const selectedWatchListAssetGuid = currentAssetInWatchList?.guidItemId;

  const removeFromWatchlist = () => {
    return deleteWatchListApi.mutate({
      domainId,
      userId,
      description: assetDetails?.asset?.assetTitle,
      watchListTypeId: WatchListTypeEnum.AssetDetails,
      guidItemId: selectedWatchListAssetGuid,
    } as UserWatchListDto);
  };

  const openVirtualFlowMeterDrawer = () => {
    setIsVirtualFlowMeterDrawerOpen(true);
  };
  const closeVirtualFlowMeterDrawer = () => {
    setIsVirtualFlowMeterDrawerOpen(false);
  };

  return (
    <Box>
      <Drawer
        anchor="right"
        open={isVirtualFlowMeterDrawerOpen}
        onClose={closeVirtualFlowMeterDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <VirtualFlowMeterDrawer
            assetId={assetDetails?.asset?.assetId}
            closeCallback={closeVirtualFlowMeterDrawer}
          />
        </DrawerContent>
      </Drawer>

      <StyledBox px={3} mx={-3} pt={1}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <BackIconButton size="small" />
          </Grid>
          <Grid item xs zeroMinWidth>
            <PageHeader
              dense
              title={assetTitle || ''}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {assetTitle}
            </PageHeader>
          </Grid>
        </Grid>

        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Tabs
              dense
              value={activeTab}
              // @ts-ignore
              onChange={handleTabChange}
              aria-label="asset detail tabs"
              borderWidth={0}
            >
              <Tab
                label={t('ui.assetdetail.detailsTab', 'Details')}
                value={AssetDetailTab.Details}
              />
              {canViewEvents && (
                <Tab
                  label={t('ui.assetdetail.eventsTab', 'Events')}
                  value={AssetDetailTab.Events}
                />
              )}
              {canViewReadings && (
                <Tab
                  label={t('ui.common.readings', 'Readings')}
                  value={AssetDetailTab.Readings}
                />
              )}
              {canViewReadings && (
                <Tab
                  label={t('ui.assetdetail.forecast', 'Forecast')}
                  value={AssetDetailTab.Forecast}
                />
              )}
              {canViewMap && (
                <Tab
                  label={t('ui.assetdetail.mapTab', 'Map')}
                  value={AssetDetailTab.Map}
                />
              )}
            </Tabs>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Hidden mdDown>
                {hasVirtualFlowMeterEnabled && (
                  <Grid item>
                    <Button
                      useDomainColorForIcon
                      startIcon={<TrendingUpIcon />}
                      onClick={openVirtualFlowMeterDrawer}
                    >
                      {t(
                        'ui.assetdetail.virtualFlowMeter',
                        'Virtual Flow Meter'
                      )}
                    </Button>
                  </Grid>
                )}
                <Grid item>
                  <RefreshButton onClick={refetchRecords} />
                </Grid>
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
                      {t(
                        'ui.main.removefromwatchlist',
                        'Remove From Watch List'
                      )}
                    </Button>
                  ) : (
                    <Button
                      useDomainColorForIcon
                      startIcon={<WatchlistIcon />}
                      onClick={addToWatchlist}
                      disabled={
                        saveWatchListApi.isLoading ||
                        getWatchListItemsApi.isFetching
                      }
                      aria-label="Change watchlist status"
                    >
                      {t('ui.main.addtowatchlist', 'Add To Watch List')}
                    </Button>
                  )}
                </Grid>
              </Hidden>
              <Hidden lgUp>
                <Grid item xs>
                  <Button
                    variant="text"
                    style={{ minWidth: 36, minHeight: 40 }}
                    onClick={handleButtonMenuClick}
                  >
                    <StyledEllipsisIcon />
                  </Button>

                  <Menu
                    id="asset-details-ellipsis-menu"
                    anchorEl={buttonMenuAnchorEl}
                    getContentAnchorEl={null}
                    keepMounted
                    open={Boolean(buttonMenuAnchorEl)}
                    onClose={handleButtonMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    {hasVirtualFlowMeterEnabled && (
                      <StyledMenuItem
                        onClick={() => {
                          openVirtualFlowMeterDrawer();
                          handleButtonMenuClose();
                        }}
                      >
                        <ListItemIcon>
                          <IconWithDomainThemeColor as={TrendingUpIcon} />
                        </ListItemIcon>
                        <StyledMenuItemText>
                          {t(
                            'ui.assetdetail.virtualFlowMeter',
                            'Virtual Flow Meter'
                          )}
                        </StyledMenuItemText>
                      </StyledMenuItem>
                    )}
                    <StyledMenuItem onClick={refetchRecords}>
                      <ListItemIcon>
                        <IconWithDomainThemeColor as={RefreshIcon} />
                      </ListItemIcon>
                      <StyledMenuItemText>
                        {t('ui.common.refresh', 'Refresh')}
                      </StyledMenuItemText>
                    </StyledMenuItem>
                    {currentAssetInWatchList ? (
                      <StyledMenuItem
                        onClick={removeFromWatchlist}
                        disabled={
                          deleteWatchListApi.isLoading ||
                          getWatchListItemsApi.isFetching
                        }
                      >
                        <ListItemIcon>
                          <IconWithDomainThemeColor as={WatchlistIcon} />
                        </ListItemIcon>
                        <StyledMenuItemText>
                          {t(
                            'ui.main.removefromwatchlist',
                            'Remove From Watch List'
                          )}
                        </StyledMenuItemText>
                      </StyledMenuItem>
                    ) : (
                      <StyledMenuItem
                        onClick={addToWatchlist}
                        disabled={
                          deleteWatchListApi.isLoading ||
                          getWatchListItemsApi.isFetching
                        }
                      >
                        <ListItemIcon>
                          <IconWithDomainThemeColor as={WatchlistIcon} />
                        </ListItemIcon>
                        <StyledMenuItemText>
                          {t('ui.main.addtowatchlist', 'Add To Watch List')}
                        </StyledMenuItemText>
                      </StyledMenuItem>
                    )}
                  </Menu>
                </Grid>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
      </StyledBox>
    </Box>
  );
};

export default PageIntro;

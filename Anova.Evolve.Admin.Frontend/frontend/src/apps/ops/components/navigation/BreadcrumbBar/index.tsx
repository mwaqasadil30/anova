/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import { TreeNodeInfo } from 'api/admin/api';
import opsRoutes from 'apps/ops/routes';
import Breadcrumbs from 'components/Breadcrumbs';
import CircularProgress from 'components/CircularProgress';
import CustomThemeProvider from 'components/CustomThemeProvider';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import MessageBlock from 'components/MessageBlock';
import Tab from 'components/Tab';
import Tabs from 'components/Tabs';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
  setOpsNavigationItem,
  setOpsNavigationTreeNode,
} from 'redux-app/modules/app/actions';
import {
  selectActiveDomainId,
  selectFetchedFavouritesOn,
  selectOpsNavigationData,
} from 'redux-app/modules/app/selectors';
import { selectUserId } from 'redux-app/modules/user/selectors';
import { OpsNavItemType } from 'types';
import AssetGroupTab from './components/AssetGroupTab';
import AssetTreeTab from './components/AssetTreeTab';
import WatchlistTab from './components/WatchlistTab';
import { TabPanel } from './helpers';
import { useAssetTreeParentNodeInfo } from './hooks/useAssetTreeParentNodeApi';
import { useFavouritesInfo } from './hooks/useFavouritesApi';
import { useGetAssetTreeNodeInfoListRootByDomain } from './hooks/useGetAssetTreeNodeInfoListRootByDomain';
import {
  GridWrapper,
  StyledBreadcrumbCaret,
  StyledBreadcrumbLink,
  StyledButton,
  StyledCloseButton,
  StyledCloseIcon,
  StyledDefaultText,
  StyledFavoritesStar,
  StyledGradient,
  StyledGroupIcon,
  StyledListItemIcon,
  StyledListItemText,
  StyledNavBarFavoritesStar,
  StyledNavIcon,
  StyledNavItem,
  StyledNavMenuItemIcon,
  StyledPaper,
  StyledTreeFolderIcon,
  useStyles,
} from './styles';

const BreadcrumbBar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const opsNavData = useSelector(selectOpsNavigationData);
  const fetchedFavouritesOn = useSelector(selectFetchedFavouritesOn);

  // Popover
  const [
    tabbedNavAnchorEl,
    setTabbedNavAnchorEl,
  ] = useState<HTMLButtonElement | null>(null);
  const [
    breadcrumbAnchorEl,
    setBreadcrumbAnchorEl,
  ] = React.useState<HTMLButtonElement | null>(null);

  const [
    selectedNodeParent,
    setSelectedNodeParent,
  ] = React.useState<TreeNodeInfo | null>();
  const [selectedNodePathIndex, setSelectedNodePathIndex] = React.useState<
    number | null
  >();

  const open = Boolean(tabbedNavAnchorEl);
  const id = open ? 'nav-item-popover' : undefined;

  // Styled Tabs
  const [selectedTab, setSelectedTab] = useState(0);

  const [nodeIdToIsExpandedMapping, setNodeIdToIsExpandedMapping] = useState<
    Record<string, boolean>
  >({});

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const domainId = useSelector(selectActiveDomainId);
  const userId = useSelector(selectUserId);

  const favouritesApi = useFavouritesInfo();
  const favouritesData = favouritesApi.data;

  useEffect(() => favouritesApi.fetchFavourites({ userId, domainId }), [
    fetchedFavouritesOn,
    domainId,
  ]);

  // When changing domains, the current ops navigation item should be reset.
  // Previously this was done in the reducer when the SetActiveDomain action is
  // dispatched. However, when the multi-tab setup with different domains was
  // implemented, bluring then focusing on the browser with the Transcend app
  // would reset the ops nav item.
  useEffect(() => {
    dispatch(setOpsNavigationItem(null));
  }, [domainId]);

  // Root API call
  const getAssetTreeNodeInfoListRootByDomainApi = useGetAssetTreeNodeInfoListRootByDomain(
    {
      selectedNodeIndex: selectedNodePathIndex,
    }
  );
  const getAssetTreeNodeInfoListRootByDomainApiData =
    getAssetTreeNodeInfoListRootByDomainApi.data
      ?.retrieveTreeNodeInfoListRootByDomainResult?.records;

  // Children/parent API call
  const assetTreeParentNodeApi = useAssetTreeParentNodeInfo();
  const { nodeIdToDetailsMapping } = assetTreeParentNodeApi;

  const toggleExpandTree = (treeNode: TreeNodeInfo) => {
    const nodeId = treeNode.breadCrumb;
    const nodeIsExpanded = nodeIdToIsExpandedMapping[nodeId!];

    const nodeDetails = assetTreeParentNodeApi.nodeIdToDetailsMapping[nodeId!];
    if (!nodeDetails?.isFetching && !nodeDetails?.children) {
      assetTreeParentNodeApi.fetchNodes(treeNode);
    }

    if (!nodeDetails?.isFetching) {
      setNodeIdToIsExpandedMapping({
        ...nodeIdToIsExpandedMapping,
        [nodeId!]: !nodeIsExpanded,
      });
    }
  };

  const redirectUser = () => {
    // NOTE: These redirects are important (even though they seem to redirect
    // to the same page) because this redirect will actually clear the state on
    // that page that's stored in the history. This'll actually cause new data
    // to be fetched on these pages
    if (location.pathname === opsRoutes.assetSummary.list) {
      history.push(opsRoutes.assetSummary.list);
      return;
    }

    // Redirect to the map while removing any state stored in the history
    if (location.pathname === opsRoutes.assetMap.list) {
      history.push(opsRoutes.assetMap.list);
      return;
    }

    // Redirect to problem reports while removing any state stored in the history
    if (location.pathname === opsRoutes.problemReports.list) {
      history.push(opsRoutes.problemReports.list);
      return;
    }

    if (
      location.pathname !== opsRoutes.assetSummary.list &&
      location.pathname !== opsRoutes.events.list &&
      location.pathname !== opsRoutes.assetMap.list &&
      location.pathname !== opsRoutes.problemReports.list
    ) {
      history.push(opsRoutes.assetSummary.list);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTabbedNavAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setTabbedNavAnchorEl(null);
  };

  const handleBreadcrumbClick = (
    parentNode: TreeNodeInfo | null,
    nodePathIndex: number
  ) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setBreadcrumbAnchorEl(event.currentTarget);
    setSelectedNodeParent(parentNode);
    setSelectedNodePathIndex(nodePathIndex);

    if (parentNode) {
      toggleExpandTree(parentNode);
    }
  };

  const handleBreadcrumbClose = () => {
    setBreadcrumbAnchorEl(null);
    setSelectedNodeParent(null);
    setSelectedNodePathIndex(null);
  };

  const handleClickTreeItem = (nodes: TreeNodeInfo[]) => {
    handleClose();
    handleBreadcrumbClose();
    dispatch(setOpsNavigationTreeNode(nodes));
    redirectUser();
  };

  const areBreadcrumbItemsLoading = selectedNodeParent
    ? assetTreeParentNodeApi.nodeIdToDetailsMapping[
        selectedNodeParent?.breadCrumb!
      ]?.isFetching
    : getAssetTreeNodeInfoListRootByDomainApi.isFetching;

  const breadcrumbSubItems = selectedNodeParent
    ? assetTreeParentNodeApi.nodeIdToDetailsMapping[
        selectedNodeParent?.breadCrumb!
      ]?.children
    : getAssetTreeNodeInfoListRootByDomainApiData;

  const selectedNode = opsNavData?.nodes?.[opsNavData.nodes.length - 1];

  const defaultText = t('ui.common.default', 'Default');

  return (
    /* 
      We have to use CustomThemeProvider here because its also being used in
      <TopNavigation /> forcing the dark theme.
    */
    <CustomThemeProvider>
      <StyledPaper square>
        <StyledGradient />
        <GridWrapper>
          <Grid
            container
            spacing={1}
            alignItems="center"
            style={{ height: '100%' }}
          >
            {favouritesApi.isFetching ? (
              <Grid item>
                <Box ml={2}>
                  <CircularProgress size={24} />
                </Box>
              </Grid>
            ) : (
              <>
                <Grid item>
                  <StyledButton
                    onClick={handleClick}
                    aria-label="Open nav popover"
                  >
                    {opsNavData?.type === OpsNavItemType.Favourite && (
                      <StyledNavIcon
                        as={StyledFavoritesStar}
                        aria-label="Favourite icon"
                      />
                    )}
                    {opsNavData?.type === OpsNavItemType.AssetGroup && (
                      <StyledNavIcon
                        as={StyledGroupIcon}
                        aria-label="Asset group icon"
                      />
                    )}
                    {opsNavData?.type === OpsNavItemType.AssetTree && (
                      <StyledNavIcon
                        as={StyledTreeFolderIcon}
                        aria-label="Asset tree icon"
                      />
                    )}

                    {!opsNavData && (
                      <StyledNavIcon
                        as={StyledGroupIcon}
                        aria-label="All assets icon"
                      />
                    )}
                    <StyledBreadcrumbCaret />
                  </StyledButton>

                  <Popover
                    id={id}
                    open={open}
                    anchorEl={tabbedNavAnchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    PaperProps={{ style: { width: 425 } }}
                    transitionDuration={0}
                  >
                    <DarkFadeOverlay
                      darken={assetTreeParentNodeApi.isFetching}
                      preventClicking
                    >
                      <div className={classes.popoverText}>
                        <Tabs
                          value={selectedTab}
                          // @ts-ignore
                          onChange={handleChange}
                          aria-label="Nav item tabs"
                          centered
                        >
                          <Tab label={t('ui.main.watchlist', 'Watch List')} />
                          <Tab label={t('ui.main.favorites', 'Favorites')} />
                          <Tab label={t('ui.main.tree', 'Tree')} />
                          <Tab label={t('ui.main.group', 'Group')} />
                        </Tabs>

                        <WatchlistTab
                          selectedTab={selectedTab}
                          handleClose={handleClose}
                        />

                        <TabPanel value={selectedTab} index={1}>
                          {!favouritesData.length ? (
                            <MessageBlock height={125}>
                              <Box>
                                <StyledNavMenuItemIcon
                                  as={StyledFavoritesStar}
                                  size="large"
                                />
                              </Box>
                              <LargeBoldDarkText>
                                {t(
                                  'ui.assetnav.noFavoritesFound',
                                  'No favorites found'
                                )}
                              </LargeBoldDarkText>
                            </MessageBlock>
                          ) : (
                            <List
                              component="nav"
                              aria-label="Favourite items nav"
                            >
                              {favouritesData.map((item) => (
                                <ListItem
                                  key={item.favouriteId}
                                  button
                                  selected={
                                    opsNavData?.type ===
                                      OpsNavItemType.Favourite &&
                                    opsNavData.item.favouriteId ===
                                      item.favouriteId
                                  }
                                  onClick={() => {
                                    dispatch(setOpsNavigationItem(item));
                                    redirectUser();
                                    handleClose();
                                  }}
                                >
                                  <StyledListItemIcon>
                                    <StyledNavMenuItemIcon
                                      as={StyledNavBarFavoritesStar}
                                    />
                                  </StyledListItemIcon>
                                  <StyledListItemText
                                    primary={
                                      item.isDefaultFavorite ? (
                                        <>
                                          <span aria-label="Favourite item title">
                                            {item.description}
                                          </span>{' '}
                                          <StyledDefaultText display="inline">
                                            {`(${defaultText.toLowerCase()})`}
                                          </StyledDefaultText>
                                        </>
                                      ) : (
                                        <span aria-label="Favourite item title">
                                          {item.description}
                                        </span>
                                      )
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </TabPanel>

                        <AssetTreeTab
                          selectedTab={selectedTab}
                          selectedNode={selectedNode}
                          nodeIdToIsExpandedMapping={nodeIdToIsExpandedMapping}
                          nodeIdToDetailsMapping={nodeIdToDetailsMapping}
                          handleClickTreeItem={handleClickTreeItem}
                          toggleExpandTree={toggleExpandTree}
                        />

                        <AssetGroupTab
                          selectedTab={selectedTab}
                          handleClose={handleClose}
                          redirectUser={redirectUser}
                        />
                      </div>
                    </DarkFadeOverlay>
                  </Popover>
                </Grid>
                <Grid item>
                  <Breadcrumbs aria-label="nav breadcrumbs">
                    {opsNavData?.type !== OpsNavItemType.AssetTree ? (
                      <StyledNavItem aria-label="Active nav item title">
                        {!opsNavData?.title
                          ? t('ui.assetsummary.allassets', 'All Assets')
                          : opsNavData?.title}
                      </StyledNavItem>
                    ) : (
                      opsNavData.nodes.map((node, index) => {
                        const parentItem = opsNavData.nodes[index - 1];
                        const isLast = index === opsNavData.nodes.length - 1;
                        return (
                          <StyledBreadcrumbLink
                            key={node.breadCrumb!}
                            active={isLast}
                            onClick={handleBreadcrumbClick(parentItem, index)}
                            aria-label={`Active tree item level ${
                              index + 1
                            } title`}
                          >
                            {node.name}
                          </StyledBreadcrumbLink>
                        );
                      })
                    )}
                  </Breadcrumbs>
                  {/* Breadcrumb node popover */}
                  <Popover
                    id="asset-tree-item-popover"
                    open={!!breadcrumbAnchorEl}
                    anchorEl={breadcrumbAnchorEl}
                    onClose={handleBreadcrumbClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    PaperProps={{ style: { minWidth: 182 } }}
                    transitionDuration={0}
                  >
                    <List component="nav" className={classes.nestedList}>
                      {areBreadcrumbItemsLoading ? (
                        <Box textAlign="center">
                          <CircularProgress size={24} />
                        </Box>
                      ) : (
                        breadcrumbSubItems?.map((item) => (
                          <ListItem
                            key={item.breadCrumb!}
                            button
                            selected={
                              item.breadCrumb === selectedNode?.breadCrumb
                            }
                            onClick={() => {
                              if (
                                (selectedNodePathIndex ||
                                  selectedNodePathIndex === 0) &&
                                opsNavData?.nodes
                              ) {
                                const newNodesPath = [
                                  ...opsNavData.nodes.slice(
                                    0,
                                    selectedNodePathIndex
                                  ),
                                  item,
                                ];
                                handleClickTreeItem(newNodesPath);
                              }
                            }}
                          >
                            <StyledListItemIcon>
                              <StyledNavMenuItemIcon
                                as={StyledTreeFolderIcon}
                              />
                            </StyledListItemIcon>
                            <StyledListItemText primary={item.name} />
                          </ListItem>
                        ))
                      )}
                    </List>
                  </Popover>
                </Grid>
                <Grid item>
                  {opsNavData &&
                    (opsNavData.type === OpsNavItemType.Favourite ||
                      opsNavData.type === OpsNavItemType.AssetGroup ||
                      opsNavData.type === OpsNavItemType.AssetTree) && (
                      <StyledCloseButton
                        onClick={() => {
                          dispatch(setOpsNavigationItem(null));
                          redirectUser();
                        }}
                        aria-label="Clear nav item"
                      >
                        <StyledCloseIcon />
                      </StyledCloseButton>
                    )}
                </Grid>
              </>
            )}
          </Grid>
        </GridWrapper>
      </StyledPaper>
    </CustomThemeProvider>
  );
};

export default BreadcrumbBar;

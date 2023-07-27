/* eslint-disable indent, @typescript-eslint/no-unused-vars */
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  AssetDetailDto,
  AssetDetailGetResp,
  DataChannelType,
  EvolveAssetLocationDto,
  EvolveAssetMapAssetInfoRecord,
  EvolveInventoryState,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { StyledExpandIcon } from 'apps/ops/components/icons/styles';
import { parseAssetSummaryQuery } from 'apps/ops/utils/routes';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import ComponentTitle from 'components/typography/ComponentTitle';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import {
  selectActiveDomainId,
  selectOpsNavigationData,
  selectTopOffset,
} from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { tableHeaderColor } from 'styles/colours';
import { isNumber } from 'utils/format/numbers';
import { getInitialStateValues } from '../AssetSummaryLegacy/helpers';
import AssetMap from './components/AssetMap';
import FilterBar from './components/FilterBar';
import SiteDetailPanel from './components/SiteDetailPanel';
import { useAssetMapSites } from './hooks/useAssetMapSites';
import { useGetAvailableInventoryStatesWithDomainDefault } from './hooks/useGetAvailableInventoryStatesWithDomainDefault';
import useMapFilters from './hooks/useMapFilters';
import usePaginateAssets from './hooks/usePaginateAssets';
import { MapViewport } from './types';

const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#EBEBEB' : tableHeaderColor};
  && .MuiTypography-root {
    color: ${(props) =>
      props.theme.palette.type === 'light' &&
      props.theme.palette.text.secondary};
  }
`;

const Wrapper = styled(({ topOffset, ...props }) => <div {...props} />)`
  ${(props) =>
    props.topOffset &&
    `
    display: flex;
    flex-direction: column;
    height: calc(100vh - ${props.topOffset}px);
    padding: 0;
    `};
`;

const drawerWidth = 320;
const topOffset = 102;
const filterBarHeight = 154;
const collapsedPanelWidth = 44;
const useCustomDrawerStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'none',
    },
    mapBoxDrawerOpenWidth: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: drawerWidth,
    },
    mapBoxFullWidth: {
      width: `calc(100% - ${collapsedPanelWidth}px)`,
      marginRight: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      zIndex: 2,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      position: 'absolute',
      zIndex: 2,
      top: topOffset - 2,
      borderRadius: 0,
      height: `calc(100% - ${topOffset}px)`,
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  })
);

interface LocationState {
  activeFilters: Record<string, boolean | undefined>;
  pageNumber?: number;
  isAssetDetailPanelOpen?: boolean;
  mapViewport?: MapViewport;
  selectedSiteKey?: string;
  selectedSiteAssetId?: string;
  selectedDataChannelId?: string;
}

const useInventoryStatusLevelQueryParameter = () => {
  const location = useLocation();
  const parsedQuery = parseAssetSummaryQuery(location.search);
  return parsedQuery.inventoryStatusLevel;
};

interface Props {
  domainId: string;
  filterableInventoryStates?: EvolveInventoryState[] | null;
}

const AssetMapPage = ({ domainId, filterableInventoryStates }: Props) => {
  const { t } = useTranslation();
  const location = useLocation<LocationState | undefined>();
  const history = useHistory();
  const opsNavData = useSelector(selectOpsNavigationData);
  const appTopOffset = useSelector(selectTopOffset);

  const inventoryStatusLevel = useInventoryStatusLevelQueryParameter();
  const initialStateValues = getInitialStateValues({
    opsNavData,
    // NOTE: We don't pass defaultDataChannels and defaultInventoryStates since
    // those properties are already filtered on the back-end if they're not
    // provided on the front-end.
    inventoryStatusQuery: inventoryStatusLevel,
    defaultDomainId: domainId,
  });

  // Prevent this value from changing after mount to prevent a race condition
  // when centering the map's viewport to the first set of points loaded from
  // the back-end
  const initialLocationStateMapViewport = useMemo(
    () => location.state?.mapViewport || null,
    // Having opsNavData in the dependencies allows zooming in to the initial
    // set of points when changing the ops nav item
    [opsNavData]
  );

  const [
    debouncedMapViewport,
    setDebouncedMapViewport,
  ] = useState<MapViewport | null>(initialLocationStateMapViewport);

  const [tabValue, setTabValue] = React.useState('1');
  const [responseError, setResponseError] = useState<any | null>(null);
  const [
    selectedSite,
    setSelectedSite,
  ] = useState<EvolveAssetLocationDto | null>(null);

  // We're using additional state for determining when to zoom to a site to
  // avoid bubbling the mapState up to the page (which greatly affects
  // performance since the mapState updates any time the position (panning) or
  // zoom on the map changes. If the state was bubbled up to this component
  // (the entire page) then the entire page would re-render. The performance
  // would be greatly affected if the right panel was open and the map state
  // was placed on this page.
  const [zoomToSelectedSiteKey, setZoomToSelectedSiteKey] = useState('');
  const [selectedSiteAsset, setSelectedSiteAsset] = useState<
    EvolveAssetMapAssetInfoRecord | null | undefined
  >(null);
  const [selectedAssetDetails, setSelectedAssetDetails] = useState<
    AssetDetailDto | null | undefined
  >();
  const [selectedDataChannelId, setSelectedDataChannelId] = useState<
    string | null
  >(null);

  const [hideFilterBar, setHideFilterBar] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [lastRefreshDate, setLastRefreshDate] = useState<Date>();
  const [isFetchingAssetDetail, setIsFetchingAssetDetail] = useState(false);
  const [isAssetDetailOpen, setIsAssetDetailOpen] = useState(
    location.state?.isAssetDetailPanelOpen || false
  );

  const [assetResult, setAssetResult] = useState<
    AssetDetailDto | null | undefined
  >();
  const [assetDetails, setApiResponse] = useState<AssetDetailGetResp | null>(
    null
  );

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
  };

  const fetchRecords = useCallback((assetId: string) => {
    setIsFetchingAssetDetail(true);

    AdminApiService.AssetService.asset_GetDetails(assetId)
      .then((response) => {
        setApiResponse(response);
        setAssetResult(response.asset);
        setSelectedAssetDetails(response.asset);
      })
      .catch((error) => {
        setResponseError(error);
      })
      .finally(() => {
        setIsFetchingAssetDetail(false);
        setIsLoadingInitial(false);
      });
  }, []);
  const refetchRecords = useCallback(() => {
    if (selectedSiteAsset?.assetId) {
      fetchRecords(selectedSiteAsset.assetId);
    }
  }, [fetchRecords, domainId, selectedSiteAsset]);

  useEffect(() => {
    refetchRecords();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [refetchRecords]);
  // #endregion Asset details API

  const {
    filterBy: filterByColumn,
    filterByText: filterTextValue,
    unitSelected,
    dataChannels: dataChannelSelected,
    inventoryStates: inventoryStateSelected,
    assetSearchExpression,
    navigationDomainId,
  } = initialStateValues;

  const assetMapSitesData = useAssetMapSites({
    domainId,
    navigationDomainId,
    assetSearchExpression,
    filterTextValue,
    filterByColumn,
    dataChannelSelected,
    inventoryStateSelected,
    lastRefreshDate,
  });

  const mapRecords = useMemo(
    () =>
      assetMapSitesData.apiResponse?.locations
        ?.filter((rec) => {
          return rec.assets?.filter((assetFromSite) => {
            return assetFromSite?.dataChannels?.filter((dc) => {
              return dc.dataChannelType === DataChannelType.Level;
            }).length;
          }).length;
        })
        .sort((a, b) => {
          // TODO: The back-end seems to be returning assets in different orders
          // with every API request (seems to be random). Sorting by the first
          // asset's assetTitle provides inconsistent results
          if (a?.assets?.[0].assetTitle! < b?.assets?.[0].assetTitle!) {
            return -1;
          }
          if (a?.assets?.[0].assetTitle! > b?.assets?.[0].assetTitle!) {
            return 1;
          }
          return 0;
        }),
    [assetMapSitesData.apiResponse?.locations]
  );

  const mapFilters = useMapFilters({
    filterableInventoryStates,
    mapRecords,
    initialActiveFilters: location.state?.activeFilters,
  });

  useEffect(() => {
    if (mapFilters?.filteredMapRecords) {
      if (mapFilters?.filteredMapRecords.length < 1) {
        setSelectedSite(null);
        setSelectedSiteAsset(null);
        setSelectedDataChannelId(null);
      } else if (selectedDataChannelId) {
        let dcPresent = false;
        mapFilters?.filteredMapRecords.forEach((assetLocation) => {
          assetLocation?.assets?.forEach((assetInLocation) => {
            if (assetInLocation) {
              assetInLocation?.dataChannels?.forEach((assetDc) => {
                if (assetDc.dataChannelId === selectedDataChannelId) {
                  dcPresent = true;
                }
              });
            }
          });
        });
        if (!dcPresent) {
          setSelectedDataChannelId(null);
        }
      } else if (selectedSiteAsset) {
        let assetPresent = false;
        mapFilters?.filteredMapRecords.forEach((assetLocation) => {
          assetLocation?.assets?.forEach((assetInLocation) => {
            if (assetInLocation) {
              if (assetInLocation.assetId === selectedSiteAsset.assetId) {
                assetPresent = true;
              }
            }
          });
        });
        if (!assetPresent) {
          setSelectedSiteAsset(null);
        }
      } else if (selectedSite) {
        let sitePresent = false;
        mapFilters?.filteredMapRecords.forEach((assetLocation) => {
          if (
            assetLocation.latitude === selectedSite.latitude &&
            assetLocation.longitude === selectedSite.longitude
          ) {
            sitePresent = true;
          }
        });
        if (!sitePresent) {
          setSelectedSite(null);
        }
      }
    }
  }, [mapFilters.filterButtonActiveMapping]);

  const classes = useCustomDrawerStyles();
  const getMapContainerClassnames = () => {
    const classNames = [];
    if (isAssetDetailOpen) {
      classNames.push(classes.mapBoxDrawerOpenWidth);
    } else {
      classNames.push(classes.mapBoxFullWidth);
    }
    return classNames.join(' ');
  };
  // #region Pagination
  const allSitesPagination = usePaginateAssets({
    assets: mapFilters.filteredMapRecords?.flatMap((site) => {
      return site.assets || [];
    }),
    initialPageNumber: location.state?.pageNumber,
  });
  const selectedSitePagination = usePaginateAssets({
    assets: selectedSite?.assets,
  });

  // Go to the first page when changing filters
  useUpdateEffect(() => {
    allSitesPagination.setPageNumber(1);
  }, [mapFilters.filterButtonActiveMapping]);
  // Go to the first page of the selected site's assets when
  // selecting/deselecting a site
  useUpdateEffect(() => {
    selectedSitePagination.setPageNumber(1);
  }, [selectedSite]);

  // Scroll to the top of the asset list when changing pages
  const scrollableAssetListContainerRef = useRef<HTMLDivElement>(null);
  const scrollableSelectedSiteAssetListContainerRef = useRef<HTMLDivElement>(
    null
  );
  useEffect(() => {
    scrollableAssetListContainerRef.current?.scroll(0, 0);
  }, [allSitesPagination.pageNumber]);
  useEffect(() => {
    scrollableSelectedSiteAssetListContainerRef.current?.scroll(0, 0);
  }, [selectedSitePagination.pageNumber]);
  // #endregion Pagination

  // #region Preserve browser state
  // Memoize to prevent infinite loop/unnecessary renders which might clear the
  // router's location.state incorrectly
  const memoizedFilteredRecords = useMemo(() => mapFilters.filteredMapRecords, [
    mapRecords,
    mapFilters.filterButtonActiveMapping,
  ]);

  // Initialize the selected site/asset/data channel from the router's location
  // state (i.e. when the user presses the back button to revisit this page).
  useEffect(() => {
    if (location.state?.selectedSiteKey) {
      memoizedFilteredRecords?.forEach((record) => {
        const siteKey = `${record.latitude}_${record.longitude}`;

        if (siteKey === location.state?.selectedSiteKey) {
          setSelectedSite(record);

          record.assets?.forEach((asset) => {
            if (asset.assetId === location.state?.selectedSiteAssetId) {
              setSelectedSiteAsset(asset);

              asset.dataChannels?.forEach((channel) => {
                if (
                  channel.dataChannelId &&
                  channel.dataChannelId ===
                    location.state?.selectedDataChannelId
                ) {
                  setSelectedDataChannelId(channel.dataChannelId);
                }
              });
            }
          });
        }
      });
    }
  }, [memoizedFilteredRecords]);

  // Preserve the filter state in the browser history state so when the user
  // goes "back" (via the browser), the state would be restored.
  useUpdateEffect(() => {
    // TODO: Add domain to the history state too? Could run into a case where
    // the user changes domain, presses the back button, and the history state
    // will contain references to the old domain
    // activeFilters/selectedSite/asset/datachannel (which may not exist on the
    // new domain)
    history.replace(location.pathname, {
      ...location.state,
      activeFilters: mapFilters.filterButtonActiveMapping,
      pageNumber: allSitesPagination.pageNumber,
      isAssetDetailPanelOpen: isAssetDetailOpen,
      mapViewport: debouncedMapViewport,
      selectedSiteKey: selectedSite
        ? `${selectedSite.latitude}_${selectedSite.longitude}`
        : '',
      selectedSiteAssetId: selectedSiteAsset?.assetId || '',
      selectedDataChannelId: selectedDataChannelId || '',
    } as LocationState);
  }, [
    mapFilters.filterButtonActiveMapping,
    allSitesPagination.pageNumber,
    isAssetDetailOpen,
    // Prevent unnecessary re-renders which may cause the selected
    // site/asset/data channel to be cleared
    JSON.stringify(debouncedMapViewport),
    `${selectedSite?.latitude}_${selectedSite?.longitude}`,
    selectedSiteAsset?.assetId,
    selectedDataChannelId,
  ]);
  // #endregion Preserve browser state

  return (
    <Wrapper topOffset={appTopOffset}>
      {/* NOTE: Using negative margin to make map flush with edges per design */}
      <Box height="100%" marginX={-4} display="flex" flexDirection="column">
        <DarkFadeOverlay
          height="100%"
          style={{ zIndex: 0, display: 'flex', flexDirection: 'column' }}
          darken={assetMapSitesData.isFetching}
          darkOpacity={0.25}
          preventClicking={assetMapSitesData.isFetching}
        >
          <Box
            style={{
              position: 'relative',
              zIndex: 0,
              boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
              backgroundColor: '#fff',
            }}
            className={
              isAssetDetailOpen
                ? classes.mapBoxDrawerOpenWidth
                : classes.mapBoxFullWidth
            }
          >
            <Collapse in={!hideFilterBar}>
              <FilterBar mapFilters={mapFilters} />
            </Collapse>
          </Box>
          <Box
            display="flex"
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            className={getMapContainerClassnames()}
          >
            <AssetMap
              filterByColumn={filterByColumn}
              filterTextValue={filterTextValue}
              unitSelected={unitSelected}
              dataChannelSelected={dataChannelSelected}
              inventoryStateSelected={inventoryStateSelected}
              isFetching={assetMapSitesData.isFetching}
              responseError={assetMapSitesData.responseError}
              records={mapFilters.filteredMapRecords}
              selectedSiteMarker={selectedSite}
              zoomToSelectedSiteKey={zoomToSelectedSiteKey}
              hideFilterBar={hideFilterBar}
              debouncedMapViewport={debouncedMapViewport}
              initialLocationStateMapViewport={initialLocationStateMapViewport}
              onShowHideFilterBar={setHideFilterBar}
              onClickMarker={setSelectedSite}
              openPanelOnSiteSelection={setIsAssetDetailOpen}
              setSelectedAssetDetails={setSelectedAssetDetails}
              setSelectedSiteAsset={setSelectedSiteAsset}
              setDebouncedMapViewport={setDebouncedMapViewport}
              setSelectedDataChannelId={setSelectedDataChannelId}
            />
          </Box>
        </DarkFadeOverlay>
      </Box>

      <Box>
        {isAssetDetailOpen ? (
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={isAssetDetailOpen}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <SiteDetailPanel
              selectedSite={selectedSite}
              zoomToSelectedSiteKey={zoomToSelectedSiteKey}
              isFetching={isFetchingAssetDetail || assetMapSitesData.isFetching}
              isDetailPanelOpen={isAssetDetailOpen}
              onClickPanelOpen={setIsAssetDetailOpen}
              selectedSiteAsset={selectedSiteAsset}
              selectedAssetDetails={selectedAssetDetails}
              selectedDataChannelId={selectedDataChannelId}
              allSitesPagination={allSitesPagination}
              selectedSitePagination={selectedSitePagination}
              scrollableAssetListContainerRef={scrollableAssetListContainerRef}
              scrollableSelectedSiteAssetListContainerRef={
                scrollableSelectedSiteAssetListContainerRef
              }
              getSiteForAssetId={mapFilters.getSiteForAssetId}
              setSelectedAssetDetails={setSelectedAssetDetails}
              setSelectedSite={setSelectedSite}
              setSelectedSiteAsset={setSelectedSiteAsset}
              setSelectedDataChannelId={setSelectedDataChannelId}
              setZoomToSelectedSiteKey={setZoomToSelectedSiteKey}
            />
          </Drawer>
        ) : (
          <StyledAccordionSummary
            aria-controls="vertical-panel-content"
            id="vertical-panel-header"
            style={{
              padding: 0,
              paddingLeft: 0,
              height: `calc(100% - ${appTopOffset + 1}px)`,
              maxHeight: `calc(100% - ${appTopOffset + 1}px)`,
              alignItems: 'flex-start',
              zIndex: 2,
              width: collapsedPanelWidth,
              position: 'absolute',
              top: appTopOffset - 2,
              right: 0,
            }}
            onClick={() => {
              setIsAssetDetailOpen(true);
            }}
          >
            {/*
              Material UI Grid limitation: Use half the spacing of the Grid to
              prevent a horizontal scrollbar on the page.
            */}
            <Box p={0.5} width="100%">
              <Grid
                container
                direction="column"
                spacing={1}
                alignItems="center"
                justify="center"
              >
                <Grid item>
                  <StyledExpandIcon
                    style={{
                      transform: 'rotate(-90deg)',
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <ComponentTitle
                    style={{
                      writingMode: 'vertical-lr',
                      lineHeight: 0.8,
                    }}
                  >
                    {t('ui.asset.assets', 'Assets')}{' '}
                    {isNumber(allSitesPagination.totalRecords) && (
                      <>({allSitesPagination.totalRecords})</>
                    )}
                  </ComponentTitle>
                </Grid>
              </Grid>
            </Box>
          </StyledAccordionSummary>
        )}
      </Box>
    </Wrapper>
  );
};

const AssetMapWithDefaults = (props: any) => {
  const domainId = useSelector(selectActiveDomainId);

  const filterableInventoryStatesApi = useGetAvailableInventoryStatesWithDomainDefault(
    { domainId }
  );

  const fullProps = {
    ...props,
    domainId,
    filterableInventoryStates:
      filterableInventoryStatesApi.apiResponse?.inventoryStates,
  };

  return filterableInventoryStatesApi.isFetching ? null : (
    <AssetMapPage {...fullProps} />
  );
};

export default AssetMapWithDefaults;

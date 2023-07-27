/* eslint-disable indent */
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {
  AssetDetailDto,
  EvolveAssetLocationDto,
  EvolveAssetMapAssetInfoRecord,
} from 'api/admin/api';
import { StyledExpandIcon } from 'apps/ops/components/icons/styles';
import CircularProgress from 'components/CircularProgress';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import SimplePagination from 'components/SimplePagination';
import { StyledCustomBoxTitleAsButton } from 'components/StyledCustomBoxTitle';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import { PaginateAssetsHookData } from '../../hooks/types';
import AssetDetailCard from '../AssetDetailCard';
import AssetDetailSnippet from '../AssetDetailSnippet';

const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#EBEBEB' : '#494949'};

  && .MuiTypography-root {
    color: ${(props) =>
      props.theme.palette.type === 'light' &&
      props.theme.palette.text.secondary};
  }
  height: 44px;
  padding: 0;
  padding-left: 12px;
  && {
    min-height: 44px;
  }
`;

const PanelHeadingText = styled(Typography)`
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  color: ${(props) => props.theme.palette.type === 'light' && '#EBEBEB'};
  background-color: ${(props) =>
    props.theme.palette.type === 'light' && '#EBEBEB'};
`;

const DetailCardWrapper = styled(Paper)`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: none;
  border-radius: 0;
`;

interface Props {
  selectedSite?: EvolveAssetLocationDto | null;
  selectedSiteAsset?: EvolveAssetMapAssetInfoRecord | null;
  selectedAssetDetails?: AssetDetailDto | null;
  zoomToSelectedSiteKey: string;
  isFetching: boolean | null;
  isDetailPanelOpen: boolean;
  allSitesPagination: PaginateAssetsHookData;
  selectedSitePagination: PaginateAssetsHookData;
  scrollableAssetListContainerRef: React.RefObject<HTMLDivElement>;
  scrollableSelectedSiteAssetListContainerRef: React.RefObject<HTMLDivElement>;
  selectedDataChannelId: string | null;
  getSiteForAssetId: (assetId?: string) => EvolveAssetLocationDto | null;
  onClickPanelOpen: (arg0: boolean) => void;
  setSelectedSite: (site: EvolveAssetLocationDto | null) => void;
  setSelectedSiteAsset: (asset: EvolveAssetMapAssetInfoRecord | null) => void;
  setSelectedAssetDetails: (asset: AssetDetailDto | null) => void;
  setSelectedDataChannelId: (dcId: string) => void;
  setZoomToSelectedSiteKey: React.Dispatch<React.SetStateAction<string>>;
}

const SiteDetailPanel = ({
  selectedSite,
  selectedAssetDetails,
  isDetailPanelOpen,
  isFetching,
  allSitesPagination,
  selectedSitePagination,
  scrollableAssetListContainerRef,
  scrollableSelectedSiteAssetListContainerRef,
  selectedDataChannelId,
  getSiteForAssetId,
  onClickPanelOpen,
  setSelectedSite,
  setSelectedSiteAsset,
  setSelectedAssetDetails,
  setSelectedDataChannelId,
  setZoomToSelectedSiteKey,
}: Props) => {
  const { t } = useTranslation();

  const paginationSource = selectedSite
    ? selectedSitePagination
    : allSitesPagination;

  const pageRangeText = [
    `${paginationSource.startRange}-${paginationSource.endRange}`,
    `${t('ui.common.paginationOf', 'of')}`,
    `${paginationSource.totalRecords}`,
  ].join(' ');

  return (
    <DetailCardWrapper>
      <StyledAccordionSummary
        onClick={() => {
          onClickPanelOpen(false);
        }}
      >
        <Box p={0.5} width="100%">
          <Grid
            container
            spacing={1}
            alignItems="center"
            justify="space-between"
          >
            <Grid item>
              <Grid
                container
                alignItems="center"
                justify="flex-start"
                spacing={1}
              >
                <Grid item>
                  <StyledExpandIcon
                    style={{
                      transform: isDetailPanelOpen
                        ? 'rotate(90deg)'
                        : 'rotate(-90deg)',
                    }}
                  />
                </Grid>
                <Grid item>
                  <PanelHeadingText>
                    {t('ui.asset.asset', 'Assets')}{' '}
                    {isNumber(paginationSource.totalRecords) && (
                      <>({pageRangeText})</>
                    )}
                  </PanelHeadingText>
                </Grid>
              </Grid>
            </Grid>
            {!selectedAssetDetails && (
              <Grid item>
                {/*
                  This div onClick is used to prevent closing the panel when
                  clicking on a disabled pagination button
                */}
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
                <div onClick={(event) => event.stopPropagation()}>
                  <SimplePagination items={paginationSource.pageControlItems} />
                </div>
              </Grid>
            )}
          </Grid>
        </Box>
      </StyledAccordionSummary>
      <DarkFadeOverlay
        height="calc(100% - 44px)"
        darken={isFetching || undefined}
        darkOpacity={0.25 || undefined}
        preventClicking={isFetching || undefined}
      >
        <Grid
          container
          alignItems="center"
          justify="space-around"
          style={{ height: '100%' }}
        >
          <Grid item xs={12} style={{ height: '100%' }}>
            {isFetching && (
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 2,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <CircularProgress />
              </span>
            )}
            {selectedDataChannelId && selectedAssetDetails ? (
              <AssetDetailCard
                selectedDataChannelId={selectedDataChannelId}
                asset={selectedAssetDetails}
                setSelectedSiteAsset={setSelectedSiteAsset}
                setSelectedAssetDetails={setSelectedAssetDetails}
                setZoomToSelectedSiteKey={setZoomToSelectedSiteKey}
              />
            ) : (
              <>
                {!selectedSite ? (
                  <>
                    {!isFetching &&
                    !allSitesPagination.paginatedRecords?.length ? (
                      <MessageBlock height="100%">
                        <Box m={2}>
                          <SearchCloudIcon />
                        </Box>
                        <LargeBoldDarkText>
                          {t('ui.assetlist.empty', 'No assets found')}
                        </LargeBoldDarkText>
                      </MessageBlock>
                    ) : (
                      <Grid
                        container
                        alignContent="flex-start"
                        style={{ height: '100%', overflowY: 'scroll' }}
                        ref={scrollableAssetListContainerRef}
                      >
                        {/* if no site is selected, map multiple sites and map each site's assets */}
                        {allSitesPagination.paginatedRecords?.map(
                          (siteAsset, key) => (
                            <Grid item xs={12} key={key}>
                              <AssetDetailSnippet
                                site={getSiteForAssetId(siteAsset.assetId)}
                                siteAsset={siteAsset}
                                setSelectedSite={setSelectedSite}
                                setSelectedSiteAsset={setSelectedSiteAsset}
                                setSelectedDataChannelId={
                                  setSelectedDataChannelId
                                }
                                setZoomToSelectedSiteKey={
                                  setZoomToSelectedSiteKey
                                }
                              />
                            </Grid>
                          )
                        )}
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    {/* if a site is selected */}
                    <StyledCustomBoxTitleAsButton
                      fullWidth
                      onClick={() => setSelectedSite(null)}
                    >
                      <Grid container justify="flex-start" alignItems="center">
                        <Grid item xs={1} style={{ lineHeight: 0 }}>
                          <ChevronLeftIcon />
                        </Grid>
                        <Grid item xs={11}>
                          {/* {selectedSite?.customerName} */}
                        </Grid>
                      </Grid>
                    </StyledCustomBoxTitleAsButton>
                    {!!selectedSitePagination.paginatedRecords?.length && (
                      <Grid
                        container
                        alignItems="flex-start"
                        alignContent="flex-start"
                        style={{ overflowY: 'scroll', height: '100%' }}
                        ref={scrollableSelectedSiteAssetListContainerRef}
                      >
                        {selectedSitePagination.paginatedRecords?.map(
                          (siteAsset, key) => (
                            <Grid item key={key} xs={12}>
                              <AssetDetailSnippet
                                site={selectedSite}
                                siteAsset={siteAsset}
                                setSelectedSite={setSelectedSite}
                                setSelectedSiteAsset={setSelectedSiteAsset}
                                setSelectedDataChannelId={
                                  setSelectedDataChannelId
                                }
                                setZoomToSelectedSiteKey={
                                  setZoomToSelectedSiteKey
                                }
                              />
                            </Grid>
                          )
                        )}
                      </Grid>
                    )}
                  </>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </DarkFadeOverlay>
    </DetailCardWrapper>
  );
};

export default SiteDetailPanel;

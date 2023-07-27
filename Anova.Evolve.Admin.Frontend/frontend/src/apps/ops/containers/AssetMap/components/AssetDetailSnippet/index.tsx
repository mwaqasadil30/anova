/* eslint-disable indent */
import Button from '@material-ui/core/Button';
import {
  AssetMapInfo,
  EvolveAssetLocationDto,
  EvolveAssetMapAssetInfoRecord,
} from 'api/admin/api';
import Box from '@material-ui/core/Box';
import { StyledCustomBoxTitle } from 'components/StyledCustomBoxTitle';
import React from 'react';
import styled from 'styled-components';
import DataChannelSnippet from '../DataChannelSnippet';
// import Map from './Map';

const BorderlessPaperBox = styled(Box)`
  border: none;
  background-color: ${(props) => props.theme.palette.background.paper};
`;

const ClickableDetailSnippet = styled(Button)`
  padding: 0;
`;
interface Props {
  // asset?: AssetDetailDto | null;
  siteAsset: AssetMapInfo | null;
  site: EvolveAssetLocationDto | null;
  setSelectedSite: (site: EvolveAssetLocationDto | null) => void;
  setSelectedSiteAsset: (asset: EvolveAssetMapAssetInfoRecord | null) => void;
  setSelectedDataChannelId: (dcId: string) => void;
  setZoomToSelectedSiteKey: React.Dispatch<React.SetStateAction<string>>;
}

const AssetDetailSnippet = ({
  siteAsset,
  site,
  setSelectedSite,
  setSelectedSiteAsset,
  setSelectedDataChannelId,
  setZoomToSelectedSiteKey,
}: Props) => {
  const dataChannels = siteAsset?.dataChannels;

  return (
    <BorderlessPaperBox width="100%" boxSizing="border-box" px={0} py={0}>
      <StyledCustomBoxTitle
        p={0}
        boxSizing="border-box"
        style={{ width: '100%' }}
      >
        {siteAsset?.assetTitle || ''}
      </StyledCustomBoxTitle>
      {dataChannels?.map((ldc, index) => (
        <ClickableDetailSnippet
          key={index}
          fullWidth
          onClick={() => {
            setSelectedDataChannelId(ldc.dataChannelId!);
            setSelectedSite(site);
            setSelectedSiteAsset(siteAsset);
            setZoomToSelectedSiteKey(`${site?.latitude}_${site?.longitude}`);
          }}
        >
          <DataChannelSnippet dataChannel={ldc} />
        </ClickableDetailSnippet>
      ))}
    </BorderlessPaperBox>
  );
};

export default AssetDetailSnippet;

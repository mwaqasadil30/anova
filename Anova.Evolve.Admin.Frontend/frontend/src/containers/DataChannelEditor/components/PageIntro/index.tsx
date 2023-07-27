/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DataChannelReportDTO } from 'api/admin/api';
import Tab from 'components/Tab';
import Tabs from 'components/Tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DataChannelEditorTab } from '../../types';

const StyledBox = styled(Box)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

const StyledPageHeaderText = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
`;

const StyledPageHeaderSubText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 400;
  color: ${(props) => props.theme.palette.text.secondary};
`;

interface Props {
  activeTab: DataChannelEditorTab;
  headerNavButton?: React.ReactNode;
  dataChannelDetails?: DataChannelReportDTO | null;
  handleTabChange: (event: React.ChangeEvent<{}>, newValue: unknown) => void;
}

const PageIntro = ({
  activeTab,
  headerNavButton,
  dataChannelDetails,
  handleTabChange,
}: Props) => {
  const { t } = useTranslation();

  const dataChannelDescription = dataChannelDetails?.dataChannelDescription;

  const formattedDataChannelEditorPageIntroTitle = dataChannelDescription
    ? `${t(
        'ui.common.datachannel',
        'Data Channel'
      )} - ${dataChannelDescription}`
    : t('ui.common.datachannel', 'Data Channel');

  const assetTypeText = dataChannelDetails?.assetInfo?.assetTypeAsText || '-';
  const assetTitleText = dataChannelDetails?.assetInfo?.assetTitle || '-';

  const formattedPageIntroSubtitle = `${t(
    'ui.asset.assettype',
    'Asset Type'
  )}: ${assetTypeText} | ${t('ui.common.asset', 'Asset')}: ${assetTitleText}`;

  return (
    <Box>
      <StyledBox px={3} mx={-3} pt={1}>
        <Grid container spacing={1} alignItems="center" justify="space-between">
          {headerNavButton && <Grid item>{headerNavButton}</Grid>}
          <Grid item xs zeroMinWidth>
            <Grid container direction="column">
              <Grid item xs zeroMinWidth>
                <StyledPageHeaderText
                  title={formattedDataChannelEditorPageIntroTitle}
                  noWrap
                >
                  {formattedDataChannelEditorPageIntroTitle}
                </StyledPageHeaderText>
              </Grid>
              <Grid item xs zeroMinWidth>
                <StyledPageHeaderSubText
                  title={formattedPageIntroSubtitle}
                  noWrap
                >
                  {formattedPageIntroSubtitle}
                </StyledPageHeaderSubText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Tabs
          dense
          value={activeTab}
          // @ts-ignore
          onChange={handleTabChange}
          aria-label="data channel editor tabs"
          borderWidth={0}
        >
          {/* TODO: Do we need permissions on this tab? */}
          <Tab
            label={t('ui.main.profile', 'Profile')}
            value={DataChannelEditorTab.Profile}
          />
          {/* TODO: Do we need permissions on this tab? */}
          <Tab
            label={t('ui.common.history', 'History')}
            value={DataChannelEditorTab.History}
          />
        </Tabs>
      </StyledBox>
    </Box>
  );
};

export default PageIntro;

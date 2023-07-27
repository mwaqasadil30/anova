import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GetSiteAssetSummaryDto } from 'api/admin/api';
import routes from 'apps/freezers/routes';
import { ReactComponent as MapIcon } from 'assets/icons/freezer-site-list-pin.svg';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledMapPin = styled(MapIcon)`
  text-align: center;
  padding: 12px 16px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledSiteNameText = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.palette.text.primary};
`;

const StyledAddressText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledTotalFreezerCountText = styled(Typography)`
  font-size: 40px;
  text-align: center;
  color: ${(props) => props.theme.palette.text.primary};
`;

const StyledFreezerText = styled(Typography)`
  font-size: 14px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledDivider = styled(Divider)`
  min-height: ${(props) => props.theme.spacing(8)}px;
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

interface Props {
  site: GetSiteAssetSummaryDto;
}

const SiteBox = ({ site }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledLink
      to={generatePath(routes.sites.detail, {
        siteId: site.id,
      })}
    >
      <CustomBoxRedesign p={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs="auto" md="auto">
            <StyledMapPin />
          </Grid>
          <Grid item xs={7} md>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <StyledSiteNameText>
                  {site.name || t('ui.common.notapplicable', 'N/A')}
                </StyledSiteNameText>
              </Grid>
              <Grid item xs={12}>
                <StyledAddressText>
                  {[
                    site.address1,
                    site.city,
                    site.state,
                    // site.postalCode, // removed from api?
                    site.country,
                  ]

                    .filter(Boolean)
                    .join(', ')}
                </StyledAddressText>
              </Grid>
            </Grid>
          </Grid>

          <Box p={2}>
            <Grid item xs="auto">
              <StyledDivider orientation="vertical" />
            </Grid>
          </Box>

          <Grid item xs={3} md={3} lg={2}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={4}>
                <StyledTotalFreezerCountText>
                  {site.assetCount}
                </StyledTotalFreezerCountText>
              </Grid>
              <Grid item xs="auto">
                <StyledFreezerText>
                  {t('ui.main.freezer', 'Freezer', {
                    count: site?.assetCount,
                  })}
                </StyledFreezerText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CustomBoxRedesign>
    </StyledLink>
  );
};

export default SiteBox;

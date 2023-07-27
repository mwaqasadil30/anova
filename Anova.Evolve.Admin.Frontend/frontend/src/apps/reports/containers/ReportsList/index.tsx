import Grid from '@material-ui/core/Grid';
import routes from 'apps/reports/routes';
import { ReactComponent as OperationsIcon } from 'assets/icons/icon-ops-active.svg';
import { ReactComponent as InactiveOperationsIcon } from 'assets/icons/icon-ops-inactive.svg';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageHeader from 'components/PageHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AppIcon from './components/AppIcon';

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const ReportsList = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageIntroWrapper>
        <PageHeader dense>
          {t('ui.reportsList.title', 'Asset Reports')}
        </PageHeader>
      </PageIntroWrapper>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <StyledLink to={routes.quickAssetCreate}>
            <AppIcon
              text={t('ui.reportsList.quickAssetCreate', 'Quick Asset Create')}
              ActiveIconComponent={OperationsIcon}
              InactiveIconComponent={InactiveOperationsIcon}
            />
          </StyledLink>
        </Grid>
      </Grid>
    </>
  );
};

export default ReportsList;

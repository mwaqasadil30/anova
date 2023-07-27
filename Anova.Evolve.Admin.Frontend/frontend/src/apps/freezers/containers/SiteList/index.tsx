import Grid from '@material-ui/core/Grid';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import EmptyContentBlock from 'components/EmptyContentBlock';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageHeader from 'components/PageHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SiteBox from './components/SiteBox';
import { useGetSites } from './hooks/useRetrieveSites';

const SiteList = () => {
  const { t } = useTranslation();

  const retrieveSitesApi = useGetSites();

  return (
    <div>
      <PageIntroWrapper>
        <PageHeader dense>
          {t('ui.freezer.siteSummary', 'Site Summary')}
        </PageHeader>
      </PageIntroWrapper>

      <TransitionLoadingSpinner in={retrieveSitesApi.isFetching} />
      <TransitionErrorMessage
        in={!retrieveSitesApi.isFetching && retrieveSitesApi.isError}
      />

      <DefaultTransition
        in={!retrieveSitesApi.isFetching && retrieveSitesApi.isSuccess}
        unmountOnExit
      >
        <div>
          <Grid container spacing={2}>
            {retrieveSitesApi.data?.length === 0 ? (
              <Grid item xs={12}>
                <EmptyContentBlock
                  message={t('ui.product.siteSummary.empty', 'No sites found')}
                />
              </Grid>
            ) : (
              retrieveSitesApi.data?.map((site) => {
                return (
                  <Grid item xs={12} key={site.id}>
                    <SiteBox site={site} />
                  </Grid>
                );
              })
            )}
          </Grid>
        </div>
      </DefaultTransition>
    </div>
  );
};

export default SiteList;

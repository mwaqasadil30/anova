/* eslint-disable indent */
import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { ReactComponent as EntityInfoIcon } from 'assets/icons/entity-info.svg';
import EntityDetailsBox from 'components/EntityDetailsBox';
import EntityPropertyText from 'components/typography/EntityPropertyText';
import EntityValueText from 'components/typography/EntityValueText';
import { EditBase } from 'api/admin/api';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { formatModifiedDatetime } from 'utils/format/dates';

const formatModifiedData = (
  t: TFunction,
  modifiedDate: EditBase['createdDate'],
  modifiedByUsername: EditBase['createdByUsername']
) => {
  if (!modifiedDate && !modifiedByUsername) {
    return t('ui.common.notapplicable', 'N/A');
  }

  if (!modifiedDate) {
    return modifiedByUsername;
  }

  if (!modifiedByUsername) {
    return formatModifiedDatetime(modifiedDate);
  }

  return t(
    'ui.common.createdDateAndUsername',
    '{{createdDate}} by {{createdByUsername}}',
    {
      createdDate: formatModifiedDatetime(modifiedDate),
      createdByUsername: modifiedByUsername,
    }
  );
};

interface Props {
  details: any;
}

const EntityDetails = ({ details }: Props) => {
  const { t } = useTranslation();

  // TODO: Simplify the Grid structure
  return (
    <EntityDetailsBox mt={8}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={1}>
          <Box textAlign="center">
            <EntityInfoIcon />
          </Box>
        </Grid>
        <Grid item xs={11}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12}>
                      <Grid container alignItems="center">
                        <Grid item xs={12} md={4} lg={3}>
                          <EntityPropertyText>Created</EntityPropertyText>
                        </Grid>
                        <Grid item xs={12} md={8} lg={9}>
                          <EntityValueText>
                            {formatModifiedData(
                              t,
                              details.createdDate,
                              details.createdByUsername
                            )}
                          </EntityValueText>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container alignItems="center">
                        <Grid item xs={12} md={4} lg={3}>
                          <EntityPropertyText>Last Updated</EntityPropertyText>
                        </Grid>
                        <Grid item xs={12} md={8} lg={9}>
                          <EntityValueText>
                            {formatModifiedData(
                              t,
                              details.lastUpdatedDate,
                              details.lastUpdateUsername
                            )}
                          </EntityValueText>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item xs={12} md={4} lg={3}>
                      <EntityPropertyText>Data Channels</EntityPropertyText>
                    </Grid>
                    <Grid item xs={12} md={8} lg={9}>
                      <EntityValueText>
                        {details.dataChannelCount}
                      </EntityValueText>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </EntityDetailsBox>
  );
};

export default EntityDetails;

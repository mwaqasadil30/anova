import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { ReactComponent as EntityInfoIcon } from 'assets/icons/entity-info.svg';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { formatModifiedDatetime } from 'utils/format/dates';
import DetailsItem from './components/DetailsItem';
import { DetailsProps, ExtraDetail } from './types';

const StyledEntityDetailsIcon = styled(EntityInfoIcon)`
  color: ${(props) => props.theme.palette.text.secondary};
`;

const formatModifiedData = (
  t: TFunction,
  modifiedDate?: Date | null,
  modifiedByUsername?: string | null
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

interface EntityDetailsProps {
  details: DetailsProps;
  extraDetails?: ExtraDetail[];
  // NOTE: isInline used for pages that also include an entity details in a side drawer
  // SEE: Site/Product/TankDimension autocomplete drawers via quick tank create
  isInline?: boolean;
}
const EntityDetails = ({
  details,
  extraDetails,
  isInline,
}: EntityDetailsProps) => {
  const { t } = useTranslation();

  // NOTE:
  // Inconsistent api prop names for lastUpdatedUsername are taken into account below
  const workingLastUpdatedUsername =
    details.lastUpdateUsername || details.lastUpdateUserName;

  // Inconsistent api prop names for createdByUsername are taken into account below
  const workingCreatedByUsername =
    details.createdByUsername || details.createdByUserName;

  const formattedCreatedDate = formatModifiedData(
    t,
    details.createdDate!,
    workingCreatedByUsername!
  );
  const formattedUpdatedDate = formatModifiedData(
    t,
    details.lastUpdatedDate!,
    workingLastUpdatedUsername!
  );

  // TODO: Simplify the Grid structure
  return (
    <CustomBoxRedesign p={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={1}>
          <Box textAlign="center">
            <StyledEntityDetailsIcon />
          </Box>
        </Grid>
        <Grid item xs={11}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={isInline ? 12 : 6}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12}>
                  <DetailsItem
                    item={{
                      label: t('ui.common.created', 'Created'),
                      value: formattedCreatedDate,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DetailsItem
                    item={{
                      label: t('ui.common.lastUpdated', 'Last Updated'),
                      value: formattedUpdatedDate,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            {!!extraDetails?.length && (
              <Grid item xs={12} md={isInline ? 12 : 6}>
                <Grid container spacing={1}>
                  {extraDetails.slice(0, 2).map((detailsItem) => {
                    return (
                      <Grid item xs={12} key={detailsItem.label}>
                        <DetailsItem item={detailsItem} />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            )}
            {extraDetails?.slice(2).map((detailsItem) => {
              return (
                <Grid
                  item
                  xs={12}
                  md={isInline ? 12 : 6}
                  key={detailsItem.label}
                >
                  <DetailsItem item={detailsItem} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </CustomBoxRedesign>
  );
};

export default EntityDetails;

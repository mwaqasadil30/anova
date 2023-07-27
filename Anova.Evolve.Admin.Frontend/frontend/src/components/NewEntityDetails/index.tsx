import Grid from '@material-ui/core/Grid';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatModifiedDatetime } from 'utils/format/dates';
import DetailsItem from './components/DetailsItem';
import { DetailsProps } from './types';

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

interface NewEntityDetailsProps {
  details: DetailsProps;
}
const NewEntityDetails = ({ details }: NewEntityDetailsProps) => {
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

  return (
    <Grid container alignItems="flex-end">
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
      {/* No design for extra details, will add when we need it */}
    </Grid>
  );
};

export default NewEntityDetails;

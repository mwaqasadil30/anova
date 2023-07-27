import React from 'react';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';
import { formatModifiedDatetime } from 'utils/format/dates';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { TFunction } from 'i18next';

interface Props {
  lastUpdatedDate: Date | null | undefined;
  lastUpdateUsername: string | null | undefined;
}

const PropertyText = styled(Typography)`
  && {
    font-variant: bold;
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    color: ${(props) => props.theme.palette.text.secondary};
    margin-right: 10px;
  }
`;

const ValueText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
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

const LastUpdatedInfo = ({ lastUpdatedDate, lastUpdateUsername }: Props) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="flex-end" mt="12px">
      <PropertyText>{t('ui.common.lastUpdated', 'Last Updated')}:</PropertyText>
      <ValueText>
        {formatModifiedData(t, lastUpdatedDate, lastUpdateUsername)}
      </ValueText>
    </Box>
  );
};

export default LastUpdatedInfo;

/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import { isLatitudeValid, isLongitudeValid } from 'api/mapbox/helpers';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Map from './Map';

interface Props {
  latitude?: number;
  longitude?: number;
  hasSelectedSite?: boolean;
}

const SiteLocationMap = ({ latitude, longitude, hasSelectedSite }: Props) => {
  const { t } = useTranslation();
  const isMappedLatValid = isLatitudeValid(latitude);
  const isMappedLongValid = isLongitudeValid(longitude);

  return (
    <>
      {isMappedLatValid && isMappedLongValid ? (
        <Box height="100%" minHeight="265px" borderRadius="8px">
          <Map lat={latitude!} long={longitude!} />
        </Box>
      ) : (
        <MessageBlock height="100%" minHeight="150px">
          <Box m={2} textAlign="center" width="100%">
            <SearchCloudIcon />
          </Box>
          <LargeBoldDarkText>
            {!hasSelectedSite
              ? t('ui.common.selectASite', 'Select a site')
              : !isMappedLatValid || !isMappedLongValid
              ? t(
                  'ui.quicktankcreate.noLocationFoundForSite',
                  'No location found for site'
                )
              : null}
          </LargeBoldDarkText>
        </MessageBlock>
      )}
    </>
  );
};

export default SiteLocationMap;

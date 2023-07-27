import Box from '@material-ui/core/Box';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NoDataFound = () => {
  const { t } = useTranslation();

  return (
    <Box width="100%">
      <MessageBlock>
        <Box m={2} textAlign="center" width="100%">
          <SearchCloudIcon />
        </Box>
        <LargeBoldDarkText>
          {t('ui.common.noDataFound', 'No data found')}
        </LargeBoldDarkText>
      </MessageBlock>
    </Box>
  );
};

export default NoDataFound;

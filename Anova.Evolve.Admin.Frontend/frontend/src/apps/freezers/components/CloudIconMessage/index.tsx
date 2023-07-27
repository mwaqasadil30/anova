import Box from '@material-ui/core/Box';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CloudIconMessage = () => {
  const { t } = useTranslation();

  return (
    <MessageBlock>
      <Box m={2}>
        <SearchCloudIcon />
      </Box>
      <LargeBoldDarkText>
        {t('ui.freezer.freezerDetails.noFreezersFound', 'No freezers found')}
      </LargeBoldDarkText>
    </MessageBlock>
  );
};

export default CloudIconMessage;

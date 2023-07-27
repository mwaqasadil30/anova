import Box from '@material-ui/core/Box';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React from 'react';

interface Props {
  message: React.ReactNode;
}

const EmptyContentBlock = ({ message }: Props) => {
  return (
    <MessageBlock>
      <Box m={2}>
        <SearchCloudIcon />
      </Box>
      <LargeBoldDarkText>{message}</LargeBoldDarkText>
    </MessageBlock>
  );
};

export default EmptyContentBlock;

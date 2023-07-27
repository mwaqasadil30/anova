/* eslint-disable indent */
import Typography from '@material-ui/core/Typography';
import { DataChannelDTO } from 'api/admin/api';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import React from 'react';
import { Cell } from 'react-table';
import styled from 'styled-components';

const StyledBoldPrimaryText = styled(BoldPrimaryText)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  text-decoration: underline;
`;

const StyledText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

interface Props extends Cell<DataChannelDTO> {
  showDataChannelEditorLink: boolean;
}

const NameCell = ({ value, showDataChannelEditorLink }: Props) => {
  return (
    <>
      {showDataChannelEditorLink ? (
        <StyledBoldPrimaryText variant="body2">{value}</StyledBoldPrimaryText>
      ) : (
        <StyledText>{value}</StyledText>
      )}
    </>
  );
};

export default NameCell;

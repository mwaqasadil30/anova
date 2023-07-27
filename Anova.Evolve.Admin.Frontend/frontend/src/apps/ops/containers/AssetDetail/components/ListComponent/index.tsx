import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const MajorText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const MinorText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;
interface Props {
  titleText?: any;
  contentText?: any;
  noTopPadding?: boolean;
  noBottomPadding?: boolean;
  fontSize?: any;
}

const ListComponent = ({
  titleText,
  contentText,
  noTopPadding,
  noBottomPadding,
  fontSize,
}: Props) => {
  return (
    <ListItem
      disableGutters
      style={{
        paddingTop: noTopPadding ? '0px' : '',
        paddingBottom: noBottomPadding ? '1px' : '',
        fontSize: fontSize || '',
      }}
    >
      <Grid container justify="space-between" spacing={1}>
        {titleText ? (
          <Grid item>
            <MajorText>{titleText}</MajorText>
          </Grid>
        ) : (
          ''
        )}
        {contentText ? (
          <Grid item>
            <MinorText>{contentText}</MinorText>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    </ListItem>
  );
};
export default ListComponent;

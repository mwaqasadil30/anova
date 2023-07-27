import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const MajorText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

const MinorText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  text-align: right;
`;

interface Props {
  titleText?: React.ReactNode;
  contentText?: React.ReactNode;
  noTopPadding?: boolean;
  noBottomPadding?: boolean;
  fontSize?: number;
  className?: string;
}

const ListComponent = ({
  titleText,
  contentText,
  noTopPadding,
  noBottomPadding,
  fontSize,
  className,
}: Props) => {
  return (
    <ListItem
      disableGutters
      className={className}
      style={{
        paddingTop: noTopPadding ? '0px' : '',
        paddingBottom: noBottomPadding ? '1px' : '',
        fontSize: fontSize || '',
      }}
    >
      <Grid container justify="space-between" spacing={1}>
        {titleText ? (
          <Grid item xs={5}>
            <MajorText className="checkbox-style-padding">
              {titleText}
            </MajorText>
          </Grid>
        ) : (
          ''
        )}
        {contentText ? (
          <Grid item xs={7}>
            {/* 
              // @ts-ignore */}
            <MinorText component="div">{contentText}</MinorText>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    </ListItem>
  );
};
export default ListComponent;

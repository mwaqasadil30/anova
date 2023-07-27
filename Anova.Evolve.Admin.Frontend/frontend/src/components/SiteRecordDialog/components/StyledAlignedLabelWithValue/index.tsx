import Grid from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';

const GridItemForLabel = styled(Grid)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 500;
  font-family: ${(props) => props.theme.typography.fontFamily};

  flex-shrink: 0;
`;

const GridItemForValue = styled(Grid)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-family: ${(props) => props.theme.typography.fontFamily};

  text-align: right;
`;

interface Props {
  label: React.ReactNode;
  value?: React.ReactNode;
}

const StyledAlignedLabelWithValue = ({ label, value }: Props) => {
  return (
    <Grid
      container
      spacing={2}
      justify="space-between"
      alignItems="flex-start"
      wrap="nowrap"
    >
      <GridItemForLabel item xs="auto">
        {label}
      </GridItemForLabel>
      <GridItemForValue item xs={7}>
        {value}
      </GridItemForValue>
    </Grid>
  );
};

export default StyledAlignedLabelWithValue;

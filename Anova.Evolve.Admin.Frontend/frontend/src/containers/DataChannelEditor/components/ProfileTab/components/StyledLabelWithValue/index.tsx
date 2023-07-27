import Grid from '@material-ui/core/Grid';
import React from 'react';
import styled from 'styled-components';

const GridItemForLabel = styled(Grid)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-family: ${(props) => props.theme.typography.fontFamily};
  color: ${(props) => props.theme.palette.text.secondary};
  padding-bottom: 4px;
`;

const GridItemForValue = styled(Grid)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 500;
  font-family: ${(props) => props.theme.typography.fontFamily};
`;

interface Props {
  label: React.ReactNode;
  value?: React.ReactNode;
  isHorizontal?: boolean;
  showZeroNumberValue?: boolean;
}

const StyledLabelWithValue = ({
  label,
  value,
  isHorizontal,
  showZeroNumberValue,
}: Props) => {
  return (
    <Grid
      container
      alignItems="center"
      justify={isHorizontal ? 'space-between' : 'center'}
    >
      {isHorizontal ? (
        <>
          <GridItemForLabel item>{label}</GridItemForLabel>
          <GridItemForValue item>{value}</GridItemForValue>
        </>
      ) : (
        <>
          <GridItemForLabel item xs={12}>
            {label}
          </GridItemForLabel>
          <GridItemForValue item xs={12}>
            {showZeroNumberValue ? value : value || '-'}
          </GridItemForValue>
        </>
      )}
    </Grid>
  );
};

export default StyledLabelWithValue;

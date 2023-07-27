import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { LegendProps } from 'recharts';
import styled from 'styled-components';
import { defaultTextColor } from 'styles/colours';

const LegendLabelText = styled(Typography)`
  color: ${defaultTextColor};
  font-size: 16px;
`;

const LegendValueText = styled(Typography)`
  color: ${defaultTextColor};
  text-decoration: underline;
  font-size: 16px;
`;

const LegendItemColor = styled.span`
  width: 10px;
  height: 10px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  display: inline-block;
`;

const renderLegend = (props: LegendProps) => {
  const { payload, onMouseEnter, onMouseLeave } = props;

  return (
    <Grid
      container
      direction="row-reverse"
      spacing={4}
      justify="center"
      style={{ width: '80%', margin: '0 auto' }}
    >
      {payload?.map((entry, index) => {
        return (
          <Grid
            item
            key={`item-${index}`}
            onMouseEnter={() => onMouseEnter?.(entry.value)}
            onMouseLeave={() => onMouseLeave?.(entry.value)}
          >
            <Box display="flex" alignItems="center">
              <div>
                <Box mr={1} my={1} display="inline-block">
                  <LegendItemColor color={entry.color} />
                </Box>
                <LegendLabelText display="inline">
                  {entry.value}
                </LegendLabelText>
              </div>
              {/*
                // @ts-ignore */}
              <LegendValueText>{entry?.payload.value}</LegendValueText>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default renderLegend;

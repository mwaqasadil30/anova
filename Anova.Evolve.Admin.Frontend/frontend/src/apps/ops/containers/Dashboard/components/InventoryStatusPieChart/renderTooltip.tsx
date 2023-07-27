import React from 'react';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { TooltipProps } from 'recharts';

const renderTooltip = (props: TooltipProps) => {
  const { active, payload, separator } = props;
  if (!active) {
    return null;
  }

  if (!payload || !payload.length) {
    return null;
  }

  return (
    <Paper square variant="outlined">
      <Box m={1}>
        {payload.map((entry, index) => {
          const displayValues = [
            entry.name,
            separator,
            entry.value,
            entry.unit || '',
          ];

          const formattedDisplayValues = displayValues.filter(Boolean).join('');
          return (
            <Typography key={`tooltip-item-${index}`}>
              {formattedDisplayValues}
            </Typography>
          );
        })}
      </Box>
    </Paper>
  );
};

export default renderTooltip;

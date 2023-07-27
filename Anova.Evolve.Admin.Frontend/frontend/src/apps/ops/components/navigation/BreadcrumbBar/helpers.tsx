import React from 'react';
import Box from '@material-ui/core/Box';

export interface RouteParams {
  assetId?: string;
  problemReportId?: string;
}

export function TabPanel(props: {
  children?: React.ReactNode;
  index: any;
  value: any;
}) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      maxHeight="75vh"
      overflow="auto"
      {...other}
    >
      {/* Unmount children when switching tabs */}
      <Box mt={2}>{value === index && children}</Box>

      {/* Keep children mounted when switching tabs */}
      {/* <div style={{ display: value === index ? 'inherit' : 'none' }}>
        {children}
      </div> */}
    </Box>
  );
}

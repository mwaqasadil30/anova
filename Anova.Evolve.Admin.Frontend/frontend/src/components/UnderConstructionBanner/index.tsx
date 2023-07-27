import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectTopOffsetForNavbars } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { constructionBannerHeight } from 'styles/theme';

const StyledReportProblemOutlinedIcon = styled(ReportProblemOutlinedIcon)`
  vertical-align: middle;
`;

const StyledTypography = styled(Typography)`
  font-size: 16px;
  font-weight: 800;
`;

const StyledAlert = styled(({ topOffset, ...props }) => <Alert {...props} />)`
  border-radius: 0;
  padding: 0;
  margin: 0 -32px;
  position: sticky;
  top: ${(props) => props.topOffset}px;
  z-index: 1;
  height: ${constructionBannerHeight}px;
  & .MuiAlert-message {
    width: 100%;
    padding: 3px 0;
  }
`;

const UnderConstructionBanner = () => {
  const topOffset = useSelector(selectTopOffsetForNavbars);

  return (
    <StyledAlert
      variant="filled"
      severity="warning"
      icon={false}
      topOffset={topOffset}
    >
      <Box px={1}>
        <Grid container spacing={1} alignItems="center" justify="center">
          <Grid item>
            <StyledReportProblemOutlinedIcon />
          </Grid>
          <Grid item>
            <StyledTypography display="inline">
              UNDER CONSTRUCTION
            </StyledTypography>
          </Grid>
          <Grid item>
            <StyledReportProblemOutlinedIcon />
          </Grid>
        </Grid>
      </Box>
    </StyledAlert>
  );
};

export default UnderConstructionBanner;

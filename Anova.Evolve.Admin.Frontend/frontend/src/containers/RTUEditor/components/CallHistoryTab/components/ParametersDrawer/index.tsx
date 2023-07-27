/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import React from 'react';
import styled from 'styled-components';

const StyledParameterData = styled(Typography)`
  white-space: pre;
  font-family: Monospace;
`;

const StyledEditorBox = styled(EditorBox)`
  overflow-x: scroll;
`;

interface Props {
  title?: string;
  parameterData?: any;
  cancelCallback: () => void;
}

const ParametersDrawer = ({ title, parameterData, cancelCallback }: Props) => {
  return (
    <>
      <CustomThemeProvider forceThemeType="dark">
        <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
          <EditorPageIntro
            showSaveOptions
            title={title}
            cancelCallback={cancelCallback}
          />
        </PageIntroWrapper>
      </CustomThemeProvider>
      <Box mt={3} />

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <StyledEditorBox>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <StyledParameterData>{parameterData}</StyledParameterData>
              </Grid>
            </Grid>
          </StyledEditorBox>
        </Grid>
      </Grid>
    </>
  );
};

export default ParametersDrawer;

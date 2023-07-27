import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CancelButton from 'components/buttons/CancelButton';
import SaveAndExitButton from 'components/buttons/SaveAndExitButton';
import SaveButton from 'components/buttons/SaveButton';
import GenericPageWrapper from 'components/GenericPageWrapper';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import React from 'react';
import styled from 'styled-components';

const StyledPageHeaderText = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
`;

const StyledPageHeaderSubText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 400;
  color: ${(props) => props.theme.palette.text.secondary};
`;
type EditPageContainerProps = {
  headerNavButton?: React.ReactNode;
  title?: string;
  subtitle?: string;
  cancel?: () => void;
  disableSaveButton?: boolean;
  showSaveButton?: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onSaveAndExit: () => void;
  topOffset: number;
};
const EditPageContainer = ({
  headerNavButton,
  title,
  subtitle,
  cancel,
  disableSaveButton,
  showSaveButton,
  isSubmitting,
  children,
  onSave,
  onSaveAndExit,
  topOffset,
}: React.PropsWithChildren<EditPageContainerProps>) => {
  const submit = () => {
    onSave();
  };
  const submitAndExit = () => {
    onSaveAndExit();
  };
  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper sticky verticalPaddingFactor={1} zIndex={4}>
        <Box>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justify="space-between"
          >
            {headerNavButton && <Grid item>{headerNavButton}</Grid>}
            <Grid item xs zeroMinWidth>
              <Grid container direction="column">
                <Grid item xs zeroMinWidth>
                  <StyledPageHeaderText title={title} noWrap>
                    {title}
                  </StyledPageHeaderText>
                </Grid>
                <Grid item xs zeroMinWidth>
                  <StyledPageHeaderSubText title={subtitle} noWrap>
                    {subtitle}
                  </StyledPageHeaderSubText>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <CancelButton onClick={cancel} fullWidth />
                </Grid>
                {showSaveButton && (
                  <>
                    <Grid item>
                      <SaveButton
                        onClick={submit}
                        fullWidth
                        variant="outlined"
                        disabled={isSubmitting || disableSaveButton}
                      />
                    </Grid>
                    <Grid item>
                      <SaveAndExitButton
                        onClick={submitAndExit}
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting || disableSaveButton}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </PageIntroWrapper>
      <Box
        mt={3}
        style={{
          height: '100%',
          minHeight: '1px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </GenericPageWrapper>
  );
};
export default EditPageContainer;

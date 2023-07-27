import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import LoginBg from 'assets/login-bg.png';
import Logo from 'components/icons/Logo';
import CustomThemeProvider from 'components/CustomThemeProvider';
import React from 'react';
import styled from 'styled-components';
import { gray900 } from 'styles/colours';

const Background = styled(Box)`
  position: relative;
`;

const StyledLoginWrapper = styled(Box)`
  width: 100%;
  box-sizing: border-box;
  background-color: ${gray900};
  border-radius: 20px;
`;

const BackgroundImg = styled.img`
  position: absolute;
  z-index: -1;
  width: 100vw;
  height: 100vh;
`;

const GridContainer = styled(Grid)`
  min-height: 90vh;
`;

const GridItemFullWidth = styled(Grid)`
  width: 100%;
`;

const StyledLogo = styled(Logo)`
  width: 183px;
  color: ${(props) => props.theme.palette.text.primary};
`;

interface Props {
  children: React.ReactNode;
}

const CenteredContentWithLogo = ({ children }: Props) => {
  return (
    <CustomThemeProvider forceThemeType="dark">
      <Background>
        <BackgroundImg src={LoginBg} alt="background" />
        <Container fixed>
          <GridContainer
            container
            alignItems="center"
            justify="center"
            direction="column"
          >
            <GridItemFullWidth item xs={12} sm={12} md={8} lg={6}>
              <StyledLoginWrapper px={8} py={6}>
                <Box display="flex" justifyContent="center" my={4}>
                  <StyledLogo />
                </Box>
                {children}
              </StyledLoginWrapper>
            </GridItemFullWidth>
          </GridContainer>
        </Container>
      </Background>
    </CustomThemeProvider>
  );
};

export default CenteredContentWithLogo;

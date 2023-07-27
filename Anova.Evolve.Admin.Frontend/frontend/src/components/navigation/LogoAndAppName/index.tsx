/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Logo from 'components/icons/Logo';
import {
  StyledDivider,
  StyledLogoLink,
  StyledNavText,
} from 'components/navigation/common';
import StyledLogo from 'components/navigation/TopNavigationLogo';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { navbarHeight } from 'styles/theme';

const LogoAndNameDivider = styled(StyledDivider)`
  display: ${(props) =>
    props.theme.palette.type === 'light' ? 'inherit' : 'none'};
`;

const StyledDefaultLogo = styled(Logo)`
  height: 40px;
`;

interface Props {
  appName: React.ReactNode;
  logoLinkTo: string;
}

const LogoAndAppName = ({ appName, logoLinkTo }: Props) => {
  const activeDomain = useSelector(selectActiveDomain);

  return (
    <Box p={1} height={navbarHeight}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        style={{ height: '100%' }}
      >
        <Grid
          item
          style={{
            padding: 0,
            height: '100%',
          }}
        >
          <StyledLogoLink to={logoLinkTo}>
            {activeDomain?.logo ? (
              <StyledLogo
                src={`data:image;base64,${activeDomain.logo}`}
                alt="Logo"
              />
            ) : (
              <StyledDefaultLogo />
            )}
          </StyledLogoLink>
        </Grid>
        <Grid item>
          <LogoAndNameDivider orientation="vertical" />
        </Grid>
        <Grid item>
          <StyledNavText>{appName}</StyledNavText>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LogoAndAppName;

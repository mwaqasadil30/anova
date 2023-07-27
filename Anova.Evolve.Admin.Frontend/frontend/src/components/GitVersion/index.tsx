import { lighten } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as ChevronIcon } from 'assets/icons/side-nav-chevron.svg';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsUserSystemAdminOrSystemUser } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { fadedBreadcrumbColor, gray900, white } from 'styles/colours';
import { getAppVersion } from 'utils/common';

const StyledGitVersionHash = styled(Typography)`
  color: ${fadedBreadcrumbColor};
  font-size: 12px;
`;

const StyledGitLogo = styled.img`
  height: 20px;
  width: 20px;
  opacity: 0.2;
  vertical-align: middle;
`;
const StyledListItem = styled(ListItem)`
  &.Mui-selected {
    position: relative;
    background: ${white};
  }
  ${({ active }: { active?: boolean }) =>
    active
      ? `
    border-left: 4px solid ${gray900};
    padding-left: 12px;
    `
      : ''}
`;
const StyledChevronIcon = styled(ChevronIcon)`
  padding: 7px;
  color: ${(props) => lighten(props.theme.custom.domainColor, 0.83)};
  ${(props: { open: boolean }) => props.open && `transform: rotate(180deg);`};
`;

interface Props {
  open: boolean;
  toggleDrawer: () => void;
}

const GitVersion = ({ open, toggleDrawer }: Props) => {
  const { t } = useTranslation();

  const [gitVersion] = useState(getAppVersion);
  const canViewGitVersion = useSelector(selectIsUserSystemAdminOrSystemUser);

  return (
    <Grid container spacing={1}>
      {canViewGitVersion && (
        <Grid item xs={12}>
          <Box p="4px">
            <Grid container spacing={1} justify="center" alignItems="center">
              <Grid item>
                <StyledGitLogo
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Git_icon.svg/1200px-Git_icon.svg.png"
                  alt="git logo"
                />
              </Grid>
              <Grid item>
                <StyledGitVersionHash>
                  {gitVersion
                    ? gitVersion.substring(0, 7)
                    : t('ui.common.notapplicable', 'N/A')}
                </StyledGitVersionHash>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      )}
      <Grid item xs={12}>
        <StyledListItem
          button
          onClick={toggleDrawer}
          aria-label="Collapse side nav"
          aria-expanded={open}
        >
          <ListItemIcon>
            <StyledChevronIcon open={open} />
          </ListItemIcon>
        </StyledListItem>
      </Grid>
    </Grid>
  );
};

export default GitVersion;

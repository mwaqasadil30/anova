import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import trainingRoutes from 'apps/training/routes';
import { ReactComponent as AboutIcon } from 'assets/icons/about.svg';
import { ReactComponent as HelpIcon } from 'assets/icons/icn-question.svg';
import { ReactComponent as NotesIcon } from 'assets/icons/icon-notes.svg';
import { ReactComponent as ContactSupportIcon } from 'assets/icons/phone.svg';
import { ReactComponent as AccessDolv3Icon } from 'assets/icons/msedge-logo.svg';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import Menu from 'components/Menu';
import {
  StyledMenuItem,
  StyledMenuItemDivider,
  StyledMenuItemText,
  StyledNavbarCaretButton,
} from 'components/navigation/common';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledTypography = styled(Typography)`
  font-size: 20px;
`;

interface Props {
  releaseNotesRoute: string;
  contactSupportRoute: string;
  accessDolv3Route: string;
}

const AboutMenu = ({
  releaseNotesRoute,
  contactSupportRoute,
  accessDolv3Route,
}: Props) => {
  const { t } = useTranslation();

  const [helpAnchorEl, setHelpAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  const handleHelpClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setHelpAnchorEl(event.currentTarget);
  };

  const handleHelpClose = () => {
    setHelpAnchorEl(null);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const mainTitle = t('ui.main.about', 'About');

  return (
    <>
      <StyledNavbarCaretButton
        variant="text"
        color="inherit"
        style={{ minWidth: 36 }}
        onClick={handleHelpClick}
      >
        <HelpIcon />
      </StyledNavbarCaretButton>
      <Menu
        id="help-menu"
        anchorEl={helpAnchorEl}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(helpAnchorEl)}
        onClose={handleHelpClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <StyledMenuItem
          // @ts-ignore
          component={Link}
          to={trainingRoutes.base}
          onClick={handleHelpClose}
        >
          <ListItemIcon onClick={handleHelpClose}>
            <MenuBookIcon />
          </ListItemIcon>
          <StyledMenuItemText>
            {t('ui.main.trainingHub', 'Training Hub')}
          </StyledMenuItemText>
        </StyledMenuItem>
        <StyledMenuItem
          // @ts-ignore
          component={Link}
          to={contactSupportRoute}
          onClick={handleHelpClose}
        >
          <ListItemIcon onClick={handleHelpClose}>
            <ContactSupportIcon />
          </ListItemIcon>
          <StyledMenuItemText>
            {t('ui.main.contactSupport', 'Contact Support')}
          </StyledMenuItemText>
        </StyledMenuItem>

        <StyledMenuItem
          // @ts-ignore
          component={Link}
          to={releaseNotesRoute}
          onClick={handleHelpClose}
        >
          <ListItemIcon>
            <NotesIcon />
          </ListItemIcon>
          <StyledMenuItemText>
            {t('ui.main.releaseNotes', 'Release Notes')}
          </StyledMenuItemText>
        </StyledMenuItem>
        <StyledMenuItem
          // @ts-ignore
          component={Link}
          to={accessDolv3Route}
          onClick={handleHelpClose}
        >
          <ListItemIcon onClick={handleHelpClose}>
            <AccessDolv3Icon />
          </ListItemIcon>
          <StyledMenuItemText>
            {t('ui.main.accessDolv3', 'Access DOLV3')}
          </StyledMenuItemText>
        </StyledMenuItem>
        <StyledMenuItemDivider
          // @ts-ignore
          component="li"
        />
        <StyledMenuItem onClick={handleClickOpen}>
          <ListItemIcon>
            <AboutIcon />
          </ListItemIcon>
          <StyledMenuItemText>{t('ui.main.about', 'About')}</StyledMenuItemText>
        </StyledMenuItem>
      </Menu>

      <UpdatedConfirmationDialog
        open={open}
        maxWidth="sm"
        mainTitle={mainTitle}
        content={
          <>
            <Box p={2} pb={0}>
              <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
                justify="center"
              >
                <Grid item xs={12}>
                  <StyledTypography>
                    ANOVA Transcend IoT Platform
                  </StyledTypography>
                </Grid>
              </Grid>
            </Box>
          </>
        }
        onConfirm={handleClose}
        hideCancelButton
      />
    </>
  );
};

export default AboutMenu;

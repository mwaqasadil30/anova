/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import { UserDto } from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import AccordionDetails from 'components/AccordionDetails';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import { StaticAccordion } from 'components/StaticAccordion';
import StyledLabelWithValue from 'containers/DataChannelEditor/components/ProfileTab/components/StyledLabelWithValue';
import {
  BoxTitle,
  StyledAccordionSummary,
  StyledEditButton,
  StyledEditIcon,
} from 'containers/DataChannelEditor/components/ProfileTab/styles';
import EditUserDrawer from 'containers/UserEditorBase/components/EditUserDrawer';
import moment from 'moment';
import 'moment-duration-format';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

interface Props {
  canUpdateUser?: boolean;
  userDetails?: UserDto | null;
}

const UserDetailsPanel = ({ canUpdateUser, userDetails }: Props) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const [isUserDetailsDrawerOpen, setIsUserDetailsDrawerOpen] = useState(false);

  const closeUserDetailsDrawer = () => {
    setIsUserDetailsDrawerOpen(false);
  };

  const openUserDetailsDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsUserDetailsDrawerOpen(true);
  };

  const saveAndExitCallback = () => {
    closeUserDetailsDrawer();

    // Re-fetch user details
    queryClient.invalidateQueries([
      APIQueryKey.getUserByUserId,
      userDetails?.id,
    ]);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isUserDetailsDrawerOpen}
        onClose={closeUserDetailsDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <EditUserDrawer
            userDetails={userDetails}
            cancelCallback={closeUserDetailsDrawer}
            saveAndExitCallback={saveAndExitCallback}
          />
        </DrawerContent>
      </Drawer>
      <Grid item xs={12}>
        <StaticAccordion>
          <StyledAccordionSummary>
            <Grid
              container
              alignItems="center"
              spacing={0}
              justify="space-between"
            >
              <Grid item>
                <BoxTitle>
                  {t('ui.userEditor.userDetails', 'User Details')}
                </BoxTitle>
              </Grid>

              {canUpdateUser && (
                <Grid item>
                  <StyledEditButton onClick={openUserDetailsDrawer}>
                    <StyledEditIcon />
                  </StyledEditButton>
                </Grid>
              )}
            </Grid>
          </StyledAccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={4} lg={2}>
                <StyledLabelWithValue
                  label={t(
                    'ui.userEditor.userAuthentication',
                    'User Authentication'
                  )}
                  value={userDetails?.authenticationTypeDescription}
                />
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <StyledLabelWithValue
                  label={t('ui.userEditor.emailAddress', 'Email Address')}
                  value={userDetails?.emailAddress}
                />
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <StyledLabelWithValue
                  label={t('ui.userList.fistName', 'First Name')}
                  value={userDetails?.firstName}
                />
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <StyledLabelWithValue
                  label={t('ui.userList.lastName', 'Last Name')}
                  value={userDetails?.lastName}
                />
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <StyledLabelWithValue
                  label={t('ui.userList.company', 'Company')}
                  value={userDetails?.companyName}
                />
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <StyledLabelWithValue
                  label={t(
                    'ui.userEditor.applicationTimeout',
                    'Application Timeout'
                  )}
                  value={
                    userDetails?.applicationTimeoutInSeconds
                      ? moment
                          .duration(
                            userDetails?.applicationTimeoutInSeconds,
                            'seconds'
                          )
                          .format('hh:mm', { trim: false })
                      : ''
                  }
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </StaticAccordion>
      </Grid>
    </>
  );
};

export default UserDetailsPanel;

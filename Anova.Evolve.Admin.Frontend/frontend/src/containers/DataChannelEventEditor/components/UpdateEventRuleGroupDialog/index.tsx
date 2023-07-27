/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { EventRuleGroupListItemDto } from 'api/admin/api';
import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';

const StyledWarningTriangleIcon = styled(WarningTriangle)`
  padding-left: 8px;
`;

const DialogMainText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: 500;
  line-height: 18px;
`;

interface Props {
  initialEventRuleGroup: EventRuleGroupListItemDto | null;
  isDialogOpen: boolean;
  isLoading: boolean;
  hasError: boolean;
  closeDialog: () => void;
  confirmSave: () => void;
  setSelectedEventRuleGroup: React.Dispatch<
    React.SetStateAction<EventRuleGroupListItemDto | null>
  >;
}

const UpdateEventRuleGroupDialog = ({
  initialEventRuleGroup,
  isDialogOpen,
  isLoading,
  hasError,
  closeDialog,
  confirmSave,
  setSelectedEventRuleGroup,
}: Props) => {
  const { t } = useTranslation();

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const mainTitle = t('ui.eventruleGroup.warning', 'Event Rule Group Warning');
  const confirmationButtonText = t('ui.common.yes', 'Yes');
  return (
    <UpdatedConfirmationDialog
      open={isDialogOpen}
      maxWidth="xs"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      content={
        <Box m={3} mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container alignItems="flex-start">
                <Grid item xs={11}>
                  <Grid container spacing={2}>
                    <Grid item xs={2}>
                      <StyledWarningTriangleIcon />
                    </Grid>
                    <Grid item xs={10}>
                      <DialogMainText align="left">
                        {isAirProductsEnabledDomain
                          ? t(
                              'ui.eventruleGroup.allEventsWillBeRemovedAirProducts',
                              'All event rules will be removed from this data channel and any open events and problem reports will be closed. Would you like to continue?'
                            )
                          : t(
                              'ui.eventruleGroup.allEventsWillBeRemoved',
                              'All event rules will be removed from this data channel and any open events will be closed. Would you like to continue?'
                            )}
                      </DialogMainText>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {hasError && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error" align="center">
                  {t('ui.common.defaultError', 'An unexpected error occurred')}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      }
      confirmationButtonText={confirmationButtonText}
      closeDialog={() => {
        setSelectedEventRuleGroup(initialEventRuleGroup);
        closeDialog();
      }}
      onConfirm={confirmSave}
      isDisabled={isLoading}
    />
  );
};

export default UpdateEventRuleGroupDialog;

import PasswordChangeForDolV3Dialog from 'components/PasswordChangeForDolV3Dialog';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectHasConfirmedWelcomeDialog,
  selectIsAuthenticated,
  selectShowPreviewPage,
  selectUserAccessTranscendAndDolv3StatusId,
} from 'redux-app/modules/user/selectors';
import { TranscendAndDolV3UserAccess } from 'types';
import NewFeaturesShowcaseDialog from '../NewFeaturesShowcaseDialog';
import {
  getHasShownNewFeaturesShowcaseDialog,
  getShouldShowNewFeaturesShowcaseDialogBasedOnDate,
  setHasShownNewFeaturesShowcaseDialog,
} from '../NewFeaturesShowcaseDialog/helpers';
import WelcomeDialog from '../WelcomeDialog';

enum DialogType {
  Welcome = 'welcome',
  NewFeaturesShowcase = 'new-features-showcase',
  DolV3PasswordChange = 'dolv3-password-change',
}

const FirstWelcomeDialog = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const showPreviewPage = useSelector(selectShowPreviewPage);
  const hasConfirmedDialog = useSelector(selectHasConfirmedWelcomeDialog);
  const userAccessToTranscendAndDolV3StatusId = useSelector(
    selectUserAccessTranscendAndDolv3StatusId
  );

  const shouldShowWelcomeDialog = showPreviewPage && !hasConfirmedDialog;
  const shouldShowNewFeaturesShowcaseDialog =
    !shouldShowWelcomeDialog &&
    isAuthenticated &&
    getShouldShowNewFeaturesShowcaseDialogBasedOnDate() &&
    !getHasShownNewFeaturesShowcaseDialog();

  // Only one of these dialogs can be open at the same time
  const [currentDialogOpen, setCurrentDialogOpen] = useState<DialogType | null>(
    null
  );

  useEffect(() => {
    if (
      userAccessToTranscendAndDolV3StatusId ===
      TranscendAndDolV3UserAccess.CreatePasswordToAccessTranscendAndDolV3
    ) {
      setCurrentDialogOpen(DialogType.DolV3PasswordChange);
    } else if (shouldShowWelcomeDialog) {
      setCurrentDialogOpen(DialogType.Welcome);
    } else if (shouldShowNewFeaturesShowcaseDialog) {
      setCurrentDialogOpen(DialogType.NewFeaturesShowcase);
    }
  }, [isAuthenticated]);

  const closeDialog = () => {
    // If the user has seen the WelcomeDialog, we don't let them see the
    // NewFeaturesShowcaseDialog (since its most likely the first time they
    // used the app). The only other dialog we show is the
    // NewFeaturesShowcaseDialog, which we also don't want to show again if the
    // user closes it.
    setHasShownNewFeaturesShowcaseDialog(true);
    setCurrentDialogOpen(null);
  };

  return (
    <>
      <WelcomeDialog
        isOpen={currentDialogOpen === DialogType.Welcome}
        handleClose={closeDialog}
      />
      <NewFeaturesShowcaseDialog
        isOpen={currentDialogOpen === DialogType.NewFeaturesShowcase}
        handleClose={closeDialog}
      />
      <PasswordChangeForDolV3Dialog
        isOpen={currentDialogOpen === DialogType.DolV3PasswordChange}
        handleClose={closeDialog}
      />
    </>
  );
};

export default FirstWelcomeDialog;

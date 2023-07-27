/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { UserSelfServeDto } from 'api/admin/api';
import BackIconButton from 'components/buttons/BackIconButton';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import EditorPageIntro, {
  EditorPageIntroProps,
} from 'components/EditorPageIntro';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { Formik, FormikHelpers } from 'formik';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectUserId } from 'redux-app/modules/user/selectors';
import { validateAllPasswordRequirements } from 'utils/ui/password';
import ObjectForm from './components/ObjectForm';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './components/ObjectForm/helpers';
import type { Values } from './components/ObjectForm/types';
import { useGetUserByUserId } from './hooks/useGetUserByUserId';
import { useSaveUser } from './hooks/useSaveUser';

interface Props {
  isInlineForm?: boolean;
}

const UserProfile = ({ isInlineForm }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const userId = useSelector(selectUserId);

  // Edit User Api
  const editUserApi = useGetUserByUserId(userId);
  const userDetails = editUserApi.data;

  // Update/Save User Api
  const updateUserApi = useSaveUser();
  const submissionResult = updateUserApi.data;
  const submissionError = updateUserApi.error;

  const fetchEditData = useCallback(() => {
    updateUserApi.reset();
    editUserApi.refetch();
  }, [userId]);

  useEffect(() => {
    fetchEditData();
  }, [fetchEditData]);

  const refetchEditData = () => {
    fetchEditData();
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    const formattedValuesForApi = formatValuesForApi(values);

    return updateUserApi
      .mutateAsync({
        userId: userId!,
        userDTO: { userId, ...formattedValuesForApi } as UserSelfServeDto,
      })
      .catch((error) => {
        if (error) {
          const formattedErrors = mapApiErrorsToFields(t, error as any);

          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const saveCallback = () => {};
  const saveAndExitCallback = () => {
    history.goBack();
  };

  // Memoized to prevent unnecessary data/re-renders while using formik's
  // enableReinitialize prop
  const formattedInitialValues = useMemo(
    () => formatInitialValues(userDetails),
    [userDetails]
  );

  const firstNameText = t('ui.userEditor.firstName', 'First Name');
  const lastNameText = t('ui.userEditor.lastName', 'Last Name');
  const emailText = t('ui.userEditor.emailAddress', 'Email Address');
  const newPasswordText = t('ui.userEditor.newPassword', 'New Password');
  const confirmPasswordText = t(
    'ui.changepassword.confirmpassword',
    'Confirm Password'
  );

  const validationSchema = buildValidationSchema(t, {
    firstNameText,
    lastNameText,
    emailText,
    newPasswordText,
    confirmPasswordText,
  });

  const isFetchingEditData = editUserApi.isFetching;
  const editUserDataError = editUserApi.isError;

  const isUsing3rdPartyIdentityProvider =
    editUserApi.data?.isUsing3rdPartyIdentityProvider;

  // Prevent the form from being rendered until we get all the necessary data
  // so Formik doesn't reinitialize the form (via enableReinitialize)
  // incorrectly
  if (isFetchingEditData || editUserDataError) {
    return (
      <>
        <PageIntroWrapper sticky {...(isInlineForm && { topOffset: 0 })}>
          <EditorPageIntro
            title={t('ui.userProfile.pageIntroTitle', 'Profile')}
            cancelCallback={
              isUsing3rdPartyIdentityProvider ? undefined : refetchEditData
            }
            headerNavButton={<BackIconButton />}
            isWithinDrawer={isInlineForm}
          />
        </PageIntroWrapper>

        <Box mt={3}>
          <TransitionLoadingSpinner in={isFetchingEditData} />
          <TransitionErrorMessage
            in={!isFetchingEditData && editUserDataError}
          />
        </Box>
      </>
    );
  }

  return (
    <Formik<Values>
      // NOTE: We're using enableReinitialize so we can render the sticky
      // PageIntroWrapper while the API call is being made or when there's an
      // error so the user can click on the back button in the PageIntro to go
      // back. If there's weird form issues, it may be worth seeing if it's
      // because of enableReinitialize.
      enableReinitialize
      initialValues={formattedInitialValues}
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema}
      validate={(values) => {
        const isPasswordCheckNotNeeded =
          !values.newPassword || !values.confirmPassword;

        // Dont validate password if its not needed
        const errors: any = {};

        const passwordValidationRequirements = validateAllPasswordRequirements(
          values.newPassword
        );
        const invalidRequirements = Object.values(
          passwordValidationRequirements
        ).filter((isValid) => !isValid);
        const isPasswordInvalid = invalidRequirements.length > 0;

        if (!isPasswordCheckNotNeeded && isPasswordInvalid) {
          errors.newPassword = t(
            'ui.resetPassword.invalidPassword',
            'Invalid password'
          );
        }

        // Validate newPassword + confirmPassword if oldPassword has value
        if (
          values.oldPassword &&
          !values.newPassword &&
          !values.confirmPassword
        ) {
          errors.newPassword = t(
            'ui.resetPassword.requiredNewPassword',
            'New Password is required'
          );
          errors.confirmPassword = t(
            'ui.resetPassword.requiredConfirmPassword',
            'Confirm new password'
          );
        }

        // Validate old password if newpassword and/or confirmPassword has value
        if (
          values.newPassword &&
          values.confirmPassword &&
          !values.oldPassword
        ) {
          errors.oldPassword = t(
            'ui.resetPassword.requiredOldPassword',
            'Old Password is required'
          );
        }

        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, resetForm, submitForm }) => {
        // If the user's using a 3rd party identity provider, they can't edit
        // anything on this page, so we remove the cancel and save buttons.
        // Otherwise, we show the cancel and save buttons.
        const cancelAndSaveProps: Partial<EditorPageIntroProps> = isUsing3rdPartyIdentityProvider
          ? {
              cancelCallback: undefined,
              saveCallback: undefined,
              saveAndExitCallback: undefined,
            }
          : {
              cancelCallback: () => {
                resetForm();
                refetchEditData();
              },
              saveCallback,
              saveAndExitCallback,
            };

        return (
          <>
            <PageIntroWrapper sticky {...(isInlineForm && { topOffset: 0 })}>
              <EditorPageIntro
                title={t('ui.userProfile.pageIntroTitle', 'Profile')}
                isSubmitting={isSubmitting}
                submissionResult={submissionResult}
                submissionError={submissionError}
                showSaveOptions
                submitForm={submitForm}
                headerNavButton={<BackIconButton />}
                isWithinDrawer={isInlineForm}
                {...cancelAndSaveProps}
              />
            </PageIntroWrapper>

            <Box mt={3}>
              <TransitionLoadingSpinner in={isFetchingEditData} />
              <TransitionErrorMessage
                in={!isFetchingEditData && editUserDataError}
              />

              <Fade in={!isFetchingEditData && !editUserDataError}>
                <div>
                  {!isFetchingEditData && !editUserDataError && (
                    <Grid
                      container
                      spacing={2}
                      direction="column"
                      justify="space-between"
                    >
                      <Grid item xs={12}>
                        <ObjectForm
                          values={values}
                          userName={editUserApi.data?.userName}
                          isUsing3rdPartyIdentityProvider={
                            isUsing3rdPartyIdentityProvider
                          }
                        />
                      </Grid>
                    </Grid>
                  )}
                </div>
              </Fade>
            </Box>
          </>
        );
      }}
    </Formik>
  );
};

export default UserProfile;

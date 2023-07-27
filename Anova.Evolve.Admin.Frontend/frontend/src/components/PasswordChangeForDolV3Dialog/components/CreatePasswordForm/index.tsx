/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { SetupDolV3AccessRequest } from 'api/admin/api';
import Alert from 'components/Alert';
import Button from 'components/Button';
import LoadingButton from 'components/buttons/LoadingButton';
import PasswordField from 'components/forms/form-fields/PasswordField';
import Logo from 'components/icons/Logo';
import PageHeader from 'components/PageHeader';
import PasswordRequirementsList from 'components/PasswordRequirementsList';
import PasswordRequirementsPopper from 'components/PasswordRequirementsPopper';
import PasswordStrengthIndicatorWithApi from 'components/PasswordStrengthIndicatorWithApi';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setUserAccessToDolV3AndTranscend } from 'redux-app/modules/user/actions';
import {
  selectUserId,
  selectUsernameConvertedForDolV3Application,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { validateAllPasswordRequirements } from 'utils/ui/password';
import {
  buildValidationSchema,
  initialValues,
  mapApiErrorsToFields,
} from './helpers';
import { useSavePasswordForDolV3 } from './hooks/useSavePasswordForDolV3';
import { Values } from './types';

const StyledLogo = styled(Logo)`
  color: ${(props) => props.theme.palette.text.primary};
  width: 150px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const StyledUsernameText = styled(Typography)`
  font-weight: 500;
  font-size: 17px;
`;

interface Props {
  setIsNewPasswordConfirmed: (data: boolean) => void;
  closeDialog: () => void;
}

const ResetPasswordWithToken = ({
  setIsNewPasswordConfirmed,
  closeDialog,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [
    popperAnchorEl,
    setPopperAnchorEl,
  ] = React.useState<HTMLElement | null>(null);

  const userId = useSelector(selectUserId);
  const usernameConvertedForDolV3Application = useSelector(
    selectUsernameConvertedForDolV3Application
  );

  const [isPopperOpen, setIsPopperOpen] = React.useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setPopperAnchorEl(event.currentTarget.parentElement);
    setIsPopperOpen(true);
  };

  const handleBlur = () => {
    setPopperAnchorEl(null);
    setIsPopperOpen(false);
  };

  const passwordText = t('ui.changepassword.password', 'Password');
  const confirmPasswordText = t(
    'ui.changepassword.confirmpassword',
    'Confirm Password'
  );
  const validationSchema = buildValidationSchema(t, {
    password: passwordText,
    confirmPassword: confirmPasswordText,
  });

  const savePasswordForDolV3Api = useSavePasswordForDolV3({
    onSuccess: () => {
      setIsNewPasswordConfirmed(true);
      // So this Dialog will not appear after every refresh -- only once user
      // logs-in again
      dispatch(setUserAccessToDolV3AndTranscend(undefined));
    },
  });

  const handleFormSubmit = (
    values: Values,
    formikBag: FormikHelpers<Values>
  ) => {
    return savePasswordForDolV3Api
      .mutateAsync({
        userId,
        userName: usernameConvertedForDolV3Application,
        password: values.confirmNewPassword,
      } as SetupDolV3AccessRequest)
      .catch((error) => {
        if (error) {
          const formattedErrors = mapApiErrorsToFields(t, error);

          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  return (
    <Box
      width={500}
      maxWidth="100%"
      minHeight={300}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      flexWrap="nowrap"
    >
      <Formik<Values>
        initialValues={initialValues}
        validationSchema={validationSchema}
        validate={(values) => {
          const errors: any = {};

          const passwordValidationRequirements = validateAllPasswordRequirements(
            values.newPassword
          );
          const invalidRequirements = Object.values(
            passwordValidationRequirements
          ).filter((isValid) => !isValid);
          const isPasswordInvalid = invalidRequirements.length > 0;

          if (isPasswordInvalid) {
            errors.newPassword = t(
              'ui.resetPassword.invalidPassword',
              'Invalid password'
            );
          }

          return errors;
        }}
        onSubmit={handleFormSubmit}
      >
        {({ values, handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={3} justify="center">
                <Grid item xs={12}>
                  <StyledLogo />
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    {t(
                      'ui.welcome.selectedToContinueUsingDolv3',
                      'You have been selected to continue using DOLV3, to login you need to use the Username below and create a new password for your account.'
                    )}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12}>
                      <Typography>
                        {t('ui.common.username', 'Username')}:
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <StyledUsernameText>
                        {usernameConvertedForDolV3Application}
                      </StyledUsernameText>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <PageHeader dense align="center">
                    {t('ui.welcome.setDolV3Password', 'Set DOLV3 Password')}
                  </PageHeader>
                </Grid>

                {savePasswordForDolV3Api.isError && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      {t(
                        'ui.common.defaultError',
                        'An unexpected error occurred'
                      )}
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <PasswordStrengthIndicatorWithApi
                    password={values.newPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={PasswordField}
                    required
                    id="newPassword-input"
                    name="newPassword"
                    placeholder={t(
                      'ui.resetPassword.enterNewPassword',
                      'Enter new password'
                    )}
                    fullWidth
                    disabled={savePasswordForDolV3Api.isLoading}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <PasswordRequirementsPopper
                    open={isPopperOpen}
                    anchorEl={popperAnchorEl}
                    placement="bottom"
                    disablePortal={false}
                    style={{
                      width: popperAnchorEl?.offsetWidth,
                      // Material UI <Dialog />'s have a default zIndex of 1300.
                      zIndex: 1301,
                    }}
                  >
                    <PasswordRequirementsList password={values.newPassword} />
                  </PasswordRequirementsPopper>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={PasswordField}
                    required
                    id="confirmNewPassword-input"
                    name="confirmNewPassword"
                    placeholder={t(
                      'ui.changepassword.confirmpassword.placeholder',
                      'Re-enter new password'
                    )}
                    fullWidth
                    disabled={savePasswordForDolV3Api.isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    container
                    spacing={3}
                    alignItems="center"
                    justify="center"
                  >
                    <Grid item xs={12} md={5}>
                      <LoadingButton
                        type="submit"
                        fullWidth
                        isLoading={savePasswordForDolV3Api.isLoading}
                      >
                        {t('ui.resetPassword.savePassword', 'Save Password')}
                      </LoadingButton>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={closeDialog}
                      >
                        {t('ui.common.cancel', 'Cancel')}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default ResetPasswordWithToken;

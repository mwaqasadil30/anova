import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import Alert from 'components/Alert';
import LoadingButton from 'components/buttons/LoadingButton';
import PasswordField from 'components/forms/form-fields/PasswordField';
import CenteredContentWithLogo from 'components/layout/CenteredContentWithLogo';
import PageHeader from 'components/PageHeader';
import PasswordRequirementsPopper from 'components/PasswordRequirementsPopper';
import PasswordStrengthIndicator from 'components/PasswordStrengthIndicator';
import { Field, Form, Formik } from 'formik';
import { TFunction } from 'i18next';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  changePasswordSuccess,
  performLogout,
} from 'redux-app/modules/user/actions';
import { selectUserId } from 'redux-app/modules/user/selectors';
import routes from 'routes-config';
import styled from 'styled-components';
import { validateAllPasswordRequirements } from 'utils/ui/password';
import * as Yup from 'yup';
import PasswordRequirementsList from 'components/PasswordRequirementsList';
import { useChangePassword } from './hooks/useChangePassword';
import { SetPasswordOnNextLoginValues } from './types';

const StyledPageHeader = styled(PageHeader)`
  && {
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

const StyledLink = styled(MuiLink)`
  font-size: 14px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const TextAlignRight = styled.div`
  text-align: right;
`;

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const fieldIsRequired = (field: string) =>
    t('validate.common.isrequired', '{{field}} is required.', { field });

  const passwordsMustMatchText = t(
    'validate.changepassword.passwordsDoNotMatch',
    'Passwords do not match'
  );

  return Yup.object().shape({
    // Other validation for this field is done via the Formik `validate` prop
    newPassword: Yup.string()
      .typeError(fieldIsRequired(translationTexts.password))
      .required(fieldIsRequired(translationTexts.password)),
    confirmNewPassword: Yup.string()
      .typeError(fieldIsRequired(translationTexts.confirmPassword))
      .required(fieldIsRequired(translationTexts.confirmPassword))
      .oneOf([Yup.ref('newPassword'), null], passwordsMustMatchText),
  });
};

const initialValues: SetPasswordOnNextLoginValues = {
  newPassword: '',
  confirmNewPassword: '',
};

const SetPasswordOnNextLogin = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userId = useSelector(selectUserId);

  const [
    popperAnchorEl,
    setPopperAnchorEl,
  ] = React.useState<HTMLElement | null>(null);
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

  const changePasswordApi = useChangePassword({
    onSuccess: () => {
      dispatch(changePasswordSuccess());
      history.push(routes.home);
    },
  });

  const logout = () => {
    dispatch(performLogout());
  };
  const handleFormSubmit = (values: SetPasswordOnNextLoginValues) => {
    // NOTE: Without catching the error here we get a uncaught promise error
    return changePasswordApi
      .mutateAsync({ ...values, userId: userId! })
      .catch(() => {});
  };

  // Log the user out if the user closes the page. The user is technically
  // logged in at this point, but they may not realize that and may close the
  // browser. If they were using the computer publically, the next user to view
  // this page would be able to set their password, and then use the app.
  useEffect(() => {
    const handleWindowBeforeUnload = () => {
      logout();
    };

    window.addEventListener('beforeunload', handleWindowBeforeUnload);

    return () =>
      window.removeEventListener('beforeunload', handleWindowBeforeUnload);
  }, []);

  return (
    <CenteredContentWithLogo>
      <Formik<SetPasswordOnNextLoginValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        /* eslint-disable-next-line consistent-return */
        validate={(values) => {
          const passwordValidationRequirements = validateAllPasswordRequirements(
            values.newPassword
          );
          const invalidRequirements = Object.values(
            passwordValidationRequirements
          ).filter((isValid) => !isValid);
          const isPasswordInvalid = invalidRequirements.length > 0;

          if (isPasswordInvalid) {
            return {
              newPassword: t(
                'ui.resetPassword.invalidPassword',
                'Invalid password'
              ),
            };
          }
        }}
        onSubmit={handleFormSubmit}
      >
        {({ values, handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={3} justify="center">
                <Grid item xs={12}>
                  <StyledPageHeader dense align="center">
                    {t('ui.main.changepassword', 'Change Password')}
                  </StyledPageHeader>
                </Grid>

                {changePasswordApi.isError && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      {/* TODO: Convert error from back-end */}
                      {t(
                        'ui.common.defaultError',
                        'An unexpected error occurred'
                      )}
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <PasswordStrengthIndicator password={values.newPassword} />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={PasswordField}
                    required
                    id="newPassword-input"
                    name="newPassword"
                    placeholder={t(
                      'ui.changepassword.password.placeholder',
                      'Enter new password'
                    )}
                    fullWidth
                    disabled={changePasswordApi.isLoading}
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
                    disabled={changePasswordApi.isLoading}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12}>
                      <LoadingButton
                        type="submit"
                        fullWidth
                        isLoading={changePasswordApi.isLoading}
                      >
                        {t('ui.main.changepassword', 'Change Password')}
                      </LoadingButton>
                    </Grid>
                    <Grid item xs={12}>
                      <TextAlignRight>
                        <StyledLink
                          // @ts-ignore
                          component="button"
                          onClick={logout}
                          underline="always"
                        >
                          {t('ui.main.logout', 'Logout')}
                        </StyledLink>
                      </TextAlignRight>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </CenteredContentWithLogo>
  );
};

export default SetPasswordOnNextLogin;

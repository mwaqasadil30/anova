import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  DomainAssetGroupsDTO,
  DomainUserRolesDTO,
  UserDto,
} from 'api/admin/api';
import routes from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { AssetGroupIdToNameMapping } from 'containers/UserEditorBase/types';
import { Formik, FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';
import { selectUserId } from 'redux-app/modules/user/selectors';
import { generatePath, useHistory, useParams } from 'react-router';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { parseResponseError } from 'utils/api/handlers';
import { isNumber } from 'utils/format/numbers';
import { validateAllPasswordRequirements } from 'utils/ui/password';
import ObjectForm from './components/ObjectForm';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './components/ObjectForm/helpers';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';
import { useSaveUser } from './hooks/useSaveUser';

interface RouteParams {
  userId?: string;
}

interface Props {
  editUserApi: UseQueryResult<UserDto | null, unknown>;
  getAssetGroupsForDomainApi: UseQueryResult<DomainAssetGroupsDTO[], unknown>;
  getUserRolesForDomainApi: UseQueryResult<DomainUserRolesDTO[], unknown>;
  isInlineForm?: boolean;
  refetchBaseEditData: VoidFunction;
}

const UserEditor = ({
  editUserApi,
  getAssetGroupsForDomainApi,
  getUserRolesForDomainApi,
  isInlineForm,
  refetchBaseEditData,
}: Props) => {
  const currentUserId = useSelector(selectUserId);
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams<RouteParams>();
  const editingUserId = params.userId;
  const isCreating = !editingUserId;
  const isLoggedUser = currentUserId === editingUserId;

  const activeDomain = useSelector(selectActiveDomain);

  // Edit User Api
  const userDetails = editUserApi.data;
  const domainIdForUser = editUserApi.data?.domainId || activeDomain?.domainId;

  const domainFromUsername = userDetails?.userName?.split('@').pop() || '';
  const domainNameForUsernameSuffix =
    domainFromUsername || activeDomain?.name || '';
  const domainSuffix = `@${domainNameForUsernameSuffix}`;

  // Update/Save User Api
  const updateUserApi = useSaveUser();
  const submissionResult = updateUserApi.data;
  const submissionError = updateUserApi.error;

  // Create a top-level mapping of ALL asset groups from ALL domains of the
  // asset group ID to the asset group name
  const assetGroupIdToNameMapping = useMemo(() => {
    return getAssetGroupsForDomainApi.data?.reduce<AssetGroupIdToNameMapping>(
      (prevDomainAssetGroupMapping, domain) => {
        const domainAssetGroupIdToNameMapping = domain.domainAssetGroups?.reduce<AssetGroupIdToNameMapping>(
          (prevAssetGroupMapping, assetGroup) => {
            prevAssetGroupMapping[assetGroup.id!] = assetGroup.name;
            return prevAssetGroupMapping;
          },
          {}
        );

        return {
          ...prevDomainAssetGroupMapping,
          ...domainAssetGroupIdToNameMapping,
        };
      },
      {}
    );
  }, [getAssetGroupsForDomainApi.data]);

  const refetchEditData = () => {
    updateUserApi.reset();
    refetchBaseEditData();
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    const formattedValuesForApi = formatValuesForApi({
      values,
      usernameDomainSuffix: domainSuffix,
    });

    return updateUserApi
      .makeRequest({
        ...formattedValuesForApi,
        ...(editingUserId && { id: editingUserId }),
        domainId: domainIdForUser,
      } as UserDto)
      .catch((error) => {
        const errorResult = parseResponseError(error);

        if (errorResult) {
          const formattedErrors = mapApiErrorsToFields(
            t,
            errorResult.errors as any
          );

          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const saveCallback = (response: UserDto) => {
    if (response?.id) {
      const editRoutePath = generatePath(routes.userManager.edit, {
        userId: response.id,
      });
      history.replace(editRoutePath);
    }
  };
  const saveAndExitCallback = () => {
    history.push(routes.userManager.list);
  };

  // Memoized to prevent unnecessary data/re-renders while using formik's
  // enableReinitialize prop
  const formattedInitialValues = useMemo(
    () =>
      formatInitialValues(
        userDetails,
        getUserRolesForDomainApi.data,
        isCreating
      ),
    [userDetails, getUserRolesForDomainApi.data]
  );

  const usernameText = t('ui.common.username', 'Username');
  const firstNameText = t('ui.userEditor.firstName', 'First Name');
  const lastNameText = t('ui.userEditor.lastName', 'Last Name');
  const emailText = t('ui.userEditor.emailAddress', 'Email Address');
  const companyNameText = t('ui.userEditor.companyName', 'Company Name');
  const applicationTimeoutText = t(
    'ui.userEditor.applicationTimeout',
    'Application Timeout'
  );
  const newPasswordText = t('ui.userEditor.newPassword', 'New Password');
  const confirmPasswordText = t(
    'ui.changepassword.confirmpassword',
    'Confirm Password'
  );
  const userTypeText = t('ui.userEditor.type', 'Type');

  const isPasswordRequired = isCreating;

  const validationSchema = buildValidationSchema(t, isPasswordRequired, {
    usernameText,
    firstNameText,
    lastNameText,
    emailText,
    companyNameText,
    userTypeText,
    applicationTimeoutText,
    newPasswordText,
    confirmPasswordText,
  });

  const isFetching =
    editUserApi.isFetching ||
    getAssetGroupsForDomainApi.isFetching ||
    getUserRolesForDomainApi.isFetching;
  const editUserDataError =
    editUserApi.isError ||
    getAssetGroupsForDomainApi.isError ||
    getUserRolesForDomainApi.isError;

  // Prevent the form from being rendered until we get all the necessary data
  // so Formik doesn't reinitialize the form (via enableReinitialize)
  // incorrectly
  if (isFetching || editUserDataError) {
    return (
      <>
        <PageIntroWrapper sticky {...(isInlineForm && { topOffset: 0 })}>
          <PageIntro
            isCreating={isCreating}
            refetchEditData={refetchEditData}
            headerNavButton={<BackIconButton />}
            isInlineForm={isInlineForm}
          />
        </PageIntroWrapper>

        <Box mt={3}>
          <TransitionLoadingSpinner in={isFetching} />
          <TransitionErrorMessage in={!isFetching && editUserDataError} />
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
        const hasAtLeastOneDomainWithUserRole = !!values.domains.find(
          (domain) => isNumber(domain.applicationUserRoleId)
        );

        const isPasswordCheckNotNeeded =
          !isPasswordRequired &&
          (!values.newPassword || !values.confirmNewPassword);

        // Dont validate password if its not needed
        const errors: any = {};

        if (!hasAtLeastOneDomainWithUserRole) {
          errors.domains = t(
            'ui.userEditor.domainAndAssetGroupAccessErrorMessage',
            'User must be assigned a user role to a minimum of one domain'
          );
        }

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

        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {({
        values,
        isSubmitting,
        errors,
        resetForm,
        submitForm,
        setFieldValue,
      }) => {
        return (
          <>
            <PageIntroWrapper sticky {...(isInlineForm && { topOffset: 0 })}>
              <PageIntro
                isCreating={isCreating}
                isSubmitting={isSubmitting}
                isLoggedUser={isLoggedUser}
                submissionResult={submissionResult}
                submissionError={submissionError}
                refetchEditData={refetchEditData}
                submitForm={submitForm}
                resetForm={resetForm}
                headerNavButton={<BackIconButton />}
                saveCallback={saveCallback}
                saveAndExitCallback={saveAndExitCallback}
                isInlineForm={isInlineForm}
              />
            </PageIntroWrapper>

            <Box mt={3}>
              <TransitionLoadingSpinner in={isFetching} />
              <TransitionErrorMessage in={!isFetching && editUserDataError} />

              <Fade in={!isFetching && !editUserDataError}>
                <div>
                  {!isFetching && !editUserDataError && (
                    <Grid
                      container
                      spacing={2}
                      direction="column"
                      justify="space-between"
                    >
                      <Grid item xs={12}>
                        <ObjectForm
                          domainSuffix={domainSuffix}
                          domainsWithAssetGroups={
                            getAssetGroupsForDomainApi.data
                          }
                          domainsWithUserRoles={getUserRolesForDomainApi.data}
                          values={values}
                          assetGroupIdToNameMapping={assetGroupIdToNameMapping}
                          setFieldValue={setFieldValue}
                          domainsError={errors.domains}
                          isSubmitting={isSubmitting}
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

export default UserEditor;

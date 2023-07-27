import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  DomainAssetGroupsDTO,
  DomainUserRolesDTO,
  UserDto,
  UserPermissionType,
} from 'api/admin/api';
import routes from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { Formik, FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { useSelector } from 'react-redux';
import { generatePath, useHistory, useParams } from 'react-router';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import { AccessType } from 'types';
import { isNumber } from 'utils/format/numbers';
import ObjectForm from './components/ObjectForm';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './components/ObjectForm/helpers';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';
import { useUpdateUserDomainRolesAndAssetGroups } from './hooks/updateUserDomainRolesAndAssetGroups';
import { AssetGroupIdToNameMapping } from './types';

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

const UserEditorSingleSignOn = ({
  editUserApi,
  getAssetGroupsForDomainApi,
  getUserRolesForDomainApi,
  isInlineForm,
  refetchBaseEditData,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams<RouteParams>();
  const editingUserId = params.userId;
  const isCreating = !editingUserId;

  const hasPermission = useSelector(selectHasPermission);
  const canUpdateUser = hasPermission(
    UserPermissionType.UserGeneral,
    AccessType.Update
  );

  // Edit User Api
  const userDetails = editUserApi.data;

  // Update/Save User Api
  const updateUserDomainRolesAndAssetGroupsApi = useUpdateUserDomainRolesAndAssetGroups();
  const submissionResult = updateUserDomainRolesAndAssetGroupsApi.data;
  const submissionError = updateUserDomainRolesAndAssetGroupsApi.error;

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
    updateUserDomainRolesAndAssetGroupsApi.reset();
    refetchBaseEditData();
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateUserDomainRolesAndAssetGroupsApi.reset();
    const formattedValuesForApi = formatValuesForApi(
      values,
      userDetails?.id || ''
    );
    return updateUserDomainRolesAndAssetGroupsApi
      .mutateAsync(formattedValuesForApi)
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
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
    () => formatInitialValues(userDetails, getUserRolesForDomainApi.data),
    [userDetails, getUserRolesForDomainApi.data]
  );

  const isFetching =
    // We use isLoading instead of isFetching so the user details are updated
    // in place when editing them via the EditUserDrawer. Otherwise, the form's
    // content will be unmounted and replaced with a loading spinner, then
    // re-mounted again.
    editUserApi.isLoading ||
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
      validate={(values) => {
        const hasAtLeastOneDomainWithUserRole = !!values.domains.find(
          (domain) => isNumber(domain.applicationUserRoleId)
        );

        const errors: any = {};

        if (!hasAtLeastOneDomainWithUserRole) {
          errors.domains = t(
            'ui.userEditor.domainAndAssetGroupAccessErrorMessage',
            'User must be assigned a user role to a minimum of one domain'
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
                          domainsWithAssetGroups={
                            getAssetGroupsForDomainApi.data
                          }
                          domainsWithUserRoles={getUserRolesForDomainApi.data}
                          values={values}
                          assetGroupIdToNameMapping={assetGroupIdToNameMapping}
                          setFieldValue={setFieldValue}
                          domainsError={errors.domains}
                          isSubmitting={isSubmitting}
                          canUpdateUser={canUpdateUser}
                          userDetails={userDetails}
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

export default UserEditorSingleSignOn;

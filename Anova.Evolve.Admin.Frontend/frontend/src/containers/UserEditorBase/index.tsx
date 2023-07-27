/* eslint-disable indent, react/jsx-indent */
import Box from '@material-ui/core/Box';
import BackIconButton from 'components/buttons/BackIconButton';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import UserEditor from 'containers/UserEditor';
import PageIntro from 'containers/UserEditor/components/PageIntro';
import UserEditorSingleSignOn from 'containers/UserEditorSingleSignOn';
import LastUpdatedInfo from 'components/LastUpdatedInfo';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { useGetAssetGroupsForDomain } from './hooks/useGetAssetGroupsForDomain';
import { useGetUserByUserId } from './hooks/useGetUserByUserId';
import { useGetUserRolesForDomain } from './hooks/useGetUserRolesForDomain';

interface RouteParams {
  userId?: string;
}

interface Props {
  isInlineForm?: boolean;
}

const UserEditorBase = ({ isInlineForm }: Props) => {
  const params = useParams<RouteParams>();
  const editingUserId = params.userId;
  const isCreating = !editingUserId;

  const activeDomain = useSelector(selectActiveDomain);

  // Edit User Api
  const editUserApi = useGetUserByUserId(editingUserId);
  const domainIdForUser = editUserApi.data?.domainId || activeDomain?.domainId;

  // Asset Groups + User roles API
  const getAssetGroupsForDomainApi = useGetAssetGroupsForDomain(
    domainIdForUser
  );
  const getUserRolesForDomainApi = useGetUserRolesForDomain(domainIdForUser);

  const fetchEditData = useCallback(() => {
    editUserApi.refetch();
  }, [editingUserId]);

  useEffect(() => {
    fetchEditData();
  }, [fetchEditData]);

  const refetchBaseEditData = () => {
    getAssetGroupsForDomainApi.refetch();
    getUserRolesForDomainApi.refetch();
    fetchEditData();
  };

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
            refetchEditData={refetchBaseEditData}
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
    <>
      {editUserApi.data?.isLocalAadB2cAccount ||
      editUserApi.data?.isUsingAadB2cForIdentity ? (
        <UserEditorSingleSignOn
          editUserApi={editUserApi}
          getAssetGroupsForDomainApi={getAssetGroupsForDomainApi}
          getUserRolesForDomainApi={getUserRolesForDomainApi}
          refetchBaseEditData={refetchBaseEditData}
        />
      ) : (
        <UserEditor
          editUserApi={editUserApi}
          getAssetGroupsForDomainApi={getAssetGroupsForDomainApi}
          getUserRolesForDomainApi={getUserRolesForDomainApi}
          refetchBaseEditData={refetchBaseEditData}
        />
      )}
      <LastUpdatedInfo
        lastUpdatedDate={editUserApi.data?.lastUpdatedDate}
        lastUpdateUsername={editUserApi.data?.lastUpdateUsername}
      />
    </>
  );
};

export default UserEditorBase;

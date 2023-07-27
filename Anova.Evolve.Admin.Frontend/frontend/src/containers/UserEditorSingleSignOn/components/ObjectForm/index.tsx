import Grid from '@material-ui/core/Grid';
import {
  DomainAssetGroupsDTO,
  DomainUserRolesDTO,
  UserDto,
} from 'api/admin/api';
import DomainAndAssetGroupAccessFields from 'containers/UserEditorBase/components/DomainAndAssetGroupAccessFields';
import FormEffect from 'containers/UserEditorBase/components/FormEffect';
import { AssetGroupIdToNameMapping } from 'containers/UserEditorBase/types';
import { Form, FormikProps } from 'formik';
import React from 'react';
import UserDetailsPanel from '../UserDetailsPanel';
import { DomainsError, Values } from './types';

interface Props {
  domainsWithAssetGroups?: DomainAssetGroupsDTO[];
  domainsWithUserRoles?: DomainUserRolesDTO[];
  values: Values;
  isSubmitting?: boolean;
  assetGroupIdToNameMapping?: AssetGroupIdToNameMapping;
  domainsError?: DomainsError;
  canUpdateUser?: boolean;
  userDetails?: UserDto | null;
  setFieldValue: FormikProps<Values>['setFieldValue'];
}

const ObjectForm = ({
  domainsWithAssetGroups,
  domainsWithUserRoles,
  values,
  assetGroupIdToNameMapping,
  domainsError,
  canUpdateUser,
  userDetails,
  setFieldValue,
}: Props) => {
  return (
    <Form>
      <FormEffect values={values} setFieldValue={setFieldValue} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UserDetailsPanel
            canUpdateUser={canUpdateUser}
            userDetails={userDetails}
          />
        </Grid>

        <Grid item xs={12}>
          <DomainAndAssetGroupAccessFields
            domainsWithAssetGroups={domainsWithAssetGroups}
            domainsWithUserRoles={domainsWithUserRoles}
            defaultDomainId={values.defaultDomainId}
            domainsValue={values.domains}
            assetGroupIdToNameMapping={assetGroupIdToNameMapping}
            setFieldValue={setFieldValue}
            domainsError={domainsError}
          />
        </Grid>
      </Grid>
    </Form>
  );
};

export default ObjectForm;

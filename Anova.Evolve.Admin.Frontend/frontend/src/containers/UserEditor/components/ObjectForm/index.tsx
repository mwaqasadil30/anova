import Grid from '@material-ui/core/Grid';
import {
  DomainAssetGroupsDTO,
  DomainUserRolesDTO,
  UserType,
} from 'api/admin/api';
import DomainAndAssetGroupAccessFields from 'containers/UserEditorBase/components/DomainAndAssetGroupAccessFields';
import FormEffect from 'containers/UserEditorBase/components/FormEffect';
import { AssetGroupIdToNameMapping } from 'containers/UserEditorBase/types';
import { Form, FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { buildUserTypeTextMapping } from 'utils/i18n/enum-to-text';
import ContactInformationFields from './ContactInformationFields';
import PasswordUpdateFields from './PasswordUpdateFields';
import { DomainsError, Values } from './types';
import UserDetailsFields from './UserDetailsFields';

interface Props {
  domainSuffix?: string;
  domainsWithAssetGroups?: DomainAssetGroupsDTO[];
  domainsWithUserRoles?: DomainUserRolesDTO[];
  values: Values;
  isSubmitting?: boolean;
  assetGroupIdToNameMapping?: AssetGroupIdToNameMapping;
  domainsError?: DomainsError;
  setFieldValue: FormikProps<Values>['setFieldValue'];
}

const ObjectForm = ({
  domainSuffix,
  domainsWithAssetGroups,
  domainsWithUserRoles,
  values,
  isSubmitting,
  assetGroupIdToNameMapping,
  domainsError,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();
  const userTypeTextMapping = buildUserTypeTextMapping(t);

  const userTypeOptions = [
    { label: userTypeTextMapping[UserType.WebUser], value: UserType.WebUser },
    {
      label: userTypeTextMapping[UserType.WebServiceUser],
      value: UserType.WebServiceUser,
    },
    {
      label: userTypeTextMapping[UserType.WebUserAndWebServiceUser],
      value: UserType.WebUserAndWebServiceUser,
    },
    { label: userTypeTextMapping[UserType.FTPUser], value: UserType.FTPUser },
  ];

  const usernameText = t('ui.common.username', 'Username');
  const firstNameText = t('ui.userEditor.firstName', 'First Name');
  const lastNameText = t('ui.userEditor.lastName', 'Last Name');
  const emailText = t('ui.userEditor.emailAddress', 'Email Address');
  const companyNameText = t('ui.userEditor.companyName', 'Company Name');
  const applicationTimeoutText = t(
    'ui.userEditor.applicationTimeout',
    'Application Timeout'
  );

  return (
    <Form>
      <FormEffect values={values} setFieldValue={setFieldValue} />
      <Grid container spacing={3}>
        {/*
                The designs want to limit the max width of the fields on
                large displays so we use the Grid to limit the width of the
                full container
              */}
        <Grid item xs={12} xl={9}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={6} style={{ display: 'flex' }}>
              <UserDetailsFields
                userTypeOptions={userTypeOptions}
                usernameText={usernameText}
                firstNameText={firstNameText}
                lastNameText={lastNameText}
                companyNameText={companyNameText}
                domainSuffix={domainSuffix}
                applicationTimeoutText={applicationTimeoutText}
                isSubmitting={isSubmitting}
              />
            </Grid>

            <Grid item xs={12} md={6} style={{ display: 'flex' }}>
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    flexWrap: 'nowrap',
                  }}
                >
                  <ContactInformationFields emailText={emailText} />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    flexWrap: 'nowrap',
                  }}
                >
                  <PasswordUpdateFields newPasswordValue={values.newPassword} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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

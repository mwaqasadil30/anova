import Grid from '@material-ui/core/Grid';
import { Form } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PasswordUpdateFields from './PasswordUpdateFields';
import PersonalInformationFields from './PersonalInformationFields';
import { Values } from './types';

interface Props {
  values: Values;
  userName?: string | null;
  isUsing3rdPartyIdentityProvider?: boolean;
}

const ObjectForm = ({
  values,
  userName,
  isUsing3rdPartyIdentityProvider,
}: Props) => {
  const { t } = useTranslation();

  const firstNameText = t('ui.userEditor.firstName', 'First Name');
  const lastNameText = t('ui.userEditor.lastName', 'Last Name');
  const emailText = t('ui.userEditor.emailAddress', 'Email Address');

  return (
    <Form>
      <Grid container spacing={3}>
        {/*
          The designs want to limit the max width of the fields on
          large displays so we use the Grid to limit the width of the
          full container
        */}
        <Grid item xs={12} xl={9}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={6} style={{ display: 'flex' }}>
              <PersonalInformationFields
                firstNameText={firstNameText}
                lastNameText={lastNameText}
                emailText={emailText}
                userName={userName}
                isUsing3rdPartyIdentityProvider={
                  isUsing3rdPartyIdentityProvider
                }
              />
            </Grid>

            {!isUsing3rdPartyIdentityProvider && (
              <Grid
                item
                xs={12}
                md={6}
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  flexWrap: 'nowrap',
                }}
              >
                <PasswordUpdateFields newPasswordValue={values.newPassword} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
};

export default ObjectForm;

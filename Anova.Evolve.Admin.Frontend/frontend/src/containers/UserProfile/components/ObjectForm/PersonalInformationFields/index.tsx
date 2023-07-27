import Grid from '@material-ui/core/Grid';
import EditorBox from 'components/EditorBox';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import PageSubHeader from 'components/PageSubHeader';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  firstNameText: string;
  lastNameText: string;
  emailText: string;
  userName?: string | null;
  isUsing3rdPartyIdentityProvider?: boolean;
}

const PersonalInformationFields = ({
  firstNameText,
  lastNameText,
  emailText,
  userName,
  isUsing3rdPartyIdentityProvider,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Grid
      container
      spacing={2}
      alignItems="stretch"
      style={{
        flexDirection: 'column',
        flexWrap: 'nowrap',
      }}
    >
      <Grid item xs={12} style={{ flex: '1 0 auto' }}>
        <PageSubHeader dense>
          {t('ui.userProfile.personalInformation', 'Personal Information')}
        </PageSubHeader>
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
        <EditorBox width="100%">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Field
                component={CustomTextField}
                name="firstName"
                label={firstNameText}
                required
                // NOTE: Temporarily disabled as the save user api does not
                // include these properties to be edited
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CustomTextField}
                name="lastName"
                label={lastNameText}
                required
                // NOTE: Temporarily disabled as the save user api does not
                // include these properties to be edited
                disabled
              />
            </Grid>
            {!isUsing3rdPartyIdentityProvider && (
              <Grid item xs={12}>
                <StyledTextField
                  value={userName}
                  label={t('ui.common.username', 'Username')}
                  disabled
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Field
                component={CustomTextField}
                name="emailAddress"
                label={emailText}
                required
                disabled={isUsing3rdPartyIdentityProvider}
              />
            </Grid>
          </Grid>
        </EditorBox>
      </Grid>
    </Grid>
  );
};

export default PersonalInformationFields;

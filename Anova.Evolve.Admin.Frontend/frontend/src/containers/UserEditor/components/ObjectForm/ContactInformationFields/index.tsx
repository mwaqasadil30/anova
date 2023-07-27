import Grid from '@material-ui/core/Grid';
import EditorBox from 'components/EditorBox';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import PageSubHeader from 'components/PageSubHeader';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  emailText: string;
}

const ContactInformationFields = ({ emailText }: Props) => {
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
          {t('ui.userEditor.contactInformation', 'Contact Information')}
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
                name="emailAddress"
                label={emailText}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                component={CustomTextField}
                name="mobilePhoneNumber"
                label={t('ui.userEditor.mobilePhone', 'Mobile Phone')}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                component={CustomTextField}
                name="workPhoneNumber"
                label={t('ui.userEditor.officePhone', 'Office Phone')}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CustomTextField}
                name="emailToSmsaddress"
                label={t('ui.userEditor.emailToSmsaddress', 'Email to Phone')}
              />
            </Grid>
            {/*
              NOTE: These fields are removed for now, but are still sent via
              the API, the user just can't change them
            */}

            {/* <Grid item xs={6}>
              <Field
                component={CustomTextField}
                name="faxNumber"
                label={t('ui.userEditor.fax', 'Fax')}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                component={CustomTextField}
                name="smsNumber"
                label={t('ui.userEditor.sms', 'SMS')}
              />
            </Grid> */}
          </Grid>
        </EditorBox>
      </Grid>
    </Grid>
  );
};

export default ContactInformationFields;

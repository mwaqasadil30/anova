import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import PageSubHeader from 'components/PageSubHeader';
import { Field } from 'formik';

const NoteTab = () => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PageSubHeader dense>
          {t('ui.domainEditor.domainNote', 'Domain Setup Notes')}
        </PageSubHeader>
      </Grid>
      <Grid item xs={12}>
        <Field
          id="domainNotes-textarea"
          component="textarea"
          name="domainNotes"
          style={{ width: '100%', height: '400px' }}
          required
        />
      </Grid>
    </Grid>
  );
};

export default NoteTab;

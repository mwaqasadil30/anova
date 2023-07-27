import { EditSite } from 'api/admin/api';
import { FormikProps } from 'formik';
import { useEffect } from 'react';

interface Props {
  fetchedSiteDetails?: EditSite | null;
  setFieldValue: FormikProps<{}>['setFieldValue'];
}

const FormEffect = ({ fetchedSiteDetails, setFieldValue }: Props) => {
  // Update the site notes field to match the newly fetched site details. We
  // need to do this since the sites from the SiteAutocomplete API call
  // dont include site notes.
  useEffect(() => {
    setFieldValue('siteNotes', fetchedSiteDetails?.notes || '');
  }, [fetchedSiteDetails]);

  return null;
};

export default FormEffect;

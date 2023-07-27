import Alert, { AlertProps } from 'components/Alert';
import React from 'react';

// If we need to customize the form-specific alert that appears on the page
// intro, make the changes here

const FormErrorAlert = (props: AlertProps) => {
  return <Alert severity="error" variant="filled" {...props} />;
};

export default FormErrorAlert;

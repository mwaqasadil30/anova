import { connect, FormikContextType } from 'formik';
import { useEffect } from 'react';
import { Values } from '../ObjectForm/types';

interface FormChangeEffectProps {
  formik: FormikContextType<Values>;
}

const FormChangeEffect = ({ formik }: FormChangeEffectProps) => {
  const { deviceId } = formik.values;

  // Reset selected diagnostic channels when changing the device ID
  useEffect(() => {
    formik.setFieldValue('diagnosticChannel', []);
  }, [deviceId]);

  return null;
};

const ConnectedFormikEffect = connect<{}, any>(FormChangeEffect);

export default ConnectedFormikEffect;

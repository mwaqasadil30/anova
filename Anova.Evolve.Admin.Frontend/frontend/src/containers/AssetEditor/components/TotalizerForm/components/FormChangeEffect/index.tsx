import { connect, FormikContextType } from 'formik';
import { useEffect } from 'react';
import { Values } from '../ObjectForm/types';

interface FormChangeEffectProps {
  formik: FormikContextType<Values>;
}

const FormChangeEffect = ({ formik }: FormChangeEffectProps) => {
  const { productId } = formik.values;

  // Reset selected level channels when changing the product
  useEffect(() => {
    formik.setFieldValue('levelChannels', []);
  }, [productId]);

  return null;
};

const ConnectedFormikEffect = connect<{}, any>(FormChangeEffect);

export default ConnectedFormikEffect;

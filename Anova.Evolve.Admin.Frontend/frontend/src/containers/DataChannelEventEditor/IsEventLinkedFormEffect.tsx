import { FormikProps } from 'formik';
import { useUpdateEffect } from 'react-use';

interface Props {
  isLinked?: boolean;
  isEnabledFieldName: string;
  setFieldValue: FormikProps<{}>['setFieldValue'];
}

const IsEventLinkedFormEffect = ({
  isLinked,
  isEnabledFieldName,
  setFieldValue,
}: Props) => {
  // Set the current event's isEnabled checkbox to false if the isLinked checkbox is checked
  useUpdateEffect(() => {
    if (isLinked) {
      setFieldValue(isEnabledFieldName, false);
    }
  }, [isLinked]);

  return null;
};

export default IsEventLinkedFormEffect;

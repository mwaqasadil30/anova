import { useEffect } from 'react';
import { connect } from 'formik';
import noop from 'lodash/noop';
import useDebounce from 'react-use/lib/useDebounce';
import usePrevious from 'react-use/lib/usePrevious';
import useTranslateFormErrors from 'hooks/useTranslateFormErrors';

function FormikEffect({
  onChange = noop,
  formik,
  restoreInitialValues,
  restoreTouchedFields,
}: any) {
  const values = formik?.values;
  const isValid = formik?.isValid;
  const touched = formik?.touched;
  const prevValues = usePrevious(values);

  // Dynamically update field validation error messages when the language
  // changes
  // TODO: Try to pass `FormikEffect<T>` type down to `useTranslateFormErrors`
  useTranslateFormErrors<any>(formik.errors, touched, formik.setFieldTouched);

  useEffect(() => {
    // If this is the first render and we have existing values to restore,
    // restore them
    if (!prevValues && restoreInitialValues) {
      formik.setValues({ ...restoreInitialValues });

      // Set all fields that were touched to show which aren't valid
      if (restoreTouchedFields) {
        // TODO: Without setTimeout, this doesn't seem to work.
        setTimeout(() => {
          formik.setTouched({ ...restoreTouchedFields });
          formik.submitForm();
        }, 0);
      }
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useDebounce(
    () => {
      // If we dont want to run this on form init, use if (prevValues) { onChange ... }
      // TODO: Might want to pass specific properties instead of the whole
      // formik object (it might get destroyed when the component unmounts?).
      // Example:
      // onChange({
      //   isValid: formik.isValid,
      //   touched: formik.touched,
      // });
      onChange(formik, formik.setValue, formik.isValid, touched);
    },
    500,
    [values, isValid, touched]
  );

  return null;
}

const ConnectedFormikEffect = connect(FormikEffect);

export default ConnectedFormikEffect;

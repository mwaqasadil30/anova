import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikErrors, FormikTouched, FormikHelpers } from 'formik';

// When change language is triggered, re-validate the form as to get all errors translated
// the parameters here are part of the FormikProps<Values> render props
// https://jaredpalmer.com/formik/docs/api/formik#formik-render-methods-and-props
const useTranslateFormErrors = <T>(
  errors: FormikErrors<T>,
  touched: FormikTouched<T>,
  setFieldTouched: FormikHelpers<T>['setFieldTouched']
) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.on('languageChanged', () => {
      Object.keys(errors).forEach((fieldName) => {
        if (Object.keys(touched).includes(fieldName)) {
          setFieldTouched(fieldName);
        }
      });
    });
    return () => {
      i18n.off('languageChanged', () => {});
    };
  }, [errors, i18n, setFieldTouched, touched]);
};

export default useTranslateFormErrors;

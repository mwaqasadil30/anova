import { FormikProps } from 'formik';
import { useEffect } from 'react';
import { usePrevious } from 'react-use';
import { DomainAndAssetGroupValues } from '../types';

interface Props {
  values: DomainAndAssetGroupValues;
  setFieldValue: FormikProps<DomainAndAssetGroupValues>['setFieldValue'];
}

const FormEffect = ({ values, setFieldValue }: Props) => {
  // Clear a domain's default asset group if the user removed the selected
  // default asset group from the list of selected asset groups (the
  // multi-select)
  const previousDomains = usePrevious(values.domains);
  useEffect(() => {
    if (previousDomains) {
      values.domains.forEach((domain, index) => {
        const associatedPreviousDomain = previousDomains?.[index];

        const defaultAssetGroupInSelectedAssetGroups = domain.assetGroupIds?.find(
          (assetGroupId) => assetGroupId === domain.defaultAssetGroupId
        );

        if (
          associatedPreviousDomain?.assetGroupIds?.length !==
            domain.assetGroupIds?.length &&
          !defaultAssetGroupInSelectedAssetGroups
        ) {
          const defaultAssetGroupFieldName = `domains.${index}.defaultAssetGroupId`;
          setFieldValue(defaultAssetGroupFieldName, '');
        }
      });
    }
  }, [values.domains]);

  return null;
};

export default FormEffect;

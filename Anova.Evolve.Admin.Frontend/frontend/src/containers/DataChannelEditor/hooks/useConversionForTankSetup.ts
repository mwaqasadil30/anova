import { UnitConversionModeEnum, UnitTypeEnum } from 'api/admin/api';
import { useGetConvertedVolumetricValue } from 'containers/DataChannelEditor/hooks/useGetConvertedVolumetricValue';
import { FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { isNumber } from 'utils/format/numbers';
import { Values } from '../components/ProfileTab/components/TankAndSensorConfigurationDrawer/types';

interface UseConversionForTankSetupInput {
  scaledUnitsId: string | UnitTypeEnum | undefined;
  values: Values;
  dataChannelId: string | null | undefined;
  fieldNameForConversion: keyof Values;
  fieldNameToUpdateAfterConversion: keyof Values;
  setFieldValue: FormikProps<Values>['setFieldValue'];
}

export const useConversionForTankSetup = ({
  scaledUnitsId,
  values,
  dataChannelId,
  fieldNameForConversion,
  fieldNameToUpdateAfterConversion,
  setFieldValue,
}: UseConversionForTankSetupInput) => {
  const [conversionRequest, setConversionRequest] = useState({});

  const convertVolumetricValueApi = useGetConvertedVolumetricValue(
    conversionRequest
  );

  // Set the request for the convertVolumetricValueApi only when the values.displayUnitsId changes
  // The reason for this was because react query doesnt have built in lazy queries
  // so whenever a user changes a parameter that is also in the api as an
  // argument (values[FIELD_NAME_HERE]) an api call would be made
  // for every keystroke/"change"
  useUpdateEffect(() => {
    if (
      isNumber(scaledUnitsId) &&
      values.unitConversionModeId === UnitConversionModeEnum.Volumetric
    ) {
      setConversionRequest({
        dataChannelId,
        fromUnitId: scaledUnitsId,
        toUnitId: values.displayUnitsId,
        value: values[fieldNameForConversion],
      });
    }
  }, [values.displayUnitsId]);

  // set new field value after using the conversion api
  useEffect(() => {
    if (isNumber(convertVolumetricValueApi.data)) {
      setFieldValue(
        // Update the original field with the scaled unit conversion value
        fieldNameToUpdateAfterConversion,
        convertVolumetricValueApi.data as number
      );
    }
  }, [convertVolumetricValueApi.data]);
};

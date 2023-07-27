import {
  DataChannelDisplayUnitDTO,
  DataChannelDisplayUnitsDTO,
  UnitConversionModeEnum,
} from 'api/admin/api';
// import { useConversionForTankSetup } from 'containers/DataChannelEditor/hooks/useConversionForTankSetup';
import { FormikProps } from 'formik';
import { useEffect } from 'react';
import { UseQueryResult } from 'react-query';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { Values } from './types';

interface Props {
  values: Values;
  dataChannelId?: string | null;
  displayUnitApi: UseQueryResult<DataChannelDisplayUnitsDTO, unknown>;
  setFieldValue: FormikProps<Values>['setFieldValue'];
  setDisplayUnitOptions: React.Dispatch<
    React.SetStateAction<DataChannelDisplayUnitDTO[]>
  >;
  setDisplayUnitRequest: React.Dispatch<
    React.SetStateAction<UnitConversionModeEnum | undefined>
  >;
}

const OldTankSetupInfoFormEffect = ({
  values,
  displayUnitApi,
  setFieldValue,
  setDisplayUnitOptions,
  setDisplayUnitRequest,
}: Props) => {
  // Set the request for displayUnitApi only when values.unitConversionModeId changes
  useEffect(() => {
    if (
      values.unitConversionModeId ===
        UnitConversionModeEnum.SimplifiedVolumetric ||
      values.unitConversionModeId === UnitConversionModeEnum.Volumetric
    ) {
      setDisplayUnitRequest(values.unitConversionModeId);
    }
  }, [values.unitConversionModeId]);

  // Set the display unit options once the displayUnitApi api succeeds
  useEffect(() => {
    if (displayUnitApi.data?.displayUnits) {
      setDisplayUnitOptions(displayUnitApi.data.displayUnits);
    }
  }, [displayUnitApi.data]);

  // Clear number fields (except Max Product Capacity)
  useUpdateEffect(() => {
    setFieldValue('displayMaxProductCapacity', '');
    setFieldValue('graphMin', '');
    setFieldValue('graphMax', '');
  }, [values.unitConversionModeId]);

  useUpdateEffect(() => {
    if (values.isTankProfileSet) {
      setFieldValue('unitConversionModeId', UnitConversionModeEnum.Volumetric);
    }

    if (!values.isTankProfileSet) {
      setFieldValue('unitConversionModeId', '');
      setFieldValue('tankTypeId', '');
    }
  }, [values.isTankProfileSet]);

  // const previousDisplayUnit = usePrevious(values.displayUnitsId);

  // useConversionForTankSetup({
  //   previousDisplayUnit,
  //   values,
  //   dataChannelId,
  //   fieldNameForConversion: 'displayMaxProductCapacity',
  //   setFieldValue,
  // });
  // useConversionForTankSetup({
  //   previousDisplayUnit,
  //   values,
  //   dataChannelId,
  //   fieldNameForConversion: 'graphMin',
  //   setFieldValue,
  // });
  // useConversionForTankSetup({
  //   previousDisplayUnit,
  //   values,
  //   dataChannelId,
  //   fieldNameForConversion: 'graphMax',
  //   setFieldValue,
  // });

  return null;
};

export default OldTankSetupInfoFormEffect;

import {
  DataChannelDisplayUnitDTO,
  DataChannelDisplayUnitsDTO,
  UnitConversionModeEnum,
} from 'api/admin/api';
import { useConversionForTankSetup } from 'containers/DataChannelEditor/hooks/useConversionForTankSetup';
import { FormikProps } from 'formik';
import { useEffect } from 'react';
import { UseQueryResult } from 'react-query';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { Values } from './types';

interface Props {
  values: Values;
  initialValues: Values;
  dataChannelId?: string | null;
  displayUnitApi: UseQueryResult<DataChannelDisplayUnitsDTO, unknown>;
  hasFormSubmitted: boolean;
  setFieldValue: FormikProps<Values>['setFieldValue'];
  setDisplayUnitOptions: React.Dispatch<
    React.SetStateAction<DataChannelDisplayUnitDTO[]>
  >;
  setDisplayUnitRequest: React.Dispatch<
    React.SetStateAction<UnitConversionModeEnum | undefined>
  >;
  openEventEditorWarningDialog: () => void;
}

const TankSetupInfoFormEffect = ({
  values,
  initialValues,
  dataChannelId,
  displayUnitApi,
  hasFormSubmitted,
  setFieldValue,
  setDisplayUnitOptions,
  setDisplayUnitRequest,
  openEventEditorWarningDialog,
}: Props) => {
  // Redirect user to the event editor if any of these values have been changed
  useEffect(() => {
    if (
      hasFormSubmitted &&
      (initialValues.tankTypeId !== values.tankTypeId ||
        initialValues.tankDimensionId !== values.tankDimensionId ||
        initialValues.productId !== values.productId ||
        initialValues.scalingModeId !== values.scalingModeId ||
        initialValues.rawUnitsAtScaleMin !== values.rawUnitsAtScaleMin ||
        initialValues.rawUnitsAtScaleMax !== values.rawUnitsAtScaleMax ||
        initialValues.scaledUnitsId !== values.scaledUnitsId ||
        initialValues.scaledMin !== values.scaledMin ||
        initialValues.scaledMax !== values.scaledMax ||
        initialValues.displayUnitsId !== values.displayUnitsId ||
        initialValues.displayMaxProductCapacity !==
          values.displayMaxProductCapacity ||
        initialValues.maxProductCapacity !== values.maxProductCapacity)
    ) {
      openEventEditorWarningDialog();
    }
  }, [
    hasFormSubmitted,
    values.tankTypeId,
    values.tankDimensionId,
    values.productId,
    values.scalingModeId,
    values.rawUnitsAtScaleMin,
    values.rawUnitsAtScaleMax,
    values.scaledUnitsId,
    values.scaledMin,
    values.scaledMax,
    values.displayUnitsId,
    values.displayMaxProductCapacity,
    values.maxProductCapacity,
  ]);

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

  const { scaledUnitsId } = values;

  useConversionForTankSetup({
    scaledUnitsId,
    values,
    dataChannelId,
    fieldNameForConversion: 'calculatedMaxProductHeight',
    fieldNameToUpdateAfterConversion: 'displayMaxProductCapacity',
    setFieldValue,
  });
  useConversionForTankSetup({
    scaledUnitsId,
    values,
    dataChannelId,
    fieldNameForConversion: 'graphMinInScaled',
    fieldNameToUpdateAfterConversion: 'graphMin',
    setFieldValue,
  });
  useConversionForTankSetup({
    scaledUnitsId,
    values,
    dataChannelId,
    fieldNameForConversion: 'graphMaxInScaled',
    fieldNameToUpdateAfterConversion: 'graphMax',
    setFieldValue,
  });
  useConversionForTankSetup({
    scaledUnitsId,
    values,
    dataChannelId,
    fieldNameForConversion: 'minFillThreshold',
    fieldNameToUpdateAfterConversion: 'displayMinFillThreshold',
    setFieldValue,
  });
  useConversionForTankSetup({
    scaledUnitsId,
    values,
    dataChannelId,
    fieldNameForConversion: 'maxTruckCapacity',
    fieldNameToUpdateAfterConversion: 'displayMaxTruckCapacity',
    setFieldValue,
  });

  return null;
};

export default TankSetupInfoFormEffect;

/* eslint-disable indent */
import {
  DataChannelSensorInfoDTO,
  ScalingModeTypeEnum,
  SensorCalibrationInfoDTO,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { Values } from './types';

export const formatInitialValues = (
  sensorCalibration?: SensorCalibrationInfoDTO | null
): Values => {
  const isLinearScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Linear;

  const isPrescaledScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Prescaled;

  const isMappedScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Mapped;

  // #region limitsRawParams for Linear and Prescaled Sensor Modes
  const limitsRawParams = isLinearScalingMode
    ? sensorCalibration?.linearSensorCalibrationInfo?.limitsRawParams
    : isPrescaledScalingMode
    ? sensorCalibration?.prescaledSensorCalibrationInfo?.limitsRawParams
    : null;

  const hasLimits = limitsRawParams?.useLimits || false;
  const rawUnitsAtUnderRange = isNumber(limitsRawParams?.rawUnitsAtUnderRange)
    ? limitsRawParams?.rawUnitsAtUnderRange!
    : '';
  const rawUnitsAtOverRange = isNumber(limitsRawParams?.rawUnitsAtOverRange)
    ? limitsRawParams?.rawUnitsAtOverRange!
    : '';
  // #endregion limitsRawParams for Linear and Prescaled Sensor Modes

  // #region prescalingRawParams for Linear and Mapped Sensor Modes (Prescaling-related Fields)
  const prescalingRawParams = isLinearScalingMode
    ? sensorCalibration?.linearSensorCalibrationInfo?.prescalingRawParams
    : isMappedScalingMode
    ? sensorCalibration?.mappedSensorCalibrationInfo?.prescalingRawParams
    : null;

  const hasPrescaling = prescalingRawParams?.usePrescaling || false;
  const rawUnitsAtZero = isNumber(prescalingRawParams?.rawUnitsAtZero)
    ? prescalingRawParams?.rawUnitsAtZero!
    : '';
  const rawUnitsAtFullScale = isNumber(prescalingRawParams?.rawUnitsAtFullScale)
    ? prescalingRawParams?.rawUnitsAtFullScale!
    : '';
  // #endregion prescalingRawParams for Linear and Mapped Sensor Modes (Prescaling-related Fields)

  // #region rawParams for Linear and Mapped Sensor Modes (Raw Units (Min/Max)-related Fields)
  const rawParams = isLinearScalingMode
    ? sensorCalibration?.linearSensorCalibrationInfo?.rawParams
    : isMappedScalingMode
    ? sensorCalibration?.mappedSensorCalibrationInfo?.rawParams
    : null;

  const rawUnits = ''; // NOTE: This will eventually be removed, as it isnt used/needed
  const rawUnitsAsText = rawParams?.rawUnitsAsText
    ? rawParams?.rawUnitsAsText!
    : '';
  const rawUnitsAtScaleMin = isNumber(rawParams?.rawUnitsAtScaleMin)
    ? rawParams?.rawUnitsAtScaleMin!
    : '';
  const rawUnitsAtScaleMax = isNumber(rawParams?.rawUnitsAtScaleMax)
    ? rawParams?.rawUnitsAtScaleMax!
    : '';
  const isRawDataInverted = rawParams?.isRawDataInverted || false;
  // #endregion rawParams for Linear and Mapped Sensor Modes (Raw Units (Min/Max)-related Fields)

  // NOTE: use formattedScalingdMap for testing only
  // const formattedScalingdMap = [];
  // for (let index = 0; index < 20; index += 1) {
  //   if (
  //     !sensorCalibration?.mappedSensorCalibrationInfo?.scalingdMap ||
  //     !sensorCalibration?.mappedSensorCalibrationInfo?.scalingdMap[index]
  //   ) {
  //     formattedScalingdMap.push(ValueTupleOfDoubleAndDouble.fromJS({}));
  //     // formattedScalingdMap.push();
  //   } else {
  //     formattedScalingdMap.push(
  //       sensorCalibration?.mappedSensorCalibrationInfo?.scalingdMap[index]
  //     );
  //   }
  // }

  return {
    scalingModeId: sensorCalibration?.scalingModeId || '',
    scaledUnitsId: sensorCalibration?.scaledUnitsId || '',
    scaledUnitsAsText: sensorCalibration?.scaledUnitsAsText || '',
    scaledMin: isNumber(sensorCalibration?.scaledMin)
      ? sensorCalibration?.scaledMin!
      : '',
    scaledMax: isNumber(sensorCalibration?.scaledMax)
      ? sensorCalibration?.scaledMax!
      : '',
    // Linear Sensor Mode
    sensorPosition: isNumber(
      sensorCalibration?.linearSensorCalibrationInfo?.sensorPosition
    )
      ? sensorCalibration?.linearSensorCalibrationInfo?.sensorPosition!
      : '',

    // Mapped Sensor Mode
    scalingdMap:
      sensorCalibration?.mappedSensorCalibrationInfo?.scalingdMap || null,
    // scalingdMap: [
    //   { item1: 1.8245234, item2: 212314.5132 },
    //   { item1: 11.5234, item2: 314.132 },
    //   { item1: 1.34, item2: 14.132 },
    //   { item1: 1.23 },
    //   { item1: 1.834, item2: 4.2 },
    // ].map((item) => ValueTupleOfDoubleAndDouble.fromJS(item)),

    // Prescaled & Linear Sensor Modes
    useLimits: hasLimits,
    rawUnitsAtUnderRange, // Low Limit (Advanced Settings)
    rawUnitsAtOverRange, // High Limit (Advanced Settings)

    // Linear & Mapped Sensor Modes (Prescaling-related fields)
    usePrescaling: hasPrescaling,
    rawUnitsAtZero, // Zero Scale (Advanced Settings)
    rawUnitsAtFullScale, // Full Scale (Advanced Settings)

    // Linear & Mapped Sensor Modes (Raw units (min/max) fields)
    rawUnits, // NOTE: We dont use rawUnits at all anymore
    rawUnitsAsText,
    rawUnitsAtScaleMin, // Raw Min
    rawUnitsAtScaleMax, // Raw Max
    isRawDataInverted,
  };
};

export const formatValuesForApi = (
  values: Values
): DataChannelSensorInfoDTO => {
  return {
    scalingModeId: values?.scalingModeId || undefined,
    scaledUnitsId: isNumber(values.scaledUnitsId)
      ? values.scaledUnitsId
      : undefined,
    scaledUnitsAsText: values.scaledUnitsAsText || '',
    scaledMin: isNumber(values.scaledMin) ? values.scaledMin : '',
    scaledMax: isNumber(values.scaledMax) ? values.scaledMax : '',
    // NOTE/TODO: Back-end currently doesnt have the sensorPosition property
    // sensorPosition: values.sensorPosition || '',
    useLimits: values.useLimits || false,
    rawUnitsAtUnderRange: isNumber(values.rawUnitsAtUnderRange)
      ? values.rawUnitsAtUnderRange
      : '',
    rawUnitsAtOverRange: isNumber(values.rawUnitsAtOverRange)
      ? values.rawUnitsAtOverRange
      : '',
    usePrescaling: values.usePrescaling || false,
    rawUnitsAtZero: isNumber(values.rawUnitsAtZero)
      ? values.rawUnitsAtZero
      : '',
    rawUnitsAtFullScale: isNumber(values.rawUnitsAtFullScale)
      ? values.rawUnitsAtFullScale
      : '',
    scalingdMap: values.scalingdMap || undefined, // Mapped scaling mode only
    rawUnits: values.rawUnits || undefined, // NOTE: We dont use rawUnits at all anymore
    rawUnitsAsText: values.rawUnitsAsText || '',
    rawUnitsAtScaleMin: isNumber(values.rawUnitsAtScaleMin)
      ? values.rawUnitsAtScaleMin
      : '',
    rawUnitsAtScaleMax: isNumber(values.rawUnitsAtScaleMax)
      ? values.rawUnitsAtScaleMax
      : '',
    isRawDataInverted: values.isRawDataInverted || false,
  } as DataChannelSensorInfoDTO;
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return formatApiErrors(t, errors);
  }

  return errors;
};

/* eslint-disable indent */
import {
  DataChannelReportDTO,
  DataChannelTankAndSensorConfigDTO,
  ScalingModeTypeEnum,
  TankSetupInfoDTO,
  UnitConversionModeEnum,
  ValueTupleOfDoubleAndDouble,
  RtuPriorityLevelTypeEnum,
  RtuChannelSetpointsSyncTypeEnum,
} from 'api/admin/api';
import { ValueTupleOfDoubleAndDoubleWithKey } from 'apps/ops/types';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { fieldValueOrEmpty } from 'utils/forms/values';
import * as Yup from 'yup';
import { GenerateFunctionType, Values } from './types';

const sortMappedTableRawValues = (
  scalingdMap: ValueTupleOfDoubleAndDouble[]
) => {
  const scalingValuesToSort = scalingdMap || [];
  const sortedScalings = [...scalingValuesToSort].sort(
    (a, b) => (a.item1 || 0) - (b.item1 || 0)
  );

  return sortedScalings;
};

function emptyStringToNull(value: any, originalValue: any) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return null;
  }
  return value;
}

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const fieldIsRequired = (field: string) =>
    t('validate.common.isrequired', '{{field}} is required.', { field });
  const fieldMinimum = (field: string, minimum: number) =>
    t(
      'validate.common.numberMinimumValue',
      '{{field}} must be greater than or equal to {{minimum}}.',
      { field, minimum }
    );

  const rawValueRequired = t(
    'validate.mappedScalingMode.correspondingRawValueRequired',
    'The corresponding raw value is also required'
  );
  const scaledValueRequired = t(
    'validate.mappedScalingMode.correspondingScaledValueRequired',
    'The corresponding scaled value is also required'
  );

  return Yup.object().shape({
    scalingdMap: Yup.array().of(
      Yup.object().shape({
        item1: Yup.number()
          .typeError(rawValueRequired)
          .min(0, fieldMinimum(translationTexts.rawUnitsText, 0))
          .transform(emptyStringToNull)
          .nullable()
          .test('item2-is-set', scaledValueRequired, function isValid(item) {
            const isItem1Set = item || item === 0;
            const isItem2Set = this.parent.item2 || this.parent.item2 === 0;

            if (
              (isItem1Set && isItem2Set) ||
              (!isItem1Set && !isItem2Set) ||
              (!isItem1Set && isItem2Set)
            ) {
              return true;
            }

            return false;
          }),
        item2: Yup.number()
          .typeError(fieldIsRequired(translationTexts.scaledUnitsText))
          .min(0, fieldMinimum(translationTexts.scaledUnitsText, 0))
          .transform(emptyStringToNull)
          .nullable()
          .test('item1-is-set', rawValueRequired, function isValid(item) {
            const isItem1Set = this.parent.item1 || this.parent.item1 === 0;
            const isItem2Set = item || item === 0;

            if (
              (isItem1Set && isItem2Set) ||
              (!isItem1Set && !isItem2Set) ||
              (isItem1Set && !isItem2Set)
            ) {
              return true;
            }

            return false;
          }),
      })
    ),
  });
};

const getDisplayUnitsValue = (
  tankSetupInfo: TankSetupInfoDTO | null | undefined
): Values['displayUnitsId'] => {
  if (!tankSetupInfo) {
    return '';
  }

  const isSimplifiedVolumetricTank =
    tankSetupInfo?.unitConversionModeId ===
    UnitConversionModeEnum.SimplifiedVolumetric;
  const isVolumetricTank =
    tankSetupInfo?.unitConversionModeId === UnitConversionModeEnum.Volumetric;

  if (
    isSimplifiedVolumetricTank &&
    isNumber(tankSetupInfo?.simplifiedTankSetupInfo?.displayUnitsId)
  ) {
    return tankSetupInfo.simplifiedTankSetupInfo!.displayUnitsId!;
  }

  if (
    isVolumetricTank &&
    isNumber(tankSetupInfo?.volumetricTankSetupInfo?.displayUnitsId)
  ) {
    return tankSetupInfo.volumetricTankSetupInfo!.displayUnitsId!;
  }

  return '';
};

export const formatInitialValues = (
  dataChannelDetails?: DataChannelReportDTO | null
  // TODO: Remove any type after api is implemented
): Values => {
  const sensorCalibration = dataChannelDetails?.sensorCalibration;
  const tankSetupInfo = dataChannelDetails?.tankSetupInfo;
  const forecastDeliveryInfo = dataChannelDetails?.forecastDeliveryInfo;

  // #region Tank Setup-related info from TankSetupDrawer helpers.tsx file
  const isBasicTank =
    tankSetupInfo?.unitConversionModeId === UnitConversionModeEnum.Basic;
  const isSimplifiedVolumetricTank =
    tankSetupInfo?.unitConversionModeId ===
    UnitConversionModeEnum.SimplifiedVolumetric;
  const isVolumetricTank =
    tankSetupInfo?.unitConversionModeId === UnitConversionModeEnum.Volumetric;

  const basicOrSimplifiedVolumetricMaxProductHeight =
    isBasicTank && isNumber(tankSetupInfo?.basicTankSetupInfo?.maxProductHeight)
      ? tankSetupInfo?.basicTankSetupInfo?.maxProductHeight
      : isSimplifiedVolumetricTank &&
        isNumber(tankSetupInfo?.simplifiedTankSetupInfo?.maxProductHeight)
      ? tankSetupInfo?.simplifiedTankSetupInfo?.maxProductHeight
      : '';

  const simplifiedVolumetricOrVolumetricDisplayMaxProductHeight =
    isSimplifiedVolumetricTank &&
    isNumber(tankSetupInfo?.simplifiedTankSetupInfo?.displayMaxProductHeight)
      ? tankSetupInfo?.simplifiedTankSetupInfo?.displayMaxProductHeight
      : isVolumetricTank &&
        isNumber(
          tankSetupInfo?.volumetricTankSetupInfo?.displayMaxProductHeight
        )
      ? tankSetupInfo?.volumetricTankSetupInfo?.displayMaxProductHeight
      : '';

  // #endregion tank setup-related info from TankSetupDrawer helpers.tsx file

  // #region Sensor Calibration-related info from Sensor Calibration helpers.tsx file

  const isLinearScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Linear;

  const isPrescaledScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Prescaled;

  const isMappedScalingMode =
    sensorCalibration?.scalingModeId === ScalingModeTypeEnum.Mapped;

  const isPrimary =
    dataChannelDetails?.dataSourceInfo?.rtuDataSourceTypeInfo
      ?.rtuPriorityLevelTypeId === RtuPriorityLevelTypeEnum.Master;

  const matchRtuChannel = isNumber(
    dataChannelDetails?.rtuChannelSetpointsSyncTypeId
  )
    ? dataChannelDetails?.rtuChannelSetpointsSyncTypeId ===
      RtuChannelSetpointsSyncTypeEnum.AutoSync
    : false;

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

  // #endregion Sensor Calibration-related info from Sensor Calibration helpers.tsx file
  const initialScalings =
    sensorCalibration?.mappedSensorCalibrationInfo?.scalingdMap || [];
  const formattedScalings = [];

  for (let index = 0; index < 20; index += 1) {
    const currentScalingRow = initialScalings[index];

    const key = `${index}-${new Date()}`;

    if (currentScalingRow) {
      formattedScalings.push({
        item1: currentScalingRow.item1,
        item2: currentScalingRow.item2,
        key,
      } as ValueTupleOfDoubleAndDoubleWithKey);
    } else {
      formattedScalings.push({ key } as ValueTupleOfDoubleAndDoubleWithKey);
    }
  }

  return {
    // #region Tank Setup
    unitConversionModeId: isNumber(tankSetupInfo?.unitConversionModeId!)
      ? tankSetupInfo?.unitConversionModeId!
      : '',
    graphMin: isNumber(tankSetupInfo?.graphMin!)
      ? tankSetupInfo?.graphMin!
      : '',
    graphMax: isNumber(tankSetupInfo?.graphMax!)
      ? tankSetupInfo?.graphMax!
      : '',
    graphMinInScaled: isNumber(tankSetupInfo?.graphMinInScaled!)
      ? tankSetupInfo?.graphMinInScaled!
      : '',
    graphMaxInScaled: isNumber(tankSetupInfo?.graphMaxInScaled!)
      ? tankSetupInfo?.graphMaxInScaled!
      : '',
    calculatedMaxProductHeight: isNumber(
      tankSetupInfo?.volumetricTankSetupInfo?.calculatedMaxProductHeight!
    )
      ? tankSetupInfo?.volumetricTankSetupInfo?.calculatedMaxProductHeight!
      : '',

    // basic tank & simplified volumetric tank
    maxProductCapacity: basicOrSimplifiedVolumetricMaxProductHeight!,

    // simplified volumetric & volumetric tank
    displayUnitsId: getDisplayUnitsValue(tankSetupInfo),
    displayMaxProductCapacity: simplifiedVolumetricOrVolumetricDisplayMaxProductHeight!,
    tankTypeId: fieldValueOrEmpty(tankSetupInfo?.tankTypeInfo?.tankTypeId),
    tankDimensionId: isNumber(tankSetupInfo?.tankTypeInfo?.tankDimensionId)
      ? tankSetupInfo?.tankTypeInfo?.tankDimensionId!
      : '',
    productId: tankSetupInfo?.productId || '',
    // #endregion Tank Setup

    // #region Sensor Calibration

    scalingModeId: sensorCalibration?.scalingModeId || '',
    scaledUnitsId: isNumber(sensorCalibration?.scaledUnitsId)
      ? sensorCalibration?.scaledUnitsId!
      : '',
    scaledUnitsAsText: sensorCalibration?.scaledUnitsAsText || '',
    scaledMin: isNumber(sensorCalibration?.scaledMin)
      ? sensorCalibration?.scaledMin!
      : '',
    scaledMax: isNumber(sensorCalibration?.scaledMax)
      ? sensorCalibration?.scaledMax!
      : '',
    // Linear Sensor Mode
    // sensorPosition: isNumber(
    //   sensorCalibration?.linearSensorCalibrationInfo?.sensorPosition
    // )
    //   ? sensorCalibration?.linearSensorCalibrationInfo?.sensorPosition!
    //   : '',

    // Mapped Sensor Mode
    scalingdMap: formattedScalings,
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
    // #endregion Sensor Calibration

    // #region Forecast and Delivery
    minFillThreshold: isNumber(forecastDeliveryInfo?.minFillThreshold)
      ? forecastDeliveryInfo?.minFillThreshold!
      : '',
    maxTruckCapacity: isNumber(forecastDeliveryInfo?.maxTruckCapacity)
      ? forecastDeliveryInfo?.maxTruckCapacity!
      : '',

    displayMinFillThreshold: isNumber(
      forecastDeliveryInfo?.displayMinFillThreshold // Min Delivery Amount
    )
      ? forecastDeliveryInfo?.displayMinFillThreshold!
      : '',
    displayMaxTruckCapacity: isNumber(
      forecastDeliveryInfo?.displayMaxTruckCapacity
    )
      ? forecastDeliveryInfo?.displayMaxTruckCapacity!
      : '',
    // #endregion Forecast and Delivery

    // misc
    // Back-end does not care about generateWithFunction, purely front-end.
    generateWithFunction: GenerateFunctionType.Manual,

    isPrimary,
    matchRtuChannel,

    rtuChannelSetpointsSyncTypeId: isNumber(
      dataChannelDetails?.rtuChannelSetpointsSyncTypeId
    )
      ? dataChannelDetails?.rtuChannelSetpointsSyncTypeId
      : null,
  };
};

export const formatValuesForApi = (
  values: Values
): DataChannelTankAndSensorConfigDTO => {
  const isVolumetricTank =
    values?.unitConversionModeId === UnitConversionModeEnum.Volumetric;

  const formattedScalingdMap = values.scalingdMap
    ?.filter((value) => isNumber(value?.item1) || isNumber(value?.item2))
    .map((value) => ValueTupleOfDoubleAndDouble.fromJS(value));

  const sortedScalingdMap = formattedScalingdMap
    ? sortMappedTableRawValues(formattedScalingdMap)
    : null;

  return {
    // #region Tank Setup-related
    unitConversionModeId: isNumber(values.unitConversionModeId)
      ? values.unitConversionModeId
      : undefined,
    graphMin: isNumber(values.graphMin) ? values.graphMin : '',
    graphMax: isNumber(values.graphMax) ? values.graphMax : '',

    maxProductCapacity: isNumber(values.maxProductCapacity)
      ? values.maxProductCapacity
      : '',
    displayUnitsId: isNumber(values.displayUnitsId)
      ? values.displayUnitsId
      : undefined,
    displayMaxProductCapacity: isNumber(values.displayMaxProductCapacity)
      ? values.displayMaxProductCapacity
      : '',

    tankTypeId:
      isNumber(values?.tankTypeId) && !isVolumetricTank
        ? values?.tankTypeId
        : undefined,
    tankDimensionId:
      values?.tankDimensionId && isVolumetricTank
        ? values?.tankDimensionId
        : undefined,
    productId: values?.productId || undefined,
    // #endregion Tank Setup-related

    // #region Sensor Calibration-related

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
    // Mapped scaling mode only
    scalingdMap: sortedScalingdMap || undefined,
    rawUnits: values.rawUnits || undefined, // NOTE: We dont use rawUnits at all anymore
    rawUnitsAsText: values.rawUnitsAsText || '',
    rawUnitsAtScaleMin: isNumber(values.rawUnitsAtScaleMin)
      ? values.rawUnitsAtScaleMin
      : '',
    rawUnitsAtScaleMax: isNumber(values.rawUnitsAtScaleMax)
      ? values.rawUnitsAtScaleMax
      : '',
    isRawDataInverted: values.isRawDataInverted || false,
    // #endregion Sensor Calibration-related

    // #region Forecast and Delivery
    minFillThreshold: isNumber(values?.displayMinFillThreshold) // Min Delivery Amount
      ? values?.displayMinFillThreshold!
      : '',
    maxTruckCapacity: isNumber(values?.displayMaxTruckCapacity)
      ? values?.displayMaxTruckCapacity!
      : '',
    // #endregion Forecast and Delivery

    rtuChannelSetpointsSyncTypeId: values.rtuChannelSetpointsSyncTypeId,
  } as DataChannelTankAndSensorConfigDTO;
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

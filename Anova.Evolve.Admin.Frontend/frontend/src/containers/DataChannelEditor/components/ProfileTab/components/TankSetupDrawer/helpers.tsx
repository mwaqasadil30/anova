/* eslint-disable indent */
import {
  DataChannelSaveTankSetupInfoDTO,
  TankSetupInfoDTO,
  UnitConversionModeEnum,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { fieldValueOrEmpty } from 'utils/forms/values';
import { Values } from './types';

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
  tankSetupInfo?: TankSetupInfoDTO | null
): Values => {
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

  return {
    unitConversionModeId: isNumber(tankSetupInfo?.unitConversionModeId!)
      ? tankSetupInfo?.unitConversionModeId!
      : '',
    graphMin: isNumber(tankSetupInfo?.graphMin!)
      ? tankSetupInfo?.graphMin!
      : '',
    graphMax: isNumber(tankSetupInfo?.graphMax!)
      ? tankSetupInfo?.graphMax!
      : '',

    // basic tank & simplified volumetric tank
    maxProductCapacity: basicOrSimplifiedVolumetricMaxProductHeight!,

    // simplified volumetric & volumetric tank
    displayUnitsId: getDisplayUnitsValue(tankSetupInfo),
    displayMaxProductCapacity: simplifiedVolumetricOrVolumetricDisplayMaxProductHeight!,

    // volumetric tank
    // NOTE: Temporarily removed
    // calculatedMaxProductHeight: isNumber(
    //   tankSetupInfo?.volumetricTankSetupInfo?.calculatedMaxProductHeight
    // )
    //   ? tankSetupInfo?.volumetricTankSetupInfo?.calculatedMaxProductHeight!
    //   : null,

    // Moved from General Info Panel
    isTankProfileSet: tankSetupInfo?.tankTypeInfo?.isTankProfileSet || false,
    tankTypeId: fieldValueOrEmpty(tankSetupInfo?.tankTypeInfo?.tankTypeId),
    tankDimensionId: isNumber(tankSetupInfo?.tankTypeInfo?.tankDimensionId)
      ? tankSetupInfo?.tankTypeInfo?.tankDimensionId!
      : '',
    productId: tankSetupInfo?.productId || '',
  };
};

export const formatValuesForApi = (
  values: Values
): DataChannelSaveTankSetupInfoDTO => {
  return {
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

    // Removed from General Info
    isTankProfileSet: values?.isTankProfileSet || false,
    tankTypeId:
      isNumber(values?.tankTypeId) && !values?.isTankProfileSet
        ? values?.tankTypeId
        : undefined,
    tankDimensionId:
      values?.tankDimensionId && values?.isTankProfileSet
        ? values?.tankDimensionId
        : undefined,
    productId: values?.productId || undefined,
  } as DataChannelSaveTankSetupInfoDTO;
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

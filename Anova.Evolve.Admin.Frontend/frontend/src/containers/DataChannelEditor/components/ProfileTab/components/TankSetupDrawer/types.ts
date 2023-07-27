import {
  TankTypeEnum,
  UnitConversionModeEnum,
  UnitTypeEnum,
} from 'api/admin/api';

export interface Values {
  unitConversionModeId: UnitConversionModeEnum | '';
  graphMin: number | '';
  graphMax: number | '';
  // basic tank & simplified volumetric tank

  maxProductCapacity: number | '';

  // simplified volumetric & volumetric tank
  // Back-end allows a string to be sent ever since an api call was implemented
  // to get a custom list of selectable units (see: dataChannel_GetDisplayUnits)
  // and its type DataChannelDisplayUnitDTO (name and id are strings), but
  // the retrieve api is still typed as UnitTypeEnum
  displayUnitsId: UnitTypeEnum | '';

  displayMaxProductCapacity: number | '';

  // volumetric tank
  calculatedMaxProductHeight?: number | ''; // temporarily removed from form

  // Moved from general info drawer
  isTankProfileSet: boolean;
  tankTypeId: TankTypeEnum | '';
  tankDimensionId: string;
  productId: string;
}

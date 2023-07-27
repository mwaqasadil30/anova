import { UnitType, TankType, EditTankStrapping } from 'api/admin/api';

export interface Values {
  description: string;
  tankType: TankType;
  unitsOfMeasure: UnitType;
  height?: number | null;
  width?: number | null;
  dishHeight?: number | null;
  isStrappingUsedForWeb?: boolean;
  strappingLevelUnits?: UnitType | null;
  strappingVolumeUnits?: UnitType | null;
  tankStrappings?: EditTankStrapping[] | null;
  tankAssetNames?: string | null;
}

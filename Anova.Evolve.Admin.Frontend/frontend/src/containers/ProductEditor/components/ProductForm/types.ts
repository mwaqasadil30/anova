import { UnitType, EditProduct } from 'api/admin/api';

export interface Values {
  name: string;
  description: string;
  specificGravity?: EditProduct['specificGravity'] | string;
  standardVolumePerCubicMeter?:
    | EditProduct['standardVolumePerCubicMeter']
    | string;
  productGroup?: EditProduct['productGroup'];
  displayUnit?: UnitType | null | string;
}

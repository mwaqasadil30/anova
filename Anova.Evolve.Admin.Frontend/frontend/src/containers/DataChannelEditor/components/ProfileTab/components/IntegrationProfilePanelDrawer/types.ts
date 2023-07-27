import { ApciTankFunctionMode, ApciUnitOfMeasure } from 'api/admin/api';

export interface Values {
  siteNumber: string | null; // previously was named shipTo
  tankFunctionTypeId: ApciTankFunctionMode | '';
  isSendEnabled: boolean;
  airProductsUnitTypeId: ApciUnitOfMeasure | '';
  customerName?: string | null;
  customerAddress1?: string | null;
}

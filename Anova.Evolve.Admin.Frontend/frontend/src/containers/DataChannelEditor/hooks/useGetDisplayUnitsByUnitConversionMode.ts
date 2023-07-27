import { UnitConversionModeEnum } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';
import { isNumber } from 'utils/format/numbers';

const getDisplayUnitsByUnitConversionMode = (
  unitConversionMode: UnitConversionModeEnum
) => {
  return ApiService.DataChannelService.dataChannel_GetDisplayUnits(
    unitConversionMode
  );
};

export const useGetDisplayUnitsByUnitConversionMode = (
  unitConversionMode?: UnitConversionModeEnum
) => {
  return useQuery(
    [APIQueryKey.getDisplayUnitsByUnitConversionMode, unitConversionMode],
    () => getDisplayUnitsByUnitConversionMode(unitConversionMode!),
    {
      enabled: isNumber(unitConversionMode),
    }
  );
};

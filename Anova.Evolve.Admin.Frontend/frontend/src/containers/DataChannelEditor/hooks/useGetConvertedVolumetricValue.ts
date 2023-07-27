import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';
import { isNumber } from 'utils/format/numbers';
import {
  DataChannelVolumetricValueConversionDTO,
  UnitTypeEnum,
} from 'api/admin/api';

interface Request {
  dataChannelId?: string | null;
  value?: number;
  fromUnitId?: UnitTypeEnum | '';
  toUnitId?: UnitTypeEnum | '';
}

const getConvertedVolumetricValue = (
  request: DataChannelVolumetricValueConversionDTO
) => {
  return ApiService.DataChannelService.dataChannel_ConvertVolumetricValue(
    request
  );
};

export const useGetConvertedVolumetricValue = (request: Request) => {
  return useQuery(
    [APIQueryKey.getConvertedVolumetricValue, request],
    () =>
      getConvertedVolumetricValue(
        request as DataChannelVolumetricValueConversionDTO
      ),
    {
      enabled:
        isNumber(request.value) &&
        isNumber(request.toUnitId) &&
        isNumber(request.fromUnitId) &&
        !!request.dataChannelId,
    }
  );
};

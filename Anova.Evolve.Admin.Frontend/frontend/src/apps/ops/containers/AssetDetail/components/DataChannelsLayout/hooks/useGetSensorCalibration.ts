// import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface GetSensorCalibrationRequest {}
export interface GetSensorCalibrationResponse {}

// request: GetSensorCalibrationRequest
const getSensorCalibration = () => {
  return new Promise<GetSensorCalibrationResponse>((resolve) => {
    setTimeout(() => {
      resolve({} as GetSensorCalibrationResponse);
    }, 800);
  });
  // return ApiService.RosterService.roster_GetByRosterId(rosterId);
};

export const useGetSensorCalibration = (
  request: GetSensorCalibrationRequest
) => {
  return useQuery([APIQueryKey.getSensorCalibration, request], () =>
    // TODO: Pass in request
    getSensorCalibration()
  );
};

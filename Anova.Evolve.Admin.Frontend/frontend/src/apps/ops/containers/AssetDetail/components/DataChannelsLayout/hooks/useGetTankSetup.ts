// import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

export interface GetTankSetupRequest {}
export interface GetTankSetupResponse {}

const getTankSetup = () => {
  // TODO: Use API once its implemented
  return new Promise<GetTankSetupResponse>((resolve) => {
    setTimeout(() => {
      resolve({} as GetTankSetupResponse);
    }, 800);
  });
};

export const useGetTankSetup = (request: GetTankSetupRequest) => {
  // TODO: Pass in request
  return useQuery([APIQueryKey.getTankSetup, request], () => getTankSetup());
};

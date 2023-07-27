import { SetupDolV3AccessRequest } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = SetupDolV3AccessRequest;
type Response = void;

const savePasswordForDolV3 = (request: Request) => {
  return ApiService.DolV3AccessForB2CUserService.dolV3AccessForB2CUser_SetupDolV3Access(
    request
  );
};

export const useSavePasswordForDolV3 = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => savePasswordForDolV3(request),
    mutationOptions
  );
};

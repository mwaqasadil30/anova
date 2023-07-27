import { ResetPasswordDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = Omit<ResetPasswordDto, 'init' | 'toJSON'>;
type Response = boolean;

const resetPassword = async (request: Request) => {
  const formattedRequest = ResetPasswordDto.fromJS(request);
  return ApiService.AuthenticationService.authentication_ResetPassword(
    formattedRequest
  );
};

export const useResetPassword = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => resetPassword(request),
    mutationOptions
  );
};

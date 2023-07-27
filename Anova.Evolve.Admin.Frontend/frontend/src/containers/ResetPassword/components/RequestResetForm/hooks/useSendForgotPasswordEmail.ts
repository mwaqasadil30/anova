import {
  GetUserAuthenticationProviderDto,
  ForgotPasswordDto,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = Omit<ForgotPasswordDto, 'init' | 'toJSON'>;
type Response = GetUserAuthenticationProviderDto;

const sendForgotPasswordEmail = (request: Request) => {
  const formattedRequest = ForgotPasswordDto.fromJS(request);
  return ApiService.AuthenticationService.authentication_ForgotPassword(
    formattedRequest
  );
};

export const useSendForgotPasswordEmail = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => sendForgotPasswordEmail(request),
    mutationOptions
  );
};

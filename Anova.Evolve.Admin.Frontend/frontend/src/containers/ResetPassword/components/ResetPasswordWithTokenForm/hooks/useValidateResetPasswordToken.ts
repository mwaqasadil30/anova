import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = string;
type Response = boolean;

const validateResetPasswordToken = async (token: Request) => {
  return ApiService.AuthenticationService.authentication_ValidateResetPasswordToken(
    token
  );
};

export const useValidateResetPasswordToken = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  // Using a mutation even though this is a GET request since we dont really
  // want to be caching things related to password reset tokens.
  return useMutation(
    (request: Request) => validateResetPasswordToken(request),
    mutationOptions
  );
};

import { useMutation, UseMutationOptions } from 'react-query';
import { ForceUpdatePasswordDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';

interface PasswordResetUpdatePasswordRequest {
  userId: string;
  newPassword: string;
  confirmNewPassword: string;
}
const updatePasswordViaResetPasswordWithMockPromise = async (
  request: PasswordResetUpdatePasswordRequest
) => {
  return ApiService.AuthenticationService.authentication_ForceUpdatePassword(
    ForceUpdatePasswordDto.fromJS({
      userId: request.userId,
      newPassword: request.newPassword,
      confirmPassword: request.confirmNewPassword,
    } as Omit<ForceUpdatePasswordDto, 'init' | 'toJSON'>)
  );
};

export const useChangePassword = (
  mutationOptions?: UseMutationOptions<
    unknown,
    unknown,
    PasswordResetUpdatePasswordRequest,
    unknown
  >
) => {
  return useMutation(
    (request: PasswordResetUpdatePasswordRequest) =>
      updatePasswordViaResetPasswordWithMockPromise(request),
    mutationOptions
  );
};

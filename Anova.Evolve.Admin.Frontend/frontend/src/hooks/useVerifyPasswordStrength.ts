import { PasswordDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

type Request = Omit<PasswordDto, 'init' | 'toJSON'>;

const verifyPasswordStrength = (request: Request) => {
  const formattedRequest = PasswordDto.fromJS(request);
  return ApiService.AuthenticationService.authentication_VerifyPasswordStrength(
    formattedRequest
  );
};

export const useVerifyPasswordStrength = (request: Request) => {
  return useQuery(
    [APIQueryKey.verifyPasswordStrength, request],
    () => verifyPasswordStrength(request),
    {
      // Keep the previous data to prevent the password strength indicator from
      // flashing between an actual password strength (Weak, Strong, etc.) and
      // N/A since the previous API response would get cleared.
      keepPreviousData: true,
    }
  );
};

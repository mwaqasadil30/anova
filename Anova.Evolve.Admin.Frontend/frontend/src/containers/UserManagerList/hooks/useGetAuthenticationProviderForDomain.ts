import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const getAuthenticationProviderForDomain = () => {
  return ApiService.AuthenticationService.authentication_GetAuthenticationProvidersForDomain();
};

export const useGetAuthenticationProviderForDomain = () => {
  return useQuery([APIQueryKey.getAuthenticationProviderForDomain], () =>
    getAuthenticationProviderForDomain()
  );
};

import { SiteInfoDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = string;

type Response = SiteInfoDto;

const transferSiteBySiteNumber = (request: Request) => {
  return ApiService.SiteService.site_Transfer(request);
};

export const useTransferSiteBySiteNumber = (
  mutationOptions?: UseMutationOptions<Response, unknown, Request, unknown>
) => {
  return useMutation(
    (request: Request) => transferSiteBySiteNumber(request),
    mutationOptions
  );
};

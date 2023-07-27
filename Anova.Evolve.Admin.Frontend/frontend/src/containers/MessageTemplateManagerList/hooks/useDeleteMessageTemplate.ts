import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type Request = number[];

const deleteMessageTemplates = (ids?: Request) => {
  if (ids === undefined || ids === null) {
    return null;
  }

  return ApiService.MessageTemplateService.messageTemplate_Delete(ids);
};

export const useDeleteMessageTemplates = (
  mutationOptions?: UseMutationOptions<unknown, unknown, Request, unknown>
) => {
  return useMutation(
    // TODO: Figure out why this needs ts-ignore
    // @ts-ignore
    (ids: Request) => deleteMessageTemplates(ids),
    mutationOptions
  );
};

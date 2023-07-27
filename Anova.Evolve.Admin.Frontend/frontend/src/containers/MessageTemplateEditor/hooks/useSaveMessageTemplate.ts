import { MessageTemplateDto } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = MessageTemplateDto;
type ResponseObj = MessageTemplateDto;

const saveMessageTemplate = (request: RequestObj) => {
  return ApiService.MessageTemplateService.messageTemplate_Save(request);
};

export const useSaveMessageTemplate = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveMessageTemplate(request),
    mutationOptions
  );
};

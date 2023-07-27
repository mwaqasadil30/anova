import { ApiService } from 'api/admin/ApiService';
import { APIQueryKey } from 'api/react-query/helpers';
import { useQuery } from 'react-query';

const useMessageTemplateList = (
  templateType?: 'ANALOG_INPUT' | 'TRANSACTION'
) => {
  return useQuery(
    [APIQueryKey.getHornerTemplateList, templateType || 'ANALOG_INPUT'],
    () => {
      if (templateType === 'TRANSACTION')
        return ApiService.HornerTransactionRecordTemplateService.hornerTransactionRecordTemplate_GetTemplateList();
      return ApiService.HornerDetailRecordTemplateService.hornerDetailRecordTemplate_GetTemplateList();
    }
  );
};
export default useMessageTemplateList;

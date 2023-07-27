import { QuickEditRtuNotesDTO } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = {
  rtuDeviceId: string;
  rtuNotesInfo: QuickEditRtuNotesDTO;
};

type ResponseObj = boolean;

const saveRtuNotes = (request: RequestObj) => {
  return ApiService.RtuService.rtu_SaveRtuNotes(
    request.rtuDeviceId,
    request.rtuNotesInfo
  );
};

export const useSaveRtuNotes = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => saveRtuNotes(request),
    mutationOptions
  );
};

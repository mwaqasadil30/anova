import {
  UpdateDomainNotesRequest,
  UpdateDomainNotesResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = UpdateDomainNotesRequest;
type ResponseObj = UpdateDomainNotesResponse;

const saveNote = (request: RequestObj) => {
  return ApiService.DomainNotesService.domainNotes_UpdateDomainNotes(request);
};

const useSaveNote = (
  mutationOptions?: UseMutationOptions<ResponseObj, unknown, unknown, unknown>
) => {
  return useMutation(
    (request: RequestObj) => saveNote(request),
    mutationOptions
  );
};

export default useSaveNote;

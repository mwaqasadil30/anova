import {
  EvolveDeleteRtuPollScheduleGroupByIdListRequest,
  EvolveDeleteRtuPollScheduleGroupByIdListResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useMutation, UseMutationOptions } from 'react-query';

type RequestObj = { rtuPollScheduleGroupIds: string[] };
type ResponseObj = EvolveDeleteRtuPollScheduleGroupByIdListResponse;

const deletePollSchedules = (request: RequestObj) => {
  return ApiService.RTUService.deleteRtuPollScheduleGroupByIdList_DeleteRtuPollScheduleGroupByIdList(
    EvolveDeleteRtuPollScheduleGroupByIdListRequest.fromJS(request)
  );
};

export const useDeletePollSchedules = (
  mutationOptions?: UseMutationOptions<
    ResponseObj,
    unknown,
    RequestObj,
    unknown
  >
) => {
  return useMutation(
    (request: RequestObj) => deletePollSchedules(request),
    mutationOptions
  );
};

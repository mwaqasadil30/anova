import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

export const useDeleteRosters = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState<any>();
  const [responseData, setResponseData] = useState<boolean>();

  const deleteRosters = (rosterIds: number[]) => {
    setIsFetching(true);
    setResponseError(null);
    return ApiService.RosterService.roster_Delete(rosterIds)
      .then((response) => {
        setResponseData(response);
        return response;
      })
      .catch((error) => {
        setResponseError(error);
        console.error('Failed to delete rosters', error);
        throw error;
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    isFetching,
    error: responseError,
    data: responseData,
    makeRequest: deleteRosters,
  };
};

import { useCallback, useState } from 'react';
import { PaginatedResponseModelOfAuditHistoryDto } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';

type Response = PaginatedResponseModelOfAuditHistoryDto;

const useRetrieveAuditHistory = () => {
  const [isFetchingInitial, setIsFetchingInitial] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState();
  const [responseData, setResponseData] = useState<Response>();

  const fetchAuditHistory = useCallback(
    (deviceId: string, pageNumber: number, pageSize: number) => {
      setIsFetching(true);

      return AdminApiService.RtuService.rtu_RetrieveAuditHistory(
        deviceId,
        pageNumber,
        pageSize
      )
        .then((response) => {
          setResponseData(response);
          return response;
        })
        .catch((error) => {
          setResponseError(error);
          throw error;
        })
        .finally(() => {
          setIsFetching(false);
          setIsFetchingInitial(false);
        });
    },
    []
  );

  return {
    isFetching,
    isFetchingInitial,
    error: responseError,
    data: responseData,
    fetchData: fetchAuditHistory,
  };
};

export default useRetrieveAuditHistory;

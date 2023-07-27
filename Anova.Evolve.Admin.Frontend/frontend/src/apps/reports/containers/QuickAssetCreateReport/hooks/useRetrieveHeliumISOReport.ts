import {
  EvolveQuickHeliumISOCreateReportDetailsRequest,
  EvolveQuickHeliumISOCreateReportDetailsResponse,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { useCallback, useState } from 'react';

const useRetrieveHeliumISOReport = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [responseError, setResponseError] = useState();
  const [response, setResponse] = useState<
    EvolveQuickHeliumISOCreateReportDetailsResponse | null | undefined
  >();

  const fetchEditData = useCallback((assetId?: string) => {
    setIsFetching(true);
    return AdminApiService.ReportService.retrieveQuickHeliumISOCreateReportDetails_RetrieveQuickAssetCreateHeliumISOReportDetails(
      {
        assetId,
      } as EvolveQuickHeliumISOCreateReportDetailsRequest
    )
      .then((responseData) => {
        setResponse(responseData);
      })
      .catch((error) => {
        setResponseError(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return {
    isFetching,
    error: responseError,
    data: response,
    refetch: fetchEditData,
  };
};

export default useRetrieveHeliumISOReport;

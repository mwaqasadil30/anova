import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { ApiService } from 'api/admin/ApiService';
import {
  EvolveGetActiveInventoryLevelEventsRequest,
  EvolveInventoryEvent,
} from 'api/admin/api';
import { useTranslation } from 'react-i18next';

export const usePieChartData = (productId: string) => {
  const { t } = useTranslation();

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [graphData, setGraphData] = useState<
    EvolveInventoryEvent | null | undefined
  >();

  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const fetchPieChartDetails = (
    selectedDomainId?: string,
    selectedProductId?: string
  ) => {
    setIsFetching(true);
    const data = {
      domainId: selectedDomainId,
      productId: selectedProductId,
    } as EvolveGetActiveInventoryLevelEventsRequest;

    ApiService.DashboardService.getActiveInventoryLevelEvents_GetActiveInventoryLevelEvents(
      data
    )
      .then((response) => {
        setGraphData(response.result);
      })
      .catch((responseError) => {
        const commonErrorMessage = t(
          'ui.common.unableToRetrieveDataError',
          'Unable to retrieve data'
        );
        setError(commonErrorMessage);
        console.error('Unable to retrieve data', responseError);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  // fetch only once when the component is created
  useEffect(() => {
    fetchPieChartDetails(domainId, productId);
  }, [domainId, productId]);

  return {
    isFetching,
    error,
    data: graphData,
  };
};

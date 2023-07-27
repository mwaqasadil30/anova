import {
  EvolveGetProductsByDomainIdRequest,
  EvolveProduct,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';

export const useAllProductsData = () => {
  const { t } = useTranslation();

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState<EvolveProduct[]>([]);

  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const fetchAllProducts = (selectedDomainId?: string) => {
    setIsFetching(true);
    const data = {
      domainId: selectedDomainId,
    } as EvolveGetProductsByDomainIdRequest;

    ApiService.DashboardService.getProductsByDomainId_GetProductsByDomainId(
      data
    )
      .then((response) => {
        setResponseData(response.result || []);
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

  useEffect(() => {
    fetchAllProducts(domainId);
  }, [domainId]);

  return {
    isFetching,
    error,
    data: responseData,
  };
};

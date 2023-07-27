import {
  EvolveFavourite,
  EvolveGetFavouritesByUserIdAndDomainIdRequest,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FetchFavouritesParams {
  domainId?: string;
  userId?: string;
}

const initialFavourites = [] as EvolveFavourite[];

export const useFavouritesInfo = () => {
  const { t } = useTranslation();

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState<EvolveFavourite[]>([]);

  const fetchFavourites = ({ userId, domainId }: FetchFavouritesParams) => {
    setIsFetching(true);
    const data = {
      userId,
      domainId,
    } as EvolveGetFavouritesByUserIdAndDomainIdRequest;

    ApiService.GeneralService.getFavouritesByUserIdAndDomainId_GetFavouritesByUserIdAndDomainId(
      data
    )
      .then((response) => {
        const favourites = response.favourites || initialFavourites;
        setResponseData(favourites);
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

  return {
    isFetching,
    error,
    data: responseData,
    fetchFavourites,
  };
};

import { EditFavourite, EvolveSaveFavouriteRequest } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

export const useSaveFavourite = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState<
    EditFavourite | null | undefined
  >();

  const saveFavourite = (
    favourite: EvolveSaveFavouriteRequest['favourite']
  ) => {
    setIsFetching(true);

    return ApiService.GeneralService.saveFavourite_SaveFavourite({
      favourite,
    } as EvolveSaveFavouriteRequest)
      .then((response) => {
        const result = response.saveFavouriteResult;
        setResponseData(result);
        return result;
      })
      .catch((responseError) => {
        setError(responseError);
        console.error('Unable to save favourite', responseError);
        throw responseError;
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    isFetching,
    error,
    data: responseData,
    saveFavourite,
  };
};

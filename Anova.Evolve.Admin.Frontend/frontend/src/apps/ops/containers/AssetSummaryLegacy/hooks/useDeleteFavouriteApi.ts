import { EvolveDeleteFavouriteByIdRequest } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';

export const useDeleteFavourite = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<any>();
  const [responseData, setResponseData] = useState<boolean | undefined>();

  const deleteFavourite = (favouriteId: number) => {
    setIsFetching(true);

    return ApiService.GeneralService.deleteFavouriteById_DeleteFavouriteById({
      favouriteId,
    } as EvolveDeleteFavouriteByIdRequest)
      .then((response) => {
        const wasSuccessful = response.deleteFavouriteByIdResult;
        setResponseData(wasSuccessful);

        if (wasSuccessful) {
          setResponseData(wasSuccessful);
        } else {
          setError('Unable to delete favourite');
        }
        return wasSuccessful;
      })
      .catch((responseError) => {
        setError(responseError);
        console.error('Unable to delete favourite', responseError);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    isFetching,
    error,
    data: responseData,
    deleteFavourite,
  };
};

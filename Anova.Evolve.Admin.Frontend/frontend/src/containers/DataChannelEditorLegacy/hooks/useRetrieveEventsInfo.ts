import {
  EvolveDataChannelEventsInfo,
  EvolveGetDataChannelEventsInfoRequest,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';

interface Props {
  dataChannelId?: string;
}

export const useRetrieveEventsInfo = ({ dataChannelId }: Props) => {
  const { t } = useTranslation();

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState<
    EvolveDataChannelEventsInfo | null | undefined
  >();

  const domainId = useSelector(selectActiveDomainId);

  const fetchEventsWithParams = (
    selectedDataChannelId?: string,
    selectedDomainId?: string
  ) => {
    setIsFetching(true);
    const data = {
      dataChannelId: selectedDataChannelId,
      domainId: selectedDomainId,
    } as EvolveGetDataChannelEventsInfoRequest;

    ApiService.DataChannelService.getDataChannelEventsInfo_GetDataChannelEventsInfo(
      data
    )
      .then((response) => {
        const events = response.info;
        setResponseData(events);
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

  const fetchEvents = useCallback(
    () => fetchEventsWithParams(dataChannelId, domainId),
    [dataChannelId, domainId]
  );

  return {
    isFetching,
    error,
    data: responseData,
    fetchEvents,
  };
};

import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { getAppVersion } from 'utils/common';

interface Props {
  intervalInMilliseconds: number;
  onDifferentVersion: () => void;
}

const useCheckForAppVersionUpdates = ({
  intervalInMilliseconds,
  onDifferentVersion,
}: Props) => {
  const oldAppVersion = getAppVersion();

  const fetchAppIndex = useCallback(() => {
    return axios
      .get('/index.html', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      .then((response) => {
        const axiosResponseData = response.data;
        const regex = /name="ui-version" content="([a-z0-9]+)"/gi;
        const newAppVersion = regex?.exec(axiosResponseData)?.[1];

        const isDifferentVersion =
          !!oldAppVersion && !!newAppVersion && oldAppVersion !== newAppVersion;

        if (isDifferentVersion) {
          onDifferentVersion();
        }

        return isDifferentVersion;
      })
      .catch((error) => {
        console.error('Failed to check app version:', error);
        return false;
      });
  }, [oldAppVersion, onDifferentVersion]);

  // Set up an interval to check if the app version has been updated
  useEffect(() => {
    const intervalId = setInterval(fetchAppIndex, intervalInMilliseconds);
    return () => clearInterval(intervalId);
  }, [fetchAppIndex]);

  return null;
};

export default useCheckForAppVersionUpdates;

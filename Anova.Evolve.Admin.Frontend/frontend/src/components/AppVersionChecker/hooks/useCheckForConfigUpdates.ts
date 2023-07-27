import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  intervalInMilliseconds: number;
  onDifferentConfig: () => void;
}

const useCheckForConfigUpdates = ({
  intervalInMilliseconds,
  onDifferentConfig,
}: Props) => {
  const [initialConfigResponse, setInitialConfigResponse] = useState('');
  const [hasMadeInitialRequest, setHasMadeInitialRequest] = useState(false);

  const fetchConfigData = useCallback(() => {
    return axios
      .get('/config.js', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      .then((response) => {
        const newConfigResponse = response.data;
        if (!hasMadeInitialRequest) {
          setInitialConfigResponse(response.data);
          setHasMadeInitialRequest(true);
          return false;
        }

        const isDifferentConfig =
          !!initialConfigResponse &&
          !!newConfigResponse &&
          initialConfigResponse !== newConfigResponse;

        if (isDifferentConfig) {
          onDifferentConfig();
        }

        return isDifferentConfig;
      })
      .catch((error) => {
        console.error('Failed to check config version:', error);
        return false;
      });
  }, [initialConfigResponse, hasMadeInitialRequest, onDifferentConfig]);

  // Initialize the config data the first time
  useEffect(() => {
    fetchConfigData();
  }, []);

  // Set up an interval to check if the config has been updated
  useEffect(() => {
    const intervalId = setInterval(fetchConfigData, intervalInMilliseconds);
    return () => clearInterval(intervalId);
  }, [fetchConfigData]);

  return null;
};

export default useCheckForConfigUpdates;

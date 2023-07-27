/* eslint no-console: ["error", { allow: ["info", "error"] }] */
import { EvolveProbeRequest } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from 'redux-app/modules/user/selectors';
import { SESSION_PROBE_INTERVAL_IN_MINUTES } from 'env';

const PROBE_INTERVAL_IN_MILLISECONDS =
  1000 * 60 * SESSION_PROBE_INTERVAL_IN_MINUTES;

export const useSessionProbe = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<any>();

  const probeSession = (userId?: string) => {
    setIsFetching(true);
    // TODO: Remove temporary logging to determine bug with the session probe
    console.info(`[session probe] /probe API call attempt ${new Date()}`);

    ApiService.UserDetailsService.userDetails_Probe({
      userId,
    } as EvolveProbeRequest)
      .then(() => {
        console.info(`[session probe] /probe API call succeeded ${new Date()}`);
      })
      .catch((responseError) => {
        console.info(`[session probe] /probe API call failed ${new Date()}`);
        console.error(`[session probe] error: ${responseError}`);
        setError(responseError);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  const currentUserId = useSelector(selectUserId);

  useEffect(() => {
    // This handles the case when the user isn't logged in or if there's an
    // error, so we don't probe the session
    if (!currentUserId || error) {
      return;
    }

    probeSession(currentUserId);
    // NOTE: If we do an interval of 60 minutes, the user can navigate the app
    // within 60 minutes with an invalid session. The back-end doesn't return a
    // 401 on API calls (other than /probe) when the session cookie is invalid.
    const intervalId = setInterval(() => {
      probeSession(currentUserId);
    }, PROBE_INTERVAL_IN_MILLISECONDS);

    /* eslint-disable-next-line consistent-return */
    return () => clearInterval(intervalId);
  }, [currentUserId]);

  return {
    isFetching,
    error,
    setError,
  };
};

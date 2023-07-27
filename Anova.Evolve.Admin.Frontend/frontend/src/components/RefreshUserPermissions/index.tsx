import { useRefreshUserPermissions } from 'hooks/useRefreshUserPermissions';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import { selectIsAuthenticated } from 'redux-app/modules/user/selectors';

const RefreshUserPermissions = () => {
  const { refetch: refreshPermissions } = useRefreshUserPermissions();
  const isUserAuthenticated = useSelector(selectIsAuthenticated);
  const activeDomainId = useSelector(selectActiveDomainId);

  useEffect(() => {
    if (isUserAuthenticated) {
      refreshPermissions();
    }
  }, []);

  // Refresh permissions after changing domains
  useUpdateEffect(() => {
    if (activeDomainId) {
      refreshPermissions();
    }
  }, [activeDomainId]);

  return null;
};

export default RefreshUserPermissions;

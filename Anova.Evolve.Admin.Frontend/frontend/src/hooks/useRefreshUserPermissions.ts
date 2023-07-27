import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetUserPermissions } from 'redux-app/modules/user/routines';
import { selectUserId } from 'redux-app/modules/user/selectors';

export const useRefreshUserPermissions = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectUserId);

  const fetchUserPermissions = () => {
    dispatch(GetUserPermissions.trigger());
  };

  const fetchAndSetUserPermissions = useCallback(() => {
    fetchUserPermissions();
    // If the userId changes, we should still refetch permissions.
  }, [currentUserId]);

  return {
    refetch: fetchAndSetUserPermissions,
  };
};

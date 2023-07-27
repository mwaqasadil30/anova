// Used mostly from the notistack redux example
// https://iamhosseindhv.com/notistack/demos#redux-/-mobx-example
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SnackbarKey, useSnackbar } from 'notistack';
import { removeSnackbar } from 'redux-app/modules/app/actions';
import { SnackbarNotification } from 'redux-app/modules/app/types';
import { selectSnackbarNotifications } from 'redux-app/modules/app/selectors';

let displayed: SnackbarKey[] = [];

const useNotifier = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectSnackbarNotifications);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id: SnackbarKey) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  React.useEffect(() => {
    notifications.forEach(
      ({
        key,
        message,
        options = {},
        dismissed = false,
      }: SnackbarNotification) => {
        if (dismissed) {
          // dismiss snackbar using notistack
          closeSnackbar(key);
          return;
        }

        // do nothing if snackbar is already displayed
        if (displayed.includes(key)) return;

        // display snackbar using notistack
        enqueueSnackbar(message, {
          key,
          ...options,
          onClose: (event, reason, myKey) => {
            if (options.onClose) {
              options.onClose(event, reason, myKey);
            }
          },
          onExited: (event, myKey) => {
            // remove this snackbar from redux store
            dispatch(removeSnackbar(myKey));
            removeDisplayed(myKey);
          },
        });

        // keep track of snackbars that we've displayed
        storeDisplayed(key);
      }
    );
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);
};

export default useNotifier;

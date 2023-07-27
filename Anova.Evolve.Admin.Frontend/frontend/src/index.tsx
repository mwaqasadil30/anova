import { MsalProvider } from '@azure/msal-react';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import StylesProvider from '@material-ui/styles/StylesProvider';
import { CustomAxios, initializeInterceptors } from 'api/custom-axios';
import CustomQueryClientProvider from 'api/react-query/CustomQueryClientProvider';
import CustomThemeProvider from 'components/CustomThemeProvider';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import momentTz from 'moment-timezone';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { InitializeAppRoutine } from 'redux-app/modules/app/routines';
import { PersistGate } from 'redux-persist/integration/react';
import { initializeAppInsights } from 'utils/app-insights';
import { CustomNavigationClient } from 'authentication/NavigationClient';
import App from './App';
import configureStore from './redux-app/configureStore';
import { msalInstance } from './authentication/msal';
import SnackbarNotificationProvider from './providers/SnackbarNotificationProvider';
import * as serviceWorker from './serviceWorker';

import './index.css';
// i18next/react-i18next needs to be bundled so we import it in the app's
// entrypoint
import i18n from './i18n';

const initialState = undefined;
const history = createBrowserHistory();
const { store, persistor } = configureStore(initialState, history);
store.dispatch(InitializeAppRoutine.trigger());
initializeInterceptors(CustomAxios, store, msalInstance, i18n);
initializeAppInsights(history, store);

// MSAL React Router recommendation:
// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/performance.md
const navigationClient = new CustomNavigationClient(history);
msalInstance.setNavigationClient(navigationClient);

// Initialize moment to be used with Highcharts for timezone support
// https://api.highcharts.com/highcharts/time.timezone
// https://github.com/highcharts/highcharts/issues/8661
// @ts-ignore
window.moment = momentTz;

ReactDOM.render(
  <Provider store={store}>
    <MsalProvider instance={msalInstance}>
      <CustomQueryClientProvider>
        <PersistGate loading={null} persistor={persistor}>
          <StylesProvider injectFirst>
            <CustomThemeProvider includeGlobalStyles>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <SnackbarNotificationProvider>
                  {/*
                TODO: Using Suspense for react-i18next waiting for translations to
                load. Translations should load fast enough. May want to show a
                delayed loading indicator? Eg: Show a blank page for a maximum of
                500ms before showing the indicator.
              */}
                  <Suspense fallback="">
                    <ConnectedRouter history={history}>
                      {/*
                    Rendering the App as a Route is REQUIRED. Otherwise, routes defined in
                    App, or components within App will not update when clicked on (only on
                      refreshes).
                      https://stackoverflow.com/a/44356956
                    */}
                      <Route component={App} />
                    </ConnectedRouter>
                  </Suspense>
                </SnackbarNotificationProvider>
              </MuiPickersUtilsProvider>
            </CustomThemeProvider>
          </StylesProvider>
        </PersistGate>
      </CustomQueryClientProvider>
    </MsalProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

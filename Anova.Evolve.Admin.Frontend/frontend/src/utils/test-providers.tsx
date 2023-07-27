import React, { ReactNode, Suspense } from 'react';
import { Router } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import CustomQueryClientProvider from 'api/react-query/CustomQueryClientProvider';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { History } from 'history';
import { Store } from 'redux';
import i18n from 'i18n/i18nForTests';
import CustomThemeProvider from 'components/CustomThemeProvider';

interface WrapperProps {
  history: History;
  store: Store;
}

interface ComponentProps {
  children: ReactNode;
}

// Utility to wrap test components with all providers used by the App
const AllTheProviders = ({ history, store }: WrapperProps) => ({
  children,
}: ComponentProps) => {
  return (
    <Provider store={store}>
      <CustomQueryClientProvider>
        {/* `I18nextProvider` is only needed for tests */}
        <I18nextProvider i18n={i18n}>
          <CustomThemeProvider>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              {/* Required for translations (or suspense can be disabled) */}
              <Suspense fallback={() => null}>
                <Router history={history}>{children}</Router>
              </Suspense>
            </MuiPickersUtilsProvider>
          </CustomThemeProvider>
        </I18nextProvider>
      </CustomQueryClientProvider>
    </Provider>
  );
};

export default AllTheProviders;

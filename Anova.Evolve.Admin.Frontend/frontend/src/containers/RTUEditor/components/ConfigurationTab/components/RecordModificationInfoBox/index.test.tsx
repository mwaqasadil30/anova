import { render, screen, waitFor } from '@testing-library/react';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import StylesProvider from '@material-ui/styles/StylesProvider';
import CustomQueryClientProvider from 'api/react-query/CustomQueryClientProvider';
import CustomThemeProvider from 'components/CustomThemeProvider';
import { createBrowserHistory } from 'history';
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-app/configureStore';
import SnackbarNotificationProvider from 'providers/SnackbarNotificationProvider';
import RecordModificationInfoBox from '.';
import 'i18n';

const initialState = undefined;
const history = createBrowserHistory();
const { store } = configureStore(initialState, history);
const AllProviders: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <CustomQueryClientProvider>
        <StylesProvider injectFirst>
          <CustomThemeProvider includeGlobalStyles>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <SnackbarNotificationProvider>
                <Suspense fallback="">{children}</Suspense>
              </SnackbarNotificationProvider>
            </MuiPickersUtilsProvider>
          </CustomThemeProvider>
        </StylesProvider>
      </CustomQueryClientProvider>
    </Provider>
  );
};
describe('RecordModificationInfoBox', () => {
  it('should display Last Updated by date and name', async () => {
    render(
      <RecordModificationInfoBox
        modificationData={{
          createdByName: 'Nick',
          lastUpdateUserName: 'Mike',
          createdDate: new Date('1/1/2020'),
          lastUpdatedDate: new Date('1/1/2021'),
        }}
      />,
      { wrapper: AllProviders }
    );

    await waitFor(() => {
      expect(screen.getByText('Last Updated:')).toBeInTheDocument();
    });
  });
  it('should display Created by date and name', async () => {
    render(
      <RecordModificationInfoBox
        modificationData={{
          createdByName: 'Nick',
          lastUpdateUserName: null,
          createdDate: new Date('1/1/2020'),
          lastUpdatedDate: null,
        }}
      />,
      { wrapper: AllProviders }
    );

    await waitFor(() => {
      expect(screen.getByText('Created:')).toBeInTheDocument();
    });
  });
  it('should display returns null', async () => {
    const { container } = render(
      <RecordModificationInfoBox
        modificationData={{
          createdByName: null,
          lastUpdateUserName: null,
          createdDate: null,
          lastUpdatedDate: null,
        }}
      />,
      { wrapper: AllProviders }
    );

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });
});

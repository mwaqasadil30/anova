import { applyMiddleware, createStore, compose, CombinedState } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { History } from 'history';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import rootSaga from 'redux-app/rootSaga';
import createRootReducer from 'redux-app/rootReducer';
import type { State } from 'redux-app/types';
import { loadingTransform } from './persist/transforms';

const persistConfig = {
  key: 'root',
  storage,
  transforms: [loadingTransform],
  // Prevent an incorrect route from being restored (ex: going from the
  // Operations app to the Admin app via the browser's "Open in a new tab"
  // option. In some cases this caused the top navigation offset to include the
  // Operations BreadcrumbBar which appears as a blank spot under the top nav).
  // This was because the restored route would be an Operations app related
  // page, even though the user's actually on an Admin app page.
  blacklist: ['router'],
};

export default function configureStore(
  initialState: CombinedState<State> | undefined,
  history: History
) {
  const sagaMiddleware = createSagaMiddleware();
  const reduxRouterMiddleware = routerMiddleware(history);

  const middlewares = [reduxRouterMiddleware, sagaMiddleware];

  const composeEnhancers =
    (process.env.NODE_ENV !== 'production' &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  const createPersistedReducer = () =>
    persistReducer(persistConfig, createRootReducer(history));

  const store = createStore(
    createPersistedReducer(),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('redux-app/rootReducer', () => {
      const nextRootReducer = require('redux-app/rootReducer'); // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return { store, persistor };
}

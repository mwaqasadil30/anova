import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter } from 'connected-react-router';
import { userReducer } from './modules/user/reducer';
import appReducer from './modules/app/reducer';
import coreApiReducer from './modules/coreApi/reducer';
import { loadingAppTransform } from './persist/transforms';

const appPersistConfig = {
  key: 'app',
  storage,
  blacklist: ['snackBar'],
  transforms: [loadingAppTransform],
};

export default (history: History) =>
  combineReducers({
    app: persistReducer(appPersistConfig, appReducer),
    router: connectRouter(history),

    coreApi: coreApiReducer,
    user: userReducer,
  });

import { Store as ReduxStore, CombinedState } from 'redux';
import { RouterState } from 'connected-react-router';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { ApplicationState } from './modules/app/types';
import { CoreApiState } from './modules/coreApi/types';
import { UserAction, UserState } from './modules/user/types';

export type Action = UserAction;

export interface State extends PersistPartial {
  app: ApplicationState;
  router: RouterState;
  coreApi: CoreApiState;
  user: UserState;
}

export type ApplicationStore = ReduxStore<CombinedState<State>>;

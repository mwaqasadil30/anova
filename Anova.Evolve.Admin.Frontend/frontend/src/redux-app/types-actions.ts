import { LocationChangeAction } from 'connected-react-router';
import { ApplicationAction } from './modules/app/types';
import { CoreApiAction } from './modules/coreApi/types';
import { UserAction } from './modules/user/types';

export type BaseAction<T = any> = {
  type: string;
  // TODO: Handle types for redux-saga-routines action payloads
  // tslint:disable-next-line:no-any
  payload: T;
};

export type ApplicationWideAction =
  | LocationChangeAction // from connected-react-router
  | ApplicationAction
  | CoreApiAction
  | UserAction;

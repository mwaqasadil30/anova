import { State } from 'redux-app/types';

export const selectLogin = (state: State) => state.coreApi.login;

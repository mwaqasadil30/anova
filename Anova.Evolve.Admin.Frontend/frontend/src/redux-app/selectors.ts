import { createSelector } from 'reselect';
import { State } from 'redux-app/types';

export const getRouterState = (state: State) => state.router;
export const getRouterQueryParams = (state: State) =>
  state.router.location.search;

export const selectLocationPathname = createSelector(
  getRouterState,
  (router) => router.location.pathname
);

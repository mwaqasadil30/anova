/* eslint-disable import/prefer-default-export */
import merge from 'lodash/merge';

import { entitiesInitialState } from './defaultStates';

interface EntitiesAction {
  type: string;
  // TODO: Add better typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export function genericEntitiesReducer(entitiesKey: string) {
  return function reducer(
    state = entitiesInitialState,
    action: EntitiesAction
  ) {
    switch (action.type) {
      default:
        if (
          action.payload &&
          action.payload.entities &&
          action.payload.entities[entitiesKey]
        ) {
          return merge({}, state, action.payload.entities[entitiesKey]);
        }
        return state;
    }
  };
}

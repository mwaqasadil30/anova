import { BaseAction } from 'redux-app/types-actions';
import { Routine } from 'redux-saga-routines';
import { ApiDataStateTypes, CoreApiActionType } from './types';
import { UserActionType } from '../user/types';

const initialState: ApiDataStateTypes = {
  data: null,
  loading: false,
  error: null,
};

const apiReducer = (routine: Routine, reducerName: string) => (
  state: ApiDataStateTypes = initialState,
  action: BaseAction
) => {
  switch (action.type) {
    case CoreApiActionType.RESET_API_STATE: {
      if (action.payload.reducerName === reducerName) {
        return initialState;
      }

      return state;
    }
    case routine.REQUEST:
      return { ...state, loading: true };
    case routine.SUCCESS:
      return { ...state, data: action.payload, loading: false, error: null };
    case routine.FAILURE:
      return { ...state, error: action.payload, loading: false };
    case UserActionType.Logout:
      return initialState;
    default:
      return state;
  }
};

export { initialState as initialApiState, apiReducer };

import { CoreApiActionType, ResetApiStateAction } from './types';

export const resetApiState = (reducerName: string): ResetApiStateAction => {
  return {
    type: CoreApiActionType.RESET_API_STATE,
    payload: {
      reducerName,
    },
  };
};

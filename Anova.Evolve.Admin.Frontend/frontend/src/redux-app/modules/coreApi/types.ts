import {
  ApiException,
  EvolveAuthenticateAndRetrieveApplicationInfoResponse,
} from 'api/admin/api';
import { FormikHelpers } from 'formik';
import { LoginFormValues } from 'containers/Login/types';
import { BaseAction } from 'redux-app/types-actions';

export enum CoreApiActionType {
  RESET_API_STATE = 'coreApi/RESET_API_STATE',
}

// NOTE: Use union operator | to join other types of API responses here
export type ApiDataTypes = EvolveAuthenticateAndRetrieveApplicationInfoResponse;

export interface LoginActionPayload {
  formValues?: LoginFormValues;
  formikProps?: FormikHelpers<LoginFormValues>;
}

export type LoginActionSuccess = BaseAction<EvolveAuthenticateAndRetrieveApplicationInfoResponse>;

export type LoginAction = BaseAction<LoginActionPayload | undefined>;

export interface ApiDataState<T, E = any> {
  data: T | null;
  loading: boolean;
  error: E | null;
}

export type ApiDataStateTypes = ApiDataState<ApiDataTypes>;

export interface CoreApiState {
  login: ApiDataState<
    EvolveAuthenticateAndRetrieveApplicationInfoResponse,
    EvolveAuthenticateAndRetrieveApplicationInfoResponse | ApiException
  >;
}

export interface ResetApiStateAction {
  type: CoreApiActionType.RESET_API_STATE;
  payload: {
    reducerName: string;
  };
}

export type CoreApiAction = ResetApiStateAction;

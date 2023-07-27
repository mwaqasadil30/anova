import { createRoutine } from 'redux-saga-routines';

const LOGIN_USER = 'user/routines/LOGIN_USER';
const GET_USER_PERMISSIONS = 'user/routines/GET_USER_PERMISSIONS';
const INIT_USER = 'user/routines/INIT_USER';
export const LoginUserRoutine = createRoutine(LOGIN_USER);
export const InitializeUserRoutine = createRoutine(INIT_USER);
export const GetUserPermissions = createRoutine(GET_USER_PERMISSIONS);

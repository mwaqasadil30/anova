import { createRoutine } from 'redux-saga-routines';

const INIT_APP = 'app/routines/INIT_APP';
const FETCH_TIMEZONES = 'app/routines/FETCH_TIMEZONES';
const FETCH_ACTIVE_DOMAIN = 'app/routines/FETCH_ACTIVE_DOMAIN';
const UPDATE_USER_PREFERRED_TIMEZONE =
  'app/routines/UPDATE_USER_PREFERRED_TIMEZONE';
export const InitializeAppRoutine = createRoutine(INIT_APP);
export const FetchTimezonesRoutine = createRoutine(FETCH_TIMEZONES);
export const FetchActiveDomainRoutine = createRoutine(FETCH_ACTIVE_DOMAIN);
export const UpdateUserPreferredTimezoneRoutine = createRoutine(
  UPDATE_USER_PREFERRED_TIMEZONE
);

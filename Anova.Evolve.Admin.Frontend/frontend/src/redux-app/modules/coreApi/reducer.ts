import { LoginUserRoutine } from 'redux-app/modules/user/routines';
import { combineReducers } from 'redux';
import { apiReducer } from './apiReducer';

export default combineReducers({
  login: apiReducer(LoginUserRoutine, 'login'),
});

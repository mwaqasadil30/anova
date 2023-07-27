import { SagaIterator } from 'redux-saga';
import { all, call } from 'redux-saga/effects';

import { appWatcher } from './modules/app/sagas';
import { userWatcher } from './modules/user/sagas';

function* rootSaga(): SagaIterator {
  yield all([call(appWatcher), call(userWatcher)]);
}

export default rootSaga;

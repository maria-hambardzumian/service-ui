/*
 * Copyright 2019 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { put, takeEvery, take, all } from 'redux-saga/effects';
import { fetchAppInfoAction } from 'controllers/appInfo';
import { FETCH_USER_ERROR, FETCH_USER_SUCCESS, fetchUserAction } from 'controllers/user';
import {
  DEFAULT_TOKEN,
  resetTokenAction,
  TOKEN_KEY,
  setTokenAction,
  authSuccessAction,
} from 'controllers/auth';
import { FETCH_PROJECT_SUCCESS, fetchProjectAction } from 'controllers/project';
import {
  fetchGlobalIntegrationsAction,
  fetchPluginsAction,
  fetchPublicPluginsAction,
} from 'controllers/plugins';
import { getStorageItem } from 'common/utils';
import { SET_ACTIVE_PROJECT_KEY } from 'controllers/user/constants';
import { setInitialDataReadyAction } from './actionCreators';
import { FETCH_INITIAL_DATA } from './constants';

function* fetchInitialData() {
  yield put(setTokenAction(getStorageItem(TOKEN_KEY) || DEFAULT_TOKEN));
  yield put(fetchAppInfoAction());
  yield put(fetchUserAction());
  const userResult = yield take([FETCH_USER_SUCCESS, FETCH_USER_ERROR]);
  if (!userResult.error) {
    const { payload: activeProjectKey } = yield take(SET_ACTIVE_PROJECT_KEY);
    yield put(fetchProjectAction(activeProjectKey));
    yield take(FETCH_PROJECT_SUCCESS);
    yield put(fetchPluginsAction());
    yield put(fetchGlobalIntegrationsAction());
    yield put(authSuccessAction());
  } else {
    yield put(resetTokenAction());
    yield put(fetchPublicPluginsAction());
  }
  yield put(setInitialDataReadyAction());
}

function* watchFetchInitialData() {
  yield takeEvery(FETCH_INITIAL_DATA, fetchInitialData);
}

export function* initialDataSagas() {
  yield all([watchFetchInitialData()]);
}

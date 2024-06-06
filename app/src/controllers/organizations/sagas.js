/*
 * Copyright 2024 EPAM Systems
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

import { takeEvery, all, put } from 'redux-saga/effects';
import { URLS } from 'common/urls';
import { showDefaultErrorNotification } from 'controllers/notification';
import { fetchDataAction } from 'controllers/fetch';
import { organizationSagas } from 'controllers/organizations/organization/sagas';
import { FETCH_ORGANIZATIONS, NAMESPACE } from './constants';

function* fetchOrganizations() {
  try {
    yield put(fetchDataAction(NAMESPACE)(URLS.organizationList()));
  } catch (error) {
    yield put(showDefaultErrorNotification(error));
  }
}

function* watchFetchOrganizations() {
  yield takeEvery(FETCH_ORGANIZATIONS, fetchOrganizations);
}

export function* organizationsSagas() {
  yield all([watchFetchOrganizations(), organizationSagas()]);
}

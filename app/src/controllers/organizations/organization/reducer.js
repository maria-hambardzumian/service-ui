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

import { combineReducers } from 'redux';
import { fetchReducer } from 'controllers/fetch';
import { loadingReducer } from 'controllers/loading';
import { FETCH_ORGANIZATION_BY_SLUG, FETCH_ORGANIZATION_PROJECTS } from './constants';

export const organizationReducer = combineReducers({
  projects: fetchReducer(FETCH_ORGANIZATION_PROJECTS, { contentPath: 'content' }),
  activeOrganization: fetchReducer(FETCH_ORGANIZATION_BY_SLUG, {
    contentPath: 'items',
    getFirst: true,
    initialState: null,
  }),
  organizationLoading: loadingReducer(FETCH_ORGANIZATION_BY_SLUG),
});

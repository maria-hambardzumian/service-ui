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

import { getBasicClickEventParameters } from '../common/ga4Utils';

const ORGANIZATION_PAGE = 'organization';

const BASIC_EVENT_PARAMETERS = getBasicClickEventParameters(ORGANIZATION_PAGE);

export const ORGANIZATION_PAGE_EVENTS = {
  SEARCH_ORGANIZATION_FIELD: {
    ...BASIC_EVENT_PARAMETERS,
    place: 'all_organizations',
    element_name: 'search',
  },
  SEARCH_ORGANIZATION_USERS_FIELD: {
    ...BASIC_EVENT_PARAMETERS,
    place: 'all_users',
    element_name: 'search',
  },
};

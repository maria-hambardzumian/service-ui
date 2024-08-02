/*
 * Copyright 2021 EPAM Systems
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

import { formatSortingString, SORTING_DESC } from 'controllers/sorting';
import { createQueryParametersSelector } from 'controllers/pages';

const domainSelector = (state) => state.uniqueErrors || {};

export const pageLoadingSelector = (state) => domainSelector(state).pageLoading;
export const loadingSelector = (state) => domainSelector(state).loading;
export const clustersSelector = (state) => domainSelector(state).clusters || [];
export const uniqueErrorsPaginationSelector = (state) => domainSelector(state).pagination;

export const DEFAULT_SORTING = formatSortingString(['matchedTests'], SORTING_DESC);
export const queryParametersSelector = createQueryParametersSelector({
  defaultSorting: DEFAULT_SORTING,
});

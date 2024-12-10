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

import { createSelector } from 'reselect';
import { extractNamespacedQuery } from 'common/utils/routingUtils';
import { DEFAULT_PAGINATION, SIZE_KEY, PAGE_KEY } from 'controllers/pagination/constants';
import { SORTING_KEY, SORTING_ORDER_KEY } from 'controllers/sorting/constants';
import { getStorageItem } from 'common/utils/storageUtils';
import {
  activeProjectSelector,
  assignedOrganizationsSelector,
  assignedProjectsSelector,
  userAccountRoleSelector,
  userIdSelector,
} from 'controllers/user';
import { ALL } from 'common/constants/reservedFilterIds';
import { ADMINISTRATOR } from 'common/constants/accountRoles';
import { MANAGER } from 'common/constants/projectRoles';
import { getAlternativePaginationAndSortParams } from 'controllers/pagination';
import { findAssignedProjectByOrganization } from 'common/utils';
import { pageNames, NO_PAGE } from './constants';
import { stringToArray } from './utils';

export const locationSelector = (state) => state.location || {};
export const payloadSelector = (state) => locationSelector(state).payload || {};
export const searchStringSelector = (state) => locationSelector(state).search || '';
export const isInitialDispatchDoneSelector = (state) => !!locationSelector(state).kind;
export const currentPathSelector = (state) => {
  const { pathname, search } = locationSelector(state);
  return `${pathname}${search || ''}`;
};

export const activeDashboardIdSelector = (state) => payloadSelector(state).dashboardId;
export const suiteIdSelector = (state) => payloadSelector(state).suiteId;
export const filterIdSelector = (state) => payloadSelector(state).filterId || ALL;
export const testItemIdsSelector = (state) =>
  payloadSelector(state).testItemIds && String(payloadSelector(state).testItemIds);
export const testItemIdsArraySelector = createSelector(
  testItemIdsSelector,
  (itemIdsString) => itemIdsString?.split('/').map((item) => item) || [],
);
export const logItemIdSelector = createSelector(
  testItemIdsArraySelector,
  (itemIdsArray) => Number(itemIdsArray.length && itemIdsArray[itemIdsArray.length - 1]) || 0,
);

export const settingsTabSelector = (state) => payloadSelector(state).settingsTab;
export const pluginsTabSelector = (state) => payloadSelector(state).pluginsTab;

export const pluginPageSelector = (state) => payloadSelector(state).pluginPage;
export const pluginRouteSelector = (state) => payloadSelector(state).pluginRoute;

export const userProfileRouteSelector = (state) => payloadSelector(state).profileRoute;

export const pageSelector = (state) => pageNames[state.location.type] || NO_PAGE;
export const projectSectionSelector = (state) => payloadSelector(state).projectSection || '';
export const querySelector = createSelector(locationSelector, (location) => location.query || {});

const commonPagePropertiesSelector = (query, namespace, mapping = undefined) => {
  if (!query) {
    return {};
  }

  const extractedQuery = namespace ? extractNamespacedQuery(query, namespace) : query;

  if (!mapping) {
    return extractedQuery;
  }

  const result = {};
  Object.keys(mapping).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(extractedQuery, key)) {
      const propertyName = mapping[key];
      result[propertyName] = extractedQuery[key];
    }
  });
  return result;
};

export const pagePropertiesSelector = (state, namespace, mapping) => {
  const query = querySelector(state);
  return commonPagePropertiesSelector(query, namespace, mapping);
};

export const prevPagePropertiesSelector = (
  {
    location: {
      prev: { query },
    },
  },
  namespace,
  mapping,
) => commonPagePropertiesSelector(query, namespace, mapping);

export const createQueryParametersSelector = ({
  namespace: staticNamespace,
  defaultPagination,
  defaultSorting,
  sortingKey = SORTING_KEY,
} = {}) => (state, namespace) => {
  const calculatedNamespace = staticNamespace || namespace;
  const calculatedPagination = defaultPagination || DEFAULT_PAGINATION;
  const query = pagePropertiesSelector(state, calculatedNamespace);
  const queryParameters = {
    ...calculatedPagination,
    [sortingKey]: defaultSorting || '',
    ...query,
  };
  const defaultPageSize = calculatedPagination[SIZE_KEY];
  if (Number(queryParameters[SIZE_KEY]) < 0) {
    queryParameters[SIZE_KEY] = defaultPageSize;
  }
  if (Number(queryParameters[PAGE_KEY]) < 0) {
    queryParameters[PAGE_KEY] = calculatedPagination[PAGE_KEY];
  }
  if ((!query[SIZE_KEY] || Number(query[SIZE_KEY]) < 0) && calculatedNamespace) {
    const userId = userIdSelector(state);
    const userSettings = getStorageItem(`${userId}_settings`) || {};
    queryParameters[SIZE_KEY] = userSettings[`${calculatedNamespace}PageSize`] || defaultPageSize;
  }

  return queryParameters;
};

export const createAlternativeQueryParametersSelector = ({
  defaultPagination,
  defaultSorting,
  sortingKey,
  namespace,
} = {}) =>
  createSelector(
    createQueryParametersSelector({
      defaultPagination,
      defaultSorting,
      sortingKey,
      namespace,
    }),
    ({ [SIZE_KEY]: limit, [SORTING_ORDER_KEY]: sort, [PAGE_KEY]: pageNumber, ...rest }) => {
      return { ...getAlternativePaginationAndSortParams(sort, limit, pageNumber), ...rest };
    },
  );

export const launchIdSelector = (state) => {
  const testItemIds = testItemIdsArraySelector(state);
  return testItemIds?.[0];
};

export const pathnameChangedSelector = (state) => {
  const pathName = state.location.pathname;
  const prevPathName = state.location.prev.pathname;
  return pathName !== prevPathName;
};

export const prevTestItemSelector = ({ location }) => {
  const currentPath = stringToArray(location.payload.testItemIds, '/');
  const prevPath = stringToArray(location.prev.payload.testItemIds, '/');
  if (currentPath.length >= prevPath.length) return null;
  return parseInt(prevPath[currentPath.length], 10);
};

export const urlProjectSlugSelector = (state) => payloadSelector(state).projectSlug || '';

export const urlOrganizationSlugSelector = (state) => payloadSelector(state).organizationSlug || '';

export const urlOrganizationAndProjectSelector = createSelector(
  [urlOrganizationSlugSelector, urlProjectSlugSelector, activeProjectSelector],
  (organizationSlug, projectSlug, activeProject) => {
    if (organizationSlug && projectSlug) {
      return {
        organizationSlug,
        projectSlug,
      };
    }

    return activeProject;
  },
);

// TODO: User role selectors are stored here due to circular dependency
export const activeProjectRoleSelector = createSelector(
  urlProjectSlugSelector,
  assignedProjectsSelector,
  (projectSlug, assignedProjects) => {
    const assignedProject = Object.values(assignedProjects || {}).find(
      (project) => project.projectSlug === projectSlug,
    );

    return assignedProject?.projectRole;
  },
);

const activeOrganizationRoleSelector = createSelector(
  urlOrganizationSlugSelector,
  assignedOrganizationsSelector,
  (organizationSlug, assignedOrganizations) => {
    const assignedOrganization = assignedOrganizations[organizationSlug];

    return assignedOrganization?.organizationRole;
  },
);

export const userRolesSelector = createSelector(
  userAccountRoleSelector,
  activeOrganizationRoleSelector,
  activeProjectRoleSelector,
  (userRole, organizationRole, projectRole) => ({
    userRole,
    organizationRole,
    projectRole,
  }),
);

export const userAssignedSelector = (projectSlug, organizationSlug) => (state) => {
  const assignedOrganizations = assignedOrganizationsSelector(state);
  const assignedProjects = assignedProjectsSelector(state);
  const { userRole, organizationRole } = userRolesSelector(state);

  const isAdmin = userRole === ADMINISTRATOR;
  const isManager = organizationRole === MANAGER;
  let isAssignedToTargetOrganization = false;

  const assignedProject = findAssignedProjectByOrganization(
    assignedProjects,
    assignedOrganizations[organizationSlug]?.organizationId,
    projectSlug,
  );

  if (organizationSlug) {
    isAssignedToTargetOrganization = organizationSlug in assignedOrganizations;
  } else {
    const organizationId = assignedProject?.organizationId || '';

    isAssignedToTargetOrganization = Object.keys(assignedOrganizations).some(
      (key) => assignedOrganizations[key]?.organizationId === organizationId,
    );
  }

  const isAssignedToTargetProject =
    projectSlug && assignedProject && isAssignedToTargetOrganization;

  const assignmentNotRequired = isAdmin || (isManager && isAssignedToTargetOrganization);

  const hasPermission = isAssignedToTargetProject || assignmentNotRequired;

  const assignedProjectKey = assignedProject?.projectKey;

  return {
    isAdmin,
    hasPermission,
    assignedProjectKey,
    assignmentNotRequired,
    isAssignedToTargetProject,
    isAssignedToTargetOrganization,
  };
};

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

import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { CONDITION_BETWEEN } from 'components/filterEntities/constants';
import {
  FilterButton,
  LAUNCHES_FILTER_NAME,
  TEAMMATES_FILTER_NAME,
  LAST_RUN_DATE_FILTER_NAME,
  LAUNCHES_FILTER_NAME_CONDITION,
  TEAMMATES_FILTER_NAME_CONDITION,
  getRangeComparisons,
  getTimeRange,
  messages as helpMessage,
} from 'components/main/filterButton';
import { fetchFilteredProjectAction } from 'controllers/organization/projects';
import { messages } from './messages';

export const ProjectsFilter = ({
  entities,
  onFilterChange,
  appliedFiltersCount,
  setAppliedFiltersCount,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const timeRange = getTimeRange(formatMessage);
  const rangeComparisons = getRangeComparisons(formatMessage);

  const filters = {
    [LAST_RUN_DATE_FILTER_NAME]: {
      filterName: LAST_RUN_DATE_FILTER_NAME,
      title: formatMessage(messages.lastRunDate),
      defaultCondition: CONDITION_BETWEEN.toUpperCase(),
      fields: [
        {
          value: timeRange[0].value,
          options: timeRange,
          placeholder: formatMessage(messages.lastRunDatePlaceholder),
          name: LAST_RUN_DATE_FILTER_NAME,
        },
      ],
    },
    [LAUNCHES_FILTER_NAME]: {
      filterName: LAUNCHES_FILTER_NAME,
      title: formatMessage(messages.launches),
      helpText: formatMessage(helpMessage.helpText),
      fields: [
        {
          options: rangeComparisons,
          condition: rangeComparisons[0].value,
          name: LAUNCHES_FILTER_NAME_CONDITION,
        },
        {
          value: '',
          placeholder: formatMessage(messages.launchesPlaceholder),
          name: LAUNCHES_FILTER_NAME,
          type: 'number',
        },
      ],
    },
    [TEAMMATES_FILTER_NAME]: {
      filterName: TEAMMATES_FILTER_NAME,
      title: formatMessage(messages.users),
      helpText: formatMessage(helpMessage.helpText),
      fields: [
        {
          options: rangeComparisons,
          condition: rangeComparisons[0].value,
          name: TEAMMATES_FILTER_NAME_CONDITION,
        },
        {
          value: '',
          placeholder: formatMessage(messages.usersPlaceholder),
          name: TEAMMATES_FILTER_NAME,
          type: 'number',
        },
      ],
    },
  };

  const initialFilterState = {
    [LAST_RUN_DATE_FILTER_NAME]: entities[LAST_RUN_DATE_FILTER_NAME]?.value || timeRange[0].value,
    [LAUNCHES_FILTER_NAME]: entities[LAUNCHES_FILTER_NAME]?.value || '',
    [LAUNCHES_FILTER_NAME_CONDITION]:
      entities[LAUNCHES_FILTER_NAME]?.condition || rangeComparisons[0].value,
    [TEAMMATES_FILTER_NAME]: entities[TEAMMATES_FILTER_NAME]?.value || '',
    [TEAMMATES_FILTER_NAME_CONDITION]:
      entities[TEAMMATES_FILTER_NAME]?.condition || rangeComparisons[0].value,
  };

  return (
    <FilterButton
      defaultFilters={filters}
      appliedFiltersCount={appliedFiltersCount}
      setAppliedFiltersCount={setAppliedFiltersCount}
      definedFilters={entities}
      onFilterChange={onFilterChange}
      initialState={initialFilterState}
      filteredAction={() => dispatch(fetchFilteredProjectAction())}
    />
  );
};

ProjectsFilter.propTypes = {
  entities: PropTypes.objectOf(
    PropTypes.shape({
      filter_key: PropTypes.string,
      value: PropTypes.string,
      condition: PropTypes.string,
    }),
  ),
  onFilterChange: PropTypes.func.isRequired,
  appliedFiltersCount: PropTypes.number.isRequired,
  setAppliedFiltersCount: PropTypes.func.isRequired,
};

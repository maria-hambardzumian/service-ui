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

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Popover, FilterOutlineIcon, FilterFilledIcon } from '@reportportal/ui-kit';
import { FilterContent } from './filterContent';
import styles from './filterButton.scss';

const cx = classNames.bind(styles);

export const FilterButton = ({
  definedFilters = {},
  onFilterChange,
  appliedFiltersCount,
  setAppliedFiltersCount,
  defaultFilters,
  initialState,
  filteredAction,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const { name, ...filters } = definedFilters;
    setAppliedFiltersCount(Object.keys(filters).length);
    filteredAction();
  }, []);

  return (
    <Popover
      content={
        <FilterContent
          setIsOpen={setIsOpen}
          setAppliedFiltersCount={setAppliedFiltersCount}
          onFilterChange={onFilterChange}
          defaultFilters={defaultFilters}
          filteredAction={filteredAction}
          initialState={initialState}
        />
      }
      placement="bottom-end"
      className={cx('filter-popover')}
      isOpened={isOpen}
      setIsOpened={setIsOpen}
    >
      <div
        className={cx('filters-icon-container', {
          'with-applied': appliedFiltersCount,
          opened: isOpen,
        })}
        tabIndex={0}
      >
        <i className={cx('filter-icon')}>
          {appliedFiltersCount ? <FilterFilledIcon /> : <FilterOutlineIcon />}
        </i>
        {appliedFiltersCount ? (
          <span className={cx('filters-count')}>{appliedFiltersCount}</span>
        ) : null}
      </div>
    </Popover>
  );
};

FilterButton.propTypes = {
  definedFilters: PropTypes.objectOf(
    PropTypes.shape({
      filter_key: PropTypes.string,
      value: PropTypes.string,
      condition: PropTypes.string,
    }),
  ),
  onFilterChange: PropTypes.func,
  appliedFiltersCount: PropTypes.number,
  setAppliedFiltersCount: PropTypes.func,
  defaultFilters: PropTypes.object,
  initialState: PropTypes.object.isRequired,
  filteredAction: PropTypes.func.isRequired,
};

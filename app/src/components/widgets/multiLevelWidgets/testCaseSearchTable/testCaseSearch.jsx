/*
 * Copyright 2025 EPAM Systems
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

import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTracking } from 'react-tracking';
import { useDispatch, useSelector } from 'react-redux';
import { WIDGETS_EVENTS } from 'analyticsEvents/dashboardsPageEvents';
import { SORTING_ASC, SORTING_DESC } from 'controllers/sorting';
import { activeDashboardIdSelector } from 'controllers/pages';
import {
  loadMoreSearchedItemsAction,
  searchedTestItemsSelector,
  testItemsSearchAction,
} from 'controllers/testItem';
import { TestCaseSearchControl } from './testCaseSearchControl';
import { TestCaseSearchContent } from './testCaseSearchContent';
import styles from './testCaseSearch.scss';

const MAXIMUM_ITEMS = 300;

const cx = classNames.bind(styles);
export const TestCaseSearch = ({ widget: { id: widgetId }, isDisplayedLaunches }) => {
  const dashboardId = useSelector(activeDashboardIdSelector);
  const searchDetails = useSelector(searchedTestItemsSelector);
  const targetWidgetSearch = searchDetails[widgetId] || {};
  const {
    searchCriteria = {},
    sortingDirection: initialDirection = SORTING_DESC,
    content = [],
    page = {},
    loading = false,
  } = targetWidgetSearch;
  const [searchValue, setSearchValue] = useState(searchCriteria);
  const [sortingDirection, setSortingDirection] = useState(initialDirection);

  const dispatch = useDispatch();
  const { trackEvent } = useTracking();

  const isSearchValueEmpty = !Object.keys(searchValue).length;
  const isLoadMoreAvailable = page?.hasNext && content.length > 0 && content.length < MAXIMUM_ITEMS;
  const handleSearch = (entity) => {
    setSearchValue(entity);
  };
  const handleClear = () => {
    setSearchValue({});
  };
  const handleChangeSorting = () => {
    setSortingDirection(sortingDirection === SORTING_DESC ? SORTING_ASC : SORTING_DESC);
  };
  const handleLoadMore = () => {
    trackEvent(WIDGETS_EVENTS.clickOnLoadMoreSearchItems(dashboardId, !!searchValue?.name?.value));
    dispatch(loadMoreSearchedItemsAction(widgetId));
  };

  useEffect(() => {
    if (isSearchValueEmpty) return;
    dispatch(
      testItemsSearchAction({
        searchParams: { searchCriteria: searchValue, sortingDirection },
        widgetId,
      }),
    );
  }, [searchValue, sortingDirection]);

  return (
    <div className={cx('test-case-search-container')}>
      <TestCaseSearchControl
        filter={searchValue}
        setFilter={setSearchValue}
        onChange={handleSearch}
        onClear={handleClear}
      />
      <TestCaseSearchContent
        listView={isDisplayedLaunches}
        isEmptyState={isSearchValueEmpty}
        data={content}
        loading={loading}
        sortingDirection={sortingDirection}
        onChangeSorting={handleChangeSorting}
        onLoadMore={isLoadMoreAvailable ? handleLoadMore : null}
      />
    </div>
  );
};

TestCaseSearch.propTypes = {
  widget: PropTypes.object,
  isDisplayedLaunches: PropTypes.bool,
};

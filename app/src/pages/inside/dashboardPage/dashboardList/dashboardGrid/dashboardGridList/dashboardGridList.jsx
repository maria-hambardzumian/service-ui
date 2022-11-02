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

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';
import { DashboardGridItem } from 'pages/inside/dashboardPage/dashboardList/dashboardGrid/dashboardGridItem';
import { EmptyDashboards } from 'pages/inside/dashboardPage/dashboardList/EmptyDashboards';
import styles from './dashboardGridList.scss';

const cx = classNames.bind(styles);

export const DashboardGridList = ({
  name,
  dashboardList,
  onEditItem,
  onDeleteItem,
  onAddItem,
  userInfo,
  loading,
  filter,
  ...rest
}) => {
  const noItems = loading ? (
    <SpinningPreloader />
  ) : (
    <EmptyDashboards filter={filter} action={onAddItem} />
  );
  return (
    <div className={cx('dashboard-grid-body')}>
      {!loading && dashboardList.length
        ? dashboardList.map((item) => (
            <DashboardGridItem
              key={item.id}
              item={item}
              onEdit={onEditItem}
              onDelete={onDeleteItem}
              currentUser={userInfo}
              {...rest}
            />
          ))
        : noItems}
    </div>
  );
};

DashboardGridList.propTypes = {
  name: PropTypes.string,
  dashboardList: PropTypes.array,
  onEditItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onAddItem: PropTypes.func,
  userInfo: PropTypes.object,
  loading: PropTypes.bool,
  filter: PropTypes.string,
};
DashboardGridList.defaultProps = {
  name: '',
  dashboardList: [],
  onEditItem: () => {},
  onDeleteItem: () => {},
  onAddItem: () => {},
  userInfo: () => {},
  loading: false,
  filter: '',
};

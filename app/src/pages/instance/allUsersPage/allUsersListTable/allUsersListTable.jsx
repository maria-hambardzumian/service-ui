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

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { AbsRelTime } from 'components/main/absRelTime';
import { MeatballMenuIcon, Popover } from '@reportportal/ui-kit';
import { UserAvatarWithNewApi } from 'pages/inside/common/userAvatar';
import { userInfoSelector } from 'controllers/user';
import { getRoleBadgesData } from 'common/utils/permissions/getRoleTitle';
import { NAMESPACE } from 'controllers/instance/allUsers/constants';
import { UserNameCell } from 'pages/common/membersPage/userNameCell/userNameCell';

import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGINATION,
  PAGE_KEY,
  withPagination,
} from 'controllers/pagination';
import { SORTING_ASC, withSortingURL } from 'controllers/sorting';
import {
  DEFAULT_SORT_COLUMN,
  allUsersPaginationSelector,
  fetchAllUsersAction,
} from 'controllers/instance/allUsers';
import { MembersListTable } from 'pages/common/users/membersListTable';
import { messages } from 'pages/common/users/membersListTable/messages';
import styles from './allUsersListTable.scss';

const cx = classNames.bind(styles);
const AllUsersListTableComponent = ({
  users,
  onChangeSorting,
  sortingDirection,
  pageSize,
  activePage,
  itemCount,
  pageCount,
  onChangePage,
  onChangePageSize,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const currentUser = useSelector(userInfoSelector);

  const renderRowActions = () => (
    <Popover
      placement={'bottom-end'}
      content={
        <div className={cx('row-action-menu')}>
          <p>Manage assignments</p>
        </div>
      }
    >
      <i className={cx('menu-icon')}>
        <MeatballMenuIcon />
      </i>
    </Popover>
  );

  const data = useMemo(
    () =>
      users.map((user) => {
        const organizationsCount = Object.keys(user.assignedOrganizations || {}).length;
        const isCurrentUser = user.id === currentUser.id;
        const memberBadges = getRoleBadgesData(user.userRole, null, isCurrentUser);

        return {
          id: user.id,
          fullName: {
            content: user.fullName,
            component: (
              <UserNameCell user={user} badges={memberBadges} userAvatar={UserAvatarWithNewApi} />
            ),
          },
          email: user.email,
          lastLogin: {
            content: user.metadata?.last_login,
            component: user.metadata?.last_login ? (
              <AbsRelTime startTime={user.metadata.last_login} customClass={cx('date')} />
            ) : (
              <span>n/a</span>
            ),
          },
          accountType: user.accountType.toLowerCase(),
          organizations: organizationsCount,
        };
      }),
    [users, currentUser.id],
  );

  const primaryColumn = {
    key: 'fullName',
    header: formatMessage(messages.name),
  };

  const fixedColumns = [
    {
      key: 'email',
      header: formatMessage(messages.email),
      width: 208,
      align: 'left',
    },
    {
      key: 'lastLogin',
      header: formatMessage(messages.lastLogin),
      width: 156,
      align: 'left',
    },
    {
      key: 'accountType',
      header: formatMessage(messages.role),
      width: 114,
      align: 'left',
    },
    {
      key: 'organizations',
      header: formatMessage(messages.projects),
      width: 104,
      align: 'right',
    },
  ];

  const onTableSorting = ({ key }) => {
    onChangeSorting(key);
    dispatch(fetchAllUsersAction());
  };

  return (
    <MembersListTable
      data={data}
      primaryColumn={primaryColumn}
      fixedColumns={fixedColumns}
      onTableSorting={onTableSorting}
      showPagination={users.length > 0}
      sortingDirection={sortingDirection}
      pageSize={pageSize}
      activePage={activePage}
      itemCount={itemCount}
      pageCount={pageCount}
      onChangePage={onChangePage}
      onChangePageSize={onChangePageSize}
      renderRowActions={renderRowActions}
    />
  );
};

AllUsersListTableComponent.propTypes = {
  users: PropTypes.array,
  sortingDirection: PropTypes.string,
  onChangeSorting: PropTypes.func,
  pageSize: PropTypes.number,
  activePage: PropTypes.number,
  itemCount: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangePageSize: PropTypes.func.isRequired,
};

AllUsersListTableComponent.defaultProps = {
  users: [],
  pageSize: DEFAULT_PAGE_SIZE,
  activePage: DEFAULT_PAGINATION[PAGE_KEY],
};

export const AllUsersListTable = withSortingURL({
  defaultFields: [DEFAULT_SORT_COLUMN],
  defaultDirection: SORTING_ASC,
  namespace: NAMESPACE,
})(
  withPagination({
    paginationSelector: allUsersPaginationSelector,
    namespace: NAMESPACE,
  })(AllUsersListTableComponent),
);

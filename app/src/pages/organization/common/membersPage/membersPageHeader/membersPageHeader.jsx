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

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './membersPageHeader.scss';

const cx = classNames.bind(styles);

export const MembersPageHeader = ({ title, children }) => {
  return (
    <div className={cx('members-page-header-container')}>
      <div className={cx('header')}>
        <span className={cx('title')}>{title}</span>
        {children}
      </div>
    </div>
  );
};

MembersPageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

MembersPageHeader.defaultProps = {
  children: null,
};

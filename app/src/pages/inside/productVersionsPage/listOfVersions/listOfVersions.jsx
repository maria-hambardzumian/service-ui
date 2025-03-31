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

import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

import styles from './listOfVersions.scss';
import { EmptyState } from './emptyState';
import { Content } from './content';

const cx = classNames.bind(styles);

export const ListOfVersions = ({ openCreateProductVersionModal, versions }) => (
  <div
    className={cx('list-of-versions', {
      'list-of-versions--empty': isEmpty(versions),
    })}
  >
    {isEmpty(versions) ? (
      <EmptyState openCreateProductVersionModal={openCreateProductVersionModal} />
    ) : (
      <Content versions={versions} />
    )}
  </div>
);

ListOfVersions.propTypes = {
  openCreateProductVersionModal: PropTypes.func.isRequired,
  versions: PropTypes.array,
};

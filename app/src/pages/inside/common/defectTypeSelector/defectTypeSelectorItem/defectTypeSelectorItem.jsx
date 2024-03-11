/*
 * Copyright 2023 EPAM Systems
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
import styles from './defectTypeSelectorItem.scss';

const cx = classNames.bind(styles);

export const DefectTypeSelectorItem = ({
  defectType,
  onClick,
  isSelected,
  className,
  isNarrowView,
  isHighlighted,
}) => {
  return (
    <div
      onClick={onClick}
      className={cx(
        'defect-type-selector-item',
        {
          selected: isSelected,
          highlighted: isHighlighted,
        },
        className,
      )}
      title={defectType.longName}
    >
      <div className={cx('defect-type-circle')} style={{ backgroundColor: defectType.color }} />
      <div className={cx('defect-type-name')} title={isNarrowView && defectType.longName}>
        {!isNarrowView ? defectType.longName : defectType.shortName}
      </div>
    </div>
  );
};
DefectTypeSelectorItem.propTypes = {
  defectType: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  className: PropTypes.string,
  isNarrowView: PropTypes.bool,
  isHighlighted: PropTypes.bool,
};
DefectTypeSelectorItem.defaultProps = {
  onClick: () => {},
  isSelected: false,
  className: '',
  isNarrowView: false,
  isHighlighted: false,
};

/*
 * Copyright 2022 EPAM Systems
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

import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useOnClickOutside } from 'common/hooks';
import styles from './popover.scss';

const cx = classNames.bind(styles);
const TRIANGLE_SIZE = 9;
const SAFE_ZONE = 4;

export const Popover = ({
  children,
  title,
  side,
  arrowPosition,
  dataAutomationId,
  onClose,
  parentRef,
  variant,
  popoverClassName,
  arrowVerticalPosition,
  topPosition,
  arrowVerticalOffset,
}) => {
  const popoverRef = useRef();
  const [top, setTop] = useState(topPosition);
  const [left, setLeft] = useState(0);
  const isNotDefaultTopPosition = !topPosition;

  useOnClickOutside(parentRef, onClose);

  useLayoutEffect(() => {
    const { current: parent } = parentRef;
    const parentTop = parent.offsetTop;
    const parentLeft = parent.offsetLeft;
    const parentHeight = parent.offsetHeight;
    const parentWidth = parent.offsetWidth;

    const { current: popover } = popoverRef;
    const popoverHeight = popover.offsetHeight;
    const popoverWidth = popover.offsetWidth;

    const setHorizontalPosition = () => {
      switch (arrowPosition) {
        case 'right': {
          setLeft(parentLeft + parentWidth / 2 - popoverWidth + TRIANGLE_SIZE + 16);
          break;
        }
        case 'middle': {
          setLeft(parentLeft + parentWidth / 2 - popoverWidth / 2);
          break;
        }
        case 'left':
        default: {
          setLeft(parentLeft + parentWidth / 2 - TRIANGLE_SIZE - 16);
        }
      }
    };

    const setVerticalMiddlePosition = () => {
      setTop(parentTop + parentHeight / 2 - popoverHeight / 2);
    };

    switch (side) {
      case 'bottom': {
        isNotDefaultTopPosition && setTop(parentTop + parentHeight + SAFE_ZONE + TRIANGLE_SIZE);
        setHorizontalPosition();
        break;
      }
      case 'top': {
        isNotDefaultTopPosition && setTop(parentTop - SAFE_ZONE - TRIANGLE_SIZE - popoverHeight);
        setHorizontalPosition();
        break;
      }
      case 'right': {
        isNotDefaultTopPosition && setVerticalMiddlePosition();
        setLeft(parentLeft + parentWidth + SAFE_ZONE + TRIANGLE_SIZE);
        break;
      }
      case 'left':
      default: {
        isNotDefaultTopPosition && setVerticalMiddlePosition();
        setLeft(parentLeft - SAFE_ZONE - TRIANGLE_SIZE - popoverWidth);
      }
    }
  }, [parentRef, side, arrowPosition, isNotDefaultTopPosition]);

  const className = cx(
    'popover',
    `side-${side}`,
    `position-${arrowPosition}`,
    variant,
    popoverClassName,
    {
      [`position-${arrowVerticalPosition}`]: arrowVerticalPosition,
    },
  );

  return (
    <div
      className={className}
      data-automation-id={dataAutomationId}
      ref={popoverRef}
      style={{ top, left, '--arrow-offset': `${arrowVerticalOffset}px` }}
    >
      {title && <div className={cx('title')}>{title}</div>}
      <div className={cx('content')}>{children}</div>
    </div>
  );
};

Popover.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  side: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  arrowPosition: PropTypes.oneOf(['left', 'middle', 'right']),
  dataAutomationId: PropTypes.string,
  onClose: PropTypes.func,
  parentRef: PropTypes.shape({ current: PropTypes.object }),
  popoverClassName: PropTypes.string,
  variant: PropTypes.oneOf(['light', 'dark']),
  arrowVerticalPosition: PropTypes.oneOfType([
    PropTypes.oneOf(['vertical-top, vertical-bottom']),
    null,
  ]),
  topPosition: PropTypes.number,
  arrowVerticalOffset: PropTypes.number,
};

Popover.defaultProps = {
  children: null,
  title: '',
  side: 'top',
  arrowPosition: 'left',
  dataAutomationId: '',
  onClose: () => {},
  parentRef: null,
  popoverClassName: '',
  variant: 'light',
  arrowVerticalPosition: null,
  topPosition: 0,
  arrowVerticalOffset: 22,
};

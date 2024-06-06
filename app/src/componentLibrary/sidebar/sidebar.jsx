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

import React, { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useOnClickOutside } from 'common/hooks';
import { SidebarButton } from './sidebarButton';
import styles from './sidebar.scss';

const cx = classNames.bind(styles);

export const Sidebar = ({
  logoBlock,
  createMainBlock,
  items,
  createFooterBlock,
  shouldBeCollapsedOnLeave,
}) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const sidebarRef = useRef(null);

  const onCloseSidebar = () => {
    setIsOpenSidebar(false);
  };

  const handleClickOutside = useCallback(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [isOpenSidebar]);

  useOnClickOutside(sidebarRef, handleClickOutside);

  const onOpenSidebar = () => {
    setIsOpenSidebar(true);
  };

  const onLeaveSidebar = () => {
    if (shouldBeCollapsedOnLeave) {
      onCloseSidebar();
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={cx('sidebar-container', { open: isOpenSidebar })}
      onMouseEnter={onOpenSidebar}
      onMouseLeave={onLeaveSidebar}
    >
      <aside className={cx('sidebar')}>
        {logoBlock}
        <div className={cx('main-block-wrapper')}>
          {createMainBlock(onOpenSidebar, onCloseSidebar)}
        </div>
        {items.length > 0 && (
          <div className={cx('items-block')}>
            {items.map(
              ({ icon, link, onClick, message, name, component }) =>
                component || (
                  <SidebarButton
                    key={component ? name : link.type}
                    icon={icon}
                    link={link}
                    onClick={() => {
                      onClick();
                      onLeaveSidebar();
                    }}
                    message={message}
                  />
                ),
            )}
          </div>
        )}
        <div className={cx('footer-block')}>{createFooterBlock(onOpenSidebar, onCloseSidebar)}</div>
      </aside>
    </div>
  );
};

Sidebar.propTypes = {
  logoBlock: PropTypes.element,
  items: PropTypes.array,
  createMainBlock: PropTypes.func,
  createFooterBlock: PropTypes.func,
  shouldBeCollapsedOnLeave: PropTypes.bool,
};

Sidebar.defaultProps = {
  logoBlock: null,
  createMainBlock: () => {},
  items: [],
  shouldBeCollapsedOnLeave: false,
  createFooterBlock: () => {},
};

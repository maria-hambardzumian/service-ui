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

import { useSelector } from 'react-redux';
import Parser from 'html-react-parser';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormattedMessage } from 'react-intl';
import { Image } from 'components/main/image';
import DefaultUserImage from 'common/img/default-user-avatar.png';
import { photoTimeStampSelector, userInfoSelector } from 'controllers/user';
import { URLS } from 'common/urls';
import { ADMINISTRATOR } from 'common/constants/accountRoles';
import { withPopover } from 'componentLibrary/popover';
import { ProfileMenu } from './profileMenu';
import ArrowRightIcon from '../img/arrow-right-inline.svg';
import styles from './userControl.scss';

const cx = classNames.bind(styles);

const UserControl = ({ onClick }) => {
  const { userRole, fullName, email } = useSelector(userInfoSelector);
  const photoTimeStamp = useSelector(photoTimeStampSelector);

  return (
    <div className={cx('user-block-wrapper')}>
      <button className={cx('avatar-block')} onClick={onClick}>
        <Image
          className={cx('avatar-img')}
          src={URLS.dataPhoto(photoTimeStamp, true)}
          alt="avatar"
          fallback={DefaultUserImage}
        />
      </button>
      <div className={cx('user-control')}>
        <div className={cx('user-details')}>
          <div className={cx('username-wrapper')}>
            <div className={cx('username')}>{fullName}</div>
            <div className={cx('arrow-icon')}>
              {/* TODO: Need to manage this permission via common permission engine */}
              {userRole === ADMINISTRATOR && (
                <div className={cx('admin-badge')}>
                  <FormattedMessage id={'UserBlock.adminBadge'} defaultMessage={'admin'} />
                </div>
              )}
              {Parser(ArrowRightIcon)}
            </div>
          </div>
          <div className={cx('user-email')}>{email}</div>
        </div>
      </div>
    </div>
  );
};

UserControl.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export const UserControlWithPopover = withPopover({
  ContentComponent: ProfileMenu,
  side: 'right',
  arrowPosition: 'middle',
  popoverClassName: cx('popover'),
  popoverWrapperClassName: cx('popover-control'),
  variant: 'dark',
  tabIndex: 0,
})(UserControl);

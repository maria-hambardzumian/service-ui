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
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import track from 'react-tracking';
import { connect } from 'react-redux';
import DOMPurify from 'dompurify';
import { injectIntl, defineMessages } from 'react-intl';
import Link from 'redux-first-router-link';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { authExtensionsSelector } from 'controllers/appInfo';
import { LOGIN_PAGE } from 'controllers/pages';
import { InputDropdown } from 'components/inputs/inputDropdown';
import { BigButton } from 'components/buttons/bigButton';
import { LOGIN_PAGE_EVENTS } from 'components/main/analytics/events/ga4Events/loginPageEvents';
import { PageBlockContainer } from 'pages/outside/common/pageBlockContainer';
import { normalizePathWithPrefix, setWindowLocationToNewPath } from 'pages/outside/common/utils';
import styles from './multipleAuthBlock.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  externalLogin: {
    id: 'MultipleAuthBlock.externalLogin',
    defaultMessage: 'External auth',
  },
  chooseAuth: {
    id: 'MultipleAuthBlock.chooseAuth',
    defaultMessage: 'please choose the necessary auth provider',
  },
  loginWith: {
    id: 'MultipleAuthBlock.loginWith',
    defaultMessage: "you can login with ''<b>{providerName}</b>'' provider",
  },
  wrongAuthType: {
    id: 'MultipleAuthBlock.wrongAuthType',
    defaultMessage: "Couldn't find ''{authType}'' auth type",
  },
});

@connect((state) => ({
  externalAuthExtensions: authExtensionsSelector(state),
}))
@track()
@injectIntl
export class MultipleAuthBlock extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    multipleAuthKey: PropTypes.string,
    externalAuthExtensions: PropTypes.object,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
  };
  static defaultProps = {
    multipleAuthKey: '',
    externalAuthExtensions: {},
  };

  static getDerivedStateFromProps(props, state) {
    if (props.multipleAuthKey !== state.multipleAuthKey) {
      const { externalAuthExtensions, multipleAuthKey } = props;
      const externalAuth = externalAuthExtensions[multipleAuthKey];
      let selectedAuthPath = null;
      let authOptions = [];
      if (externalAuth) {
        const providers = externalAuth.providers;
        authOptions = Object.keys(providers).map((key) => ({
          value: providers[key],
          label: key,
        }));
        selectedAuthPath = authOptions[0].value;
      }

      return {
        multipleAuthKey,
        selectedAuthPath,
        authOptions,
      };
    }

    return null;
  }

  state = {
    selectedAuthPath: null,
    multipleAuthKey: null,
    authOptions: [],
  };

  authPathChangeHandler = (selectedAuthPath) =>
    this.setState({
      selectedAuthPath,
    });

  externalAuthClickHandler = () => {
    const { multipleAuthKey } = this.props;
    const { tracking } = this.props;
    tracking.trackEvent(LOGIN_PAGE_EVENTS.clickOnLoginButton(multipleAuthKey));

    setWindowLocationToNewPath(normalizePathWithPrefix(this.state.selectedAuthPath));
  };

  renderProviders = (isSingleAuth) => {
    const { selectedAuthPath, authOptions } = this.state;
    const {
      intl: { formatMessage },
      multipleAuthKey,
    } = this.props;

    if (selectedAuthPath) {
      return (
        !isSingleAuth && (
          <InputDropdown
            options={authOptions}
            value={selectedAuthPath}
            onChange={this.authPathChangeHandler}
          />
        )
      );
    }

    return formatMessage(messages.wrongAuthType, {
      b: (data) => DOMPurify.sanitize(`<b>${data}</b>`),
      authType: multipleAuthKey,
    });
  };

  render() {
    const { selectedAuthPath, authOptions } = this.state;
    const {
      intl: { formatMessage },
    } = this.props;
    const isSingleAuth = authOptions.length === 1;

    return (
      <PageBlockContainer
        header={messages.externalLogin}
        hint={isSingleAuth ? messages.loginWith : messages.chooseAuth}
        hintParams={{ providerName: authOptions[0] ? authOptions[0].label : '' }}
      >
        {this.renderProviders(isSingleAuth)}
        <div className={cx('actions-block')}>
          <div className={cx('actions-block-button')}>
            <Link to={{ type: LOGIN_PAGE }}>
              <BigButton type={'button'} roundedCorners color={'gray-60'}>
                {formatMessage(COMMON_LOCALE_KEYS.CANCEL)}
              </BigButton>
            </Link>
          </div>
          <div className={cx('actions-block-button')}>
            <BigButton
              type={'button'}
              roundedCorners
              color="booger"
              onClick={this.externalAuthClickHandler}
              disabled={!selectedAuthPath}
            >
              {formatMessage(COMMON_LOCALE_KEYS.LOGIN)}
            </BigButton>
          </div>
        </div>
      </PageBlockContainer>
    );
  }
}

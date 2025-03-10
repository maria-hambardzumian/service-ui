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
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { reduxForm, SubmissionError } from 'redux-form';
import { FieldProvider } from 'components/fields/fieldProvider';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { InputOutside } from 'components/inputs/inputOutside';
import { BigButton } from 'components/buttons/bigButton';
import { commonValidators } from 'common/utils/validation';
import LoginIcon from './img/login-icon-inline.svg';
import NameIcon from './img/name-icon-inline.svg';
import EmailIcon from './img/email-icon-inline.svg';
import PasswordIcon from './img/password-icon-inline.svg';
import styles from './registrationForm.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  login: {
    id: 'RegistrationForm.loginPlaceholder',
    defaultMessage: 'User Name',
  },
  name: {
    id: 'RegistrationForm.namePlaceholder',
    defaultMessage: 'Full Name',
  },
  password: {
    id: 'RegistrationForm.passwordPlaceholder',
    defaultMessage: 'Create Password',
  },
  confirmPassword: {
    id: 'RegistrationForm.passwordConfirmPlaceholder',
    defaultMessage: 'Confirm Password',
  },
  loginConstraint: {
    id: 'RegistrationForm.loginConstraints',
    defaultMessage: 'User Name will be used for log in to the system of ReportPortal',
  },
  nameConstraint: {
    id: 'RegistrationForm.nameConstraints',
    defaultMessage: 'Full Name will be used to identification person in a team',
  },
});

@reduxForm({
  form: 'registration',
  validate: ({ login, name, password, confirmPassword }) => ({
    password: commonValidators.password(password),
    confirmPassword: (!confirmPassword || confirmPassword !== password) && 'confirmPasswordHint',
    login: commonValidators.login(login),
    name: commonValidators.userName(name),
  }),
})
@injectIntl
export class RegistrationForm extends Component {
  static propTypes = {
    submitForm: PropTypes.func,
    intl: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    email: PropTypes.string,
    loading: PropTypes.bool,
    initialData: PropTypes.object,
    submitButtonTitle: PropTypes.string,
  };

  static defaultProps = {
    submitForm: () => {},
    email: '',
    loading: false,
    initialData: {},
    submitButtonTitle: '',
  };

  componentDidMount = () => {
    this.autofillData();
  };

  autofillData = () => {
    const { initialData, email } = this.props;
    this.props.initialize({
      ...initialData,
      name: initialData.fullName,
      confirmPassword: initialData.password,
      email,
    });
  };

  submitHandler = (...args) =>
    this.props.submitForm(...args).catch((message) => {
      throw new SubmissionError({ login: message });
    });

  render() {
    const { handleSubmit, intl, loading, submitButtonTitle } = this.props;
    const { formatMessage } = intl;

    return (
      <form className={cx('registration-form')} onSubmit={handleSubmit(this.submitHandler)}>
        <div className={cx('name-field')}>
          <FieldProvider name="name">
            <FieldErrorHint provideHint={false}>
              <InputOutside
                icon={NameIcon}
                maxLength="256"
                placeholder={formatMessage(messages.name)}
                hasDynamicValidation
                hint={formatMessage(messages.nameConstraint)}
                provideErrorHint
              />
            </FieldErrorHint>
          </FieldProvider>
        </div>
        <div className={cx('login-field')}>
          <FieldProvider name="login">
            <FieldErrorHint provideHint={false}>
              <InputOutside
                icon={LoginIcon}
                maxLength={'128'}
                placeholder={formatMessage(messages.login)}
                hasDynamicValidation
                hint={formatMessage(messages.loginConstraint)}
                provideErrorHint
              />
            </FieldErrorHint>
          </FieldProvider>
        </div>
        <div className={cx('email-field')}>
          <FieldProvider name="email">
            <InputOutside icon={EmailIcon} disabled />
          </FieldProvider>
        </div>
        <div className={cx('password-field')}>
          <FieldProvider name="password">
            <FieldErrorHint provideHint={false}>
              <InputOutside
                type={'password'}
                icon={PasswordIcon}
                maxLength="256"
                placeholder={formatMessage(messages.password)}
                hasDynamicValidation
                provideErrorHint
              />
            </FieldErrorHint>
          </FieldProvider>
        </div>
        <div className={cx('confirm-password-field')}>
          <FieldProvider name="confirmPassword">
            <FieldErrorHint
              formPath={'user.registrationForm'}
              fieldName={'confirmPassword'}
              provideHint={false}
            >
              <InputOutside
                type={'password'}
                icon={PasswordIcon}
                maxLength="256"
                placeholder={formatMessage(messages.confirmPassword)}
                hasDynamicValidation
                provideErrorHint
              />
            </FieldErrorHint>
          </FieldProvider>
        </div>

        <div className={cx('buttons-container')}>
          <div className={cx('button-register')}>
            <BigButton type={'submit'} roundedCorners color={'organish'} disabled={loading}>
              {submitButtonTitle || (
                <FormattedMessage id={'RegistrationForm.register'} defaultMessage={'Register'} />
              )}
            </BigButton>
          </div>
        </div>
      </form>
    );
  }
}

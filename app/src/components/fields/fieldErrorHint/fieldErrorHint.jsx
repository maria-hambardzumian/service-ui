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

import { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { injectIntl, defineMessages } from 'react-intl';
import styles from './fieldErrorHint.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  loginHint: {
    id: 'RegistrationForm.loginHint',
    defaultMessage:
      'User name may contain only Latin, numeric characters, hyphen, underscore, dot (from 1 to 128 symbols)',
  },
  nameHint: {
    id: 'RegistrationForm.nameHint',
    defaultMessage:
      'Full name may contain only Latin, Cyrillic, numeric characters, symbols: hyphen, underscore, dot. Space is permitted (from 3 to 256 symbols)',
  },
  passwordHint: {
    id: 'RegistrationForm.passwordHint',
    defaultMessage:
      'Password should contain at least 4 characters; a special symbol; upper-case (A - Z); lower-case',
  },
  emailHint: {
    id: 'Common.validation.email',
    defaultMessage: 'Email is incorrect. Please enter correct email.',
  },
  confirmPasswordHint: {
    id: 'RegistrationForm.confirmPasswordHint',
    defaultMessage: 'Passwords do not match',
  },
  loginDuplicateHint: {
    id: 'RegistrationForm.loginDuplicateHint',
    defaultMessage: 'Entered login already exists in the system.',
  },
  emailDuplicateHint: {
    id: 'RegistrationForm.emailDuplicateHint',
    defaultMessage: 'Entered email already exists in the system.',
  },
  filterNameError: {
    id: 'FiltersPage.filterNameLength',
    defaultMessage: 'Filter name length should have size from 3 to 128 characters.',
  },
  filterNameDuplicateHint: {
    id: 'FiltersPage.filterNameDuplicateHint',
    defaultMessage: 'Filter with the same name already exists in system.',
  },
  launchNameHint: {
    id: 'LaunchMergeModal.launchNameHint',
    defaultMessage: 'Launch name should have size from 1 to 256.',
  },
  launchDescriptionHint: {
    id: 'LaunchMergeModal.launchDescriptionHint',
    defaultMessage: 'Description should have size not more than 2048 symbols.',
  },
  dashboardNameHint: {
    id: 'AddEditDashboard.dashboardNameHint',
    defaultMessage: 'Dashboard name should have size  from 3 to 128.',
  },
  dashboardNameExistsHint: {
    id: 'AddEditDashboard.dashboardNameExistsHint',
    defaultMessage: 'This name is already in use.',
  },
  dashboardNameSearchHint: {
    id: 'SearchDashboardForm.dashboardNameSearchHint',
    defaultMessage: 'Dashboard name should have size from 3 to 128',
  },
  minShouldMatchHint: {
    id: 'AccuracyFormBlock.minShouldMatchHint',
    defaultMessage: 'The parameter should have value from 50 to 100',
  },
  searchLogsMinShouldMatch: {
    id: 'AccuracyFormBlock.searchLogsMinShouldMatch',
    defaultMessage: 'The parameter should have value from 0 to 100',
  },
  profilePassword: {
    id: 'ChangePasswordModal.profilePassword',
    defaultMessage: 'Password should have size from 4 to 256 symbols',
  },
  profileConfirmPassword: {
    id: 'ChangePasswordModal.profileConfirmPassword',
    defaultMessage: 'Passwords do not match',
  },
  profileUserName: {
    id: 'ChangePasswordModal.profileUserName',
    defaultMessage:
      'Full name should have size from 3 to 256 symbols, latin, cyrillic, numeric characters, hyphen, underscore, dot, space.',
  },
  profileEmail: {
    id: 'ChangePasswordModal.profileEmail',
    defaultMessage: 'Email is incorrect.',
  },
  itemNameEntityHint: {
    id: 'LaunchLevelEntities.itemNameEntityHint',
    defaultMessage: 'At least 3 symbols required',
  },
  launchNumericEntityHint: {
    id: 'LaunchLevelEntities.launchNumberEntityHint',
    defaultMessage: 'This filter accepts only digits',
  },
  descriptionEntityHint: {
    id: 'LaunchLevelEntities.descriptionEntityHint',
    defaultMessage: 'Description should have size from 3 to 18',
  },
  descriptionStepLevelEntityHint: {
    id: 'LaunchLevelEntities.descriptionStepLevelEntityHint',
    defaultMessage: 'Description should have size from 1 to 256',
  },
  demoDataPostfixHint: {
    id: 'DemoDataTabForm.demoDataPostfixHint',
    defaultMessage: 'Postfix should have size from 1 to 90',
  },
  recipientsHint: {
    id: 'AddEditNotificationCaseModal.recipientsHint',
    defaultMessage: 'Please enter existent user name on your project or valid email',
  },
  ruleNameHint: {
    id: 'AddEditNotificationModal.ruleNameHint',
    defaultMessage: "Field is required. Rule name should have size from '1' to '55' characters",
  },
  launchesHint: {
    id: 'AddEditNotificationCaseModal.launchesHint',
    defaultMessage: 'Launch name should have size from 1 to 256',
  },
  urlHint: {
    id: 'LinkIssueModal.urlHint',
    defaultMessage: 'Link should match a valid website address',
  },
  issueIdHint: {
    id: 'LinkIssueModal.issueIdHint',
    defaultMessage: 'Issue ID should have size from 1 to 128',
  },
  requiredFieldHint: {
    id: 'Common.requiredFieldHint',
    defaultMessage: 'Field is required',
  },
  shortRequiredFieldHint: {
    id: 'Common.shortRequiredFieldHint',
    defaultMessage: 'Field is required',
  },
  attributeKeyLengthHint: {
    id: 'AttributeEditor.attributeKeyLengthHint',
    defaultMessage: 'Key should have size from 1 to 512 symbols',
  },
  attributeValueLengthHint: {
    id: 'AttributeEditor.attributeValueLengthHint',
    defaultMessage: 'Value should have size not more than 512 symbols',
  },
  uniqueAttributeKeyHint: {
    id: 'AttributeEditor.uniqueAttributeKeyHint',
    defaultMessage: 'Attribute key should be unique',
  },
  defectLongNameHint: {
    id: 'DefectTypesTab.defectLongNameHint',
    defaultMessage: "Defect Type name should have size from '3' to '55' characters",
  },
  defectShortNameHint: {
    id: 'DefectTypesTab.defectShortNameHint',
    defaultMessage: "Defect Type abbreviation should have size from '1' to '4' characters",
  },
  projectNameLengthHint: {
    id: 'ProjectsPage.projectNameLengthHint',
    defaultMessage:
      'Project name may contain only Latin, numeric characters, hyphen, underscore, dot (from 3 to 256 symbols)',
  },
  projectDuplicateHint: {
    id: 'ProjectsPage.projectDuplicateHint',
    defaultMessage: 'Project with the same name already exists in system',
  },
  btsIntegrationNameHint: {
    id: 'BtsCommonMessages.btsIntegrationNameHint',
    defaultMessage: 'Integration name should have a size from 1 to 55 characters',
  },
  btsUrlHint: {
    id: 'BtsCommonMessages.btsUrlHint',
    defaultMessage: 'Please provide a valid BTS link',
  },
  btsProjectKeyHint: {
    id: 'BtsCommonMessages.btsProjectKeyHint',
    defaultMessage: 'Project key should have size from 1 to 55',
  },
  btsBoardIdHint: {
    id: 'BtsCommonMessages.btsBoardIdHint',
    defaultMessage: 'Board ID should have size from 1 to 55 characters',
  },
  btsProjectIdHint: {
    id: 'BtsCommonMessages.btsProjectIdHint',
    defaultMessage: 'Project ID should have size from 1 to 55',
  },
  btsUserNameHint: {
    id: 'BtsCommonMessages.btsUserNameHint',
    defaultMessage: 'Username should have size from 1 to 55',
  },
  btsPasswordHint: {
    id: 'BtsCommonMessages.btsPasswordHint',
    defaultMessage: 'Password should have size from 1 to 55',
  },
  portFieldHint: {
    id: 'EmailFormFields.portFieldHint',
    defaultMessage: "Only numbers from '1' to '65535' are possible.",
  },
  patternNameLengthHint: {
    id: 'PatternAnalysis.patternNameLengthHint',
    defaultMessage: 'Pattern name should have size from 1 to 55',
  },
  patternNameDuplicateHint: {
    id: 'PatternAnalysis.patternNameDuplicateHint',
    defaultMessage: 'Pattern with the same name already exists in the project',
  },
  ruleNameDuplicateHint: {
    id: 'Notifications.ruleNameDuplicateHint',
    defaultMessage: 'Rule with the same name already exists for this communication channel',
  },
  customColumnsDuplicationHint: {
    id: 'ProductStatusControls.customColumnsDuplicationHint',
    defaultMessage: 'Duplicated column names are prohibited',
  },
  booleanFieldHint: {
    id: 'PostIssueModal.booleanFieldHint',
    defaultMessage: 'This field must have only true/false values',
  },
  doubleFieldHint: {
    id: 'PostIssueModal.doubleFieldHint',
    defaultMessage: "This field must be of 'double' type",
  },
  membersSearchHint: {
    id: 'MembersPageToolbar.membersSearchHint',
    defaultMessage: 'Member name must not be empty',
  },
  descriptionHint: {
    id: 'EditItemModal.descriptionHint',
    defaultMessage: "Description should have size from '0' to '2048' symbols",
  },
  apiKeyNameWrongSizeHint: {
    id: 'GenerateApiKeyModal.apiKeyNameWrongSizeHint',
    defaultMessage: 'API Key name should have size from 1 to 40 characters',
  },
  apiKeyNameUniqueHint: {
    id: 'GenerateApiKeyModal.apiKeyNameUniqueHint',
    defaultMessage: 'API Key with the same name already exists',
  },
  deleteAccountReasonSizeHint: {
    id: 'DeleteAccountFeedbackModal.deleteAccountReasonSizeHint',
    defaultMessage: 'The field should have size not more than 128 symbols.',
  },
});

@injectIntl
export class FieldErrorHint extends Component {
  static propTypes = {
    intl: PropTypes.object,
    hintType: PropTypes.string,
    children: PropTypes.node,
    error: PropTypes.string,
    active: PropTypes.bool,
    staticHint: PropTypes.bool,
    widthContent: PropTypes.bool,
    darkView: PropTypes.bool,
    provideHint: PropTypes.bool,
    touched: PropTypes.bool,
    dataAutomationId: PropTypes.string,
  };

  static defaultProps = {
    intl: {},
    hintType: 'bottom',
    children: null,
    error: '',
    active: false,
    staticHint: false,
    widthContent: false,
    darkView: false,
    provideHint: true,
    touched: false,
    dataAutomationId: '',
  };

  isHintVisible = () => {
    const { error, active, staticHint } = this.props;
    if (staticHint) {
      return !!error;
    }

    return !!error && active;
  };

  render() {
    const {
      hintType,
      children,
      intl,
      error,
      active,
      staticHint,
      widthContent,
      darkView,
      provideHint,
      dataAutomationId,
      ...rest
    } = this.props;
    const classes = cx('field-error-hint', `type-${hintType}`);

    return (
      <div className={classes} data-automation-id={dataAutomationId}>
        {children &&
          cloneElement(children, {
            error: error && messages[error] ? intl.formatMessage(messages[error]) : error,
            active,
            ...rest,
          })}
        {provideHint && (
          <div
            className={cx('hint', `type-${hintType}`, {
              'static-hint': staticHint,
              visible: this.isHintVisible(),
            })}
          >
            <div
              className={cx('hint-content', `type-${hintType}`, {
                'static-hint': staticHint,
                'width-content': widthContent,
                'dark-view': darkView,
              })}
            >
              {error && messages[error] ? intl.formatMessage(messages[error]) : error}
            </div>
          </div>
        )}
      </div>
    );
  }
}

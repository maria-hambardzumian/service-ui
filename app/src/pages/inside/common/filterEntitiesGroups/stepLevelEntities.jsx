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

import { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import PropTypes from 'prop-types';
import { commonValidators, bindMessageToValidator, validate } from 'common/utils/validation';
import { URLS } from 'common/urls';
import { FAILED, PASSED, SKIPPED, INTERRUPTED, IN_PROGRESS } from 'common/constants/launchStatuses';
import {
  BEFORE_SUITE,
  BEFORE_GROUPS,
  BEFORE_CLASS,
  BEFORE_TEST,
  TEST,
  BEFORE_METHOD,
  STEP,
  AFTER_METHOD,
  AFTER_TEST,
  AFTER_CLASS,
  AFTER_GROUPS,
  AFTER_SUITE,
} from 'common/constants/methodTypes';
import {
  EntityInputConditional,
  EntityItemStartTime,
  EntityInputConditionalTags,
  EntityDropdown,
  EntityInputConditionalAttributes,
} from 'components/filterEntities';
import { bindDefaultValue } from 'components/filterEntities/utils';
import {
  CONDITION_CNT,
  CONDITION_BETWEEN,
  CONDITION_HAS,
  CONDITION_IN,
  CONDITION_ANY,
  ENTITY_NAME,
  ENTITY_START_TIME,
  ENTITY_DESCRIPTION,
  ENTITY_STATUS,
  ENTITY_DEFECT_TYPE,
  ENTITY_METHOD_TYPE,
  ENTITY_DEFECT_COMMENT,
  ENTITY_BTS_ISSUES,
  ENTITY_IGNORE_ANALYZER,
  ENTITY_AUTOANALYZE,
  CONDITION_EQ,
  ENTITY_PATTERN_NAME,
  ENTITY_RETRY,
  ENTITY_ATTRIBUTE,
  ENTITY_NEW_FAILURE,
} from 'components/filterEntities/constants';
import { defectTypesSelector, patternsSelector, projectKeySelector } from 'controllers/project';
import { launchIdSelector } from 'controllers/pages';
import {
  getQueryNamespace,
  levelSelector,
  namespaceSelector,
  PROVIDER_TYPE_LAUNCH,
  queryParametersSelector,
} from 'controllers/testItem';
import { pageEventsMap } from 'components/main/analytics';
import { connectRouter } from 'common/utils';
import { createNamespacedQuery } from 'common/utils/routingUtils';
import { PROVIDER_TYPE_BASELINE } from 'controllers/testItem/constants';
import { getGroupedDefectTypesOptions } from 'pages/inside/common/utils';

const messages = defineMessages({
  NameTitle: {
    id: 'StepLevelEntities.NameTitle',
    defaultMessage: 'Test name',
  },
  DescriptionTitle: {
    id: 'StepLevelEntities.DescriptionTitle',
    defaultMessage: 'Description',
  },
  DescriptionPlaceholder: {
    id: 'StepLevelEntities.DescriptionPlaceholder',
    defaultMessage: 'Enter description',
  },
  StatusTitle: {
    id: 'StepLevelEntities.StatusTitle',
    defaultMessage: 'Status',
  },
  RetryTitle: {
    id: 'StepLevelEntities.RetryTitle',
    defaultMessage: 'Retry',
  },
  StartTimeTitle: {
    id: 'StepLevelEntities.StartTimeTitle',
    defaultMessage: 'Start time',
  },
  DefectCommentTitle: {
    id: 'StepLevelEntities.DefectCommentTitle',
    defaultMessage: 'Defect comment',
  },
  DefectCommentPlaceholder: {
    id: 'StepLevelEntities.DefectCommentPlaceholder',
    defaultMessage: 'Enter comment',
  },
  Attribute: {
    id: 'LaunchLevelEntities.AttributeTitle',
    defaultMessage: 'Attribute',
  },
  BtsIssueTitle: {
    id: 'StepLevelEntities.BtsIssueTitle',
    defaultMessage: 'Issue in BTS',
  },
  BtsIssueOption1: {
    id: 'StepLevelEntities.BtsIssueOption1',
    defaultMessage: 'Linked bug',
  },
  BtsIssueOption2: {
    id: 'StepLevelEntities.BtsIssueOption2',
    defaultMessage: 'No linked bug',
  },
  IgnoreAATitle: {
    id: 'StepLevelEntities.IgnoreAATitle',
    defaultMessage: 'Ignore in AA',
  },
  IgnoreAAOption1: {
    id: 'StepLevelEntities.IgnoreAAOption1',
    defaultMessage: 'With "Ignore AA" mark',
  },
  IgnoreAAOption2: {
    id: 'StepLevelEntities.IgnoreAAOption2',
    defaultMessage: 'Without "Ignore AA" mark',
  },
  AnalyseTitle: {
    id: 'StepLevelEntities.AnalyseTitle',
    defaultMessage: 'Analysed by RP (AA)',
  },
  AnalyseOption1: {
    id: 'StepLevelEntities.AnalyseOption1',
    defaultMessage: 'With "AA" mark',
  },
  AnalyseOption2: {
    id: 'StepLevelEntities.AnalyseOption2',
    defaultMessage: 'Without "AA" mark',
  },
  RetryOption1: {
    id: 'StepLevelEntities.RetryOption1',
    defaultMessage: 'Has retries',
  },
  RetryOption2: {
    id: 'StepLevelEntities.RetryOption2',
    defaultMessage: 'Has no retries',
  },
  LaunchStatusPassed: {
    id: 'StepLevelEntities.LaunchStatusPassed',
    defaultMessage: 'Passed',
  },
  LaunchStatusFailed: {
    id: 'StepLevelEntities.LaunchStatusFailed',
    defaultMessage: 'Failed',
  },
  LaunchStatusSkipped: {
    id: 'StepLevelEntities.LaunchStatusSkipped',
    defaultMessage: 'Skipped',
  },
  LaunchStatusInterrupted: {
    id: 'StepLevelEntities.LaunchStatusInterrupted',
    defaultMessage: 'Interrupted',
  },
  LaunchStatusInProgress: {
    id: 'StepLevelEntities.LaunchStatusInProgress',
    defaultMessage: 'In progress',
  },
  MethodTypeTitle: {
    id: 'StepLevelEntities.MethodTypeTitle',
    defaultMessage: 'Method type',
  },
  DefectTypeTitle: {
    id: 'StepLevelEntities.DefectTypeTitle',
    defaultMessage: 'Defect type',
  },
  TypeBeforeSuite: {
    id: 'StepLevelEntities.TypeBeforeSuite',
    defaultMessage: 'Before suite',
  },
  TypeBeforeGroups: {
    id: 'StepLevelEntities.TypeBeforeGroups',
    defaultMessage: 'Before groups',
  },
  TypeBeforeClass: {
    id: 'StepLevelEntities.TypeBeforeClass',
    defaultMessage: 'Before class',
  },
  TypeBeforeTest: {
    id: 'StepLevelEntities.TypeBeforeTest',
    defaultMessage: 'Before test',
  },
  TypeTest: {
    id: 'StepLevelEntities.TypeTest',
    defaultMessage: 'Test class',
  },
  TypeBeforeMethod: {
    id: 'StepLevelEntities.TypeBeforeMethod',
    defaultMessage: 'Before method',
  },
  TypeStep: {
    id: 'StepLevelEntities.TypeStep',
    defaultMessage: 'Test',
  },
  TypeAfterMethod: {
    id: 'StepLevelEntities.TypeAfterMethod',
    defaultMessage: 'After method',
  },
  TypeAfterTest: {
    id: 'StepLevelEntities.TypeAfterTest',
    defaultMessage: 'After test',
  },
  TypeAfterClass: {
    id: 'StepLevelEntities.TypeAfterClass',
    defaultMessage: 'After class',
  },
  TypeAfterGroups: {
    id: 'StepLevelEntities.TypeAfterGroups',
    defaultMessage: 'After groups',
  },
  TypeAfterSuite: {
    id: 'StepLevelEntities.TypeAfterSuite',
    defaultMessage: 'After suite',
  },
  PRODUCT_BUG_ALL: {
    id: 'StepLevelEntities.PRODUCT_BUG_ALL',
    defaultMessage: 'All product bugs',
  },
  AUTOMATION_BUG_ALL: {
    id: 'StepLevelEntities.AUTOMATION_BUG_ALL',
    defaultMessage: 'All automation bug',
  },
  SYSTEM_ISSUE_ALL: {
    id: 'StepLevelEntities.SYSTEM_ISSUE_ALL',
    defaultMessage: 'All system issues',
  },
  NO_DEFECT_ALL: {
    id: 'StepLevelEntities.NO_DEFECT_ALL',
    defaultMessage: 'All no defects',
  },
  TO_INVESTIGATE_ALL: {
    id: 'StepLevelEntities.TO_INVESTIGATE_ALL',
    defaultMessage: 'All to investigate',
  },
  Defect_Type_AB001: {
    id: 'StepLevelEntities.Defect_Type_AB001',
    defaultMessage: 'Automation bug',
  },
  Defect_Type_PB001: {
    id: 'StepLevelEntities.Defect_Type_PB001',
    defaultMessage: 'Product bug',
  },
  Defect_Type_SI001: {
    id: 'StepLevelEntities.Defect_Type_SI001',
    defaultMessage: 'System issue',
  },
  Defect_Type_TI001: {
    id: 'StepLevelEntities.Defect_Type_TI001',
    defaultMessage: 'To investigate',
  },
  Defect_Type_ND001: {
    id: 'StepLevelEntities.Defect_Type_ND001',
    defaultMessage: 'No defect',
  },
  BTS_ISSUE_PLACEHOLDER: {
    id: 'StepLevelEntities.entityItemBTSIssue.placeholder',
    defaultMessage: 'Enter Issue in BTS',
  },
  PatternNameTitle: {
    id: 'StepLevelEntities.PatternNameTitle',
    defaultMessage: 'Pattern name',
  },
  NewFailureTitle: {
    id: 'StepLevelEntities.NewFailureTitle',
    defaultMessage: 'New failure',
  },
  NewFailureOption1: {
    id: 'StepLevelEntities.NewFailureOption1',
    defaultMessage: 'New failures',
  },
  NewFailureOption2: {
    id: 'StepLevelEntities.NewFailureOption2',
    defaultMessage: 'All tests',
  },
});

const descriptionStepLevelEntity = bindMessageToValidator(
  validate.descriptionStepLevelEntity,
  'descriptionStepLevelEntityHint',
);

@injectIntl
@connectRouter(() => {}, {
  updateUriQuery: (query) => query,
})
@connect((state) => ({
  defectTypes: defectTypesSelector(state),
  launchId: launchIdSelector(state),
  patterns: patternsSelector(state),
  level: levelSelector(state),
  query: queryParametersSelector(state, namespaceSelector(state)),
  projectKey: projectKeySelector(state),
}))
export class StepLevelEntities extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    defectTypes: PropTypes.object.isRequired,
    filterValues: PropTypes.object,
    render: PropTypes.func.isRequired,
    launchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    visibleFilters: PropTypes.array,
    patterns: PropTypes.array,
    level: PropTypes.string,
    updateUriQuery: PropTypes.func.isRequired,
    query: PropTypes.object,
    projectKey: PropTypes.string.isRequired,
  };
  static defaultProps = {
    filterValues: {},
    visibleFilters: [],
    patterns: [],
    level: '',
    query: {},
  };

  getDefectTypeEntity = () => {
    const { intl, defectTypes, filterValues, visibleFilters } = this.props;
    const options = getGroupedDefectTypesOptions(defectTypes, intl.formatMessage).map((option) => ({
      ...option,
      value: option.meta && option.meta.subItem ? option.locator : option.typeRef,
    }));
    return {
      id: ENTITY_DEFECT_TYPE,
      component: EntityDropdown,
      value: filterValues[ENTITY_DEFECT_TYPE] || {
        condition: CONDITION_IN,
      },
      title: intl.formatMessage(messages.DefectTypeTitle),
      active: visibleFilters.includes(ENTITY_DEFECT_TYPE),
      removable: true,
      customProps: {
        options,
        multiple: true,
        selectAll: true,
      },
    };
  };

  getPatternNameEntity = () => {
    const { intl, patterns, filterValues, visibleFilters } = this.props;
    if (!patterns.length) return [];
    const options = patterns.map((pattern) => ({
      value: pattern.name,
      label: pattern.name,
    }));
    return [
      {
        id: ENTITY_PATTERN_NAME,
        component: EntityDropdown,
        value: filterValues[ENTITY_PATTERN_NAME] || {
          condition: CONDITION_ANY,
        },
        title: intl.formatMessage(messages.PatternNameTitle),
        active: visibleFilters.includes(ENTITY_PATTERN_NAME),
        removable: true,
        customProps: {
          options,
          multiple: true,
          selectAll: true,
        },
      },
    ];
  };

  getEntities = () => {
    const { intl, launchId, visibleFilters, query, projectKey } = this.props;

    const getTestItemAttributeValuesSearch = (projectKeyValue, key) => {
      return URLS.testItemAttributeValuesSearch(projectKeyValue, launchId, key);
    };

    const getTestItemAttributeKeysSearch = (projectKeyValue) => {
      return URLS.testItemAttributeKeysSearch(projectKeyValue, launchId);
    };

    const entities = [
      {
        id: ENTITY_NAME,
        component: EntityInputConditional,
        value: this.bindDefaultValue(ENTITY_NAME, {
          condition: CONDITION_CNT,
        }),
        validationFunc: commonValidators.itemNameEntity,
        title: intl.formatMessage(messages.NameTitle),
        active: true,
        removable: false,
        static: true,
        eventInfo: pageEventsMap[this.props.level].REFINE_BY_NAME,
      },
      {
        id: ENTITY_METHOD_TYPE,
        component: EntityDropdown,
        value: this.bindDefaultValue(ENTITY_METHOD_TYPE, {
          condition: CONDITION_IN,
        }),
        title: intl.formatMessage(messages.MethodTypeTitle),
        active: visibleFilters.includes(ENTITY_METHOD_TYPE),
        removable: true,
        customProps: {
          options: [
            {
              label: intl.formatMessage(messages.TypeBeforeSuite),
              value: BEFORE_SUITE,
            },
            {
              label: intl.formatMessage(messages.TypeBeforeGroups),
              value: BEFORE_GROUPS,
            },
            {
              label: intl.formatMessage(messages.TypeBeforeClass),
              value: BEFORE_CLASS,
            },
            {
              label: intl.formatMessage(messages.TypeBeforeTest),
              value: BEFORE_TEST,
            },
            {
              label: intl.formatMessage(messages.TypeTest),
              value: TEST,
            },
            {
              label: intl.formatMessage(messages.TypeBeforeMethod),
              value: BEFORE_METHOD,
            },
            {
              label: intl.formatMessage(messages.TypeStep),
              value: STEP,
            },
            {
              label: intl.formatMessage(messages.TypeAfterMethod),
              value: AFTER_METHOD,
            },
            {
              label: intl.formatMessage(messages.TypeAfterTest),
              value: AFTER_TEST,
            },
            {
              label: intl.formatMessage(messages.TypeAfterClass),
              value: AFTER_CLASS,
            },
            {
              label: intl.formatMessage(messages.TypeAfterGroups),
              value: AFTER_GROUPS,
            },
            {
              label: intl.formatMessage(messages.TypeAfterSuite),
              value: AFTER_SUITE,
            },
          ],
          multiple: true,
          selectAll: true,
        },
      },
      {
        id: ENTITY_DESCRIPTION,
        component: EntityInputConditional,
        value: this.bindDefaultValue(ENTITY_DESCRIPTION, {
          condition: CONDITION_CNT,
        }),
        title: intl.formatMessage(messages.DescriptionTitle),
        validationFunc: descriptionStepLevelEntity,
        active: visibleFilters.includes(ENTITY_DESCRIPTION),
        removable: true,
        customProps: {
          placeholder: intl.formatMessage(messages.DescriptionPlaceholder),
          maxLength: 256,
        },
      },
      {
        id: ENTITY_STATUS,
        component: EntityDropdown,
        value: this.bindDefaultValue(ENTITY_STATUS, {
          condition: CONDITION_IN,
        }),
        title: intl.formatMessage(messages.StatusTitle),
        active: visibleFilters.includes(ENTITY_STATUS),
        removable: true,
        customProps: {
          options: [
            {
              label: intl.formatMessage(messages.LaunchStatusPassed),
              value: PASSED.toUpperCase(),
            },
            {
              label: intl.formatMessage(messages.LaunchStatusFailed),
              value: FAILED.toUpperCase(),
            },
            {
              label: intl.formatMessage(messages.LaunchStatusSkipped),
              value: SKIPPED.toUpperCase(),
            },
            {
              label: intl.formatMessage(messages.LaunchStatusInterrupted),
              value: INTERRUPTED.toUpperCase(),
            },
            {
              label: intl.formatMessage(messages.LaunchStatusInProgress),
              value: IN_PROGRESS.toUpperCase(),
            },
          ],
          multiple: true,
          selectAll: true,
        },
      },
      {
        id: ENTITY_START_TIME,
        component: EntityItemStartTime,
        value: this.bindDefaultValue(ENTITY_START_TIME, {
          condition: CONDITION_BETWEEN,
        }),
        title: intl.formatMessage(messages.StartTimeTitle),
        active: visibleFilters.includes(ENTITY_START_TIME),
        removable: true,
        customProps: {
          events: pageEventsMap[this.props.level].REFINE_FILTERS_PANEL_EVENTS.commonEvents,
        },
      },
      this.getDefectTypeEntity(),
      {
        id: ENTITY_DEFECT_COMMENT,
        component: EntityInputConditional,
        value: this.bindDefaultValue(ENTITY_DEFECT_COMMENT, {
          condition: CONDITION_CNT,
        }),
        title: intl.formatMessage(messages.DefectCommentTitle),
        validationFunc: commonValidators.descriptionEntity,
        active: visibleFilters.includes(ENTITY_DEFECT_COMMENT),
        removable: true,
        customProps: {
          placeholder: intl.formatMessage(messages.DefectCommentPlaceholder),
          maxLength: 18,
        },
      },
      {
        id: ENTITY_ATTRIBUTE,
        component: EntityInputConditionalAttributes,
        value: this.bindDefaultValue(ENTITY_ATTRIBUTE, {
          condition: CONDITION_HAS,
        }),
        title: intl.formatMessage(messages.Attribute),
        active: visibleFilters.includes(ENTITY_ATTRIBUTE),
        removable: true,
        customProps: {
          projectKey,
          keyURLCreator: getTestItemAttributeKeysSearch,
          valueURLCreator: getTestItemAttributeValuesSearch,
        },
      },
      {
        id: ENTITY_AUTOANALYZE,
        component: EntityDropdown,
        value: this.bindDefaultValue(ENTITY_AUTOANALYZE, {
          condition: CONDITION_EQ,
        }),
        title: intl.formatMessage(messages.AnalyseTitle),
        active: visibleFilters.includes(ENTITY_AUTOANALYZE),
        removable: true,
        customProps: {
          options: [
            {
              label: intl.formatMessage(messages.AnalyseOption1),
              value: 'TRUE',
            },
            {
              label: intl.formatMessage(messages.AnalyseOption2),
              value: 'FALSE',
            },
          ],
        },
      },
      {
        id: ENTITY_IGNORE_ANALYZER,
        component: EntityDropdown,
        value: this.bindDefaultValue(ENTITY_IGNORE_ANALYZER, {
          condition: CONDITION_IN,
        }),
        title: intl.formatMessage(messages.IgnoreAATitle),
        active: visibleFilters.includes(ENTITY_IGNORE_ANALYZER),
        removable: true,
        customProps: {
          options: [
            {
              label: intl.formatMessage(messages.IgnoreAAOption1),
              value: 'TRUE',
            },
            {
              label: intl.formatMessage(messages.IgnoreAAOption2),
              value: 'FALSE',
            },
          ],
        },
      },
      {
        id: ENTITY_BTS_ISSUES,
        component: EntityInputConditionalTags,
        value: this.bindDefaultValue(ENTITY_BTS_ISSUES, {
          condition: CONDITION_HAS,
        }),
        title: intl.formatMessage(messages.BtsIssueTitle),
        active: visibleFilters.includes(ENTITY_BTS_ISSUES),
        removable: true,
        customProps: {
          getURI: URLS.testItemBTSIssuesSearch(projectKey),
          placeholder: intl.formatMessage(messages.BTS_ISSUE_PLACEHOLDER),
        },
      },
      {
        id: ENTITY_RETRY,
        component: EntityDropdown,
        value: this.bindDefaultValue(ENTITY_RETRY, {
          condition: CONDITION_EQ,
        }),
        title: intl.formatMessage(messages.RetryTitle),
        active: visibleFilters.includes(ENTITY_RETRY),
        removable: true,
        customProps: {
          options: [
            {
              label: intl.formatMessage(messages.RetryOption1),
              value: 'TRUE',
            },
            {
              label: intl.formatMessage(messages.RetryOption2),
              value: 'FALSE',
            },
          ],
        },
      },
      ...this.getPatternNameEntity(),
    ];

    if (query.baselineLaunchId) {
      const options = [
        {
          label: intl.formatMessage(messages.NewFailureOption1),
          value: 'true',
        },
        {
          label: intl.formatMessage(messages.NewFailureOption2),
          value: 'false',
        },
      ];
      entities.push({
        id: ENTITY_NEW_FAILURE,
        component: EntityDropdown,
        value: options.find(
          (item) => JSON.parse(item.value) === (query.providerType === PROVIDER_TYPE_BASELINE),
        ),
        title: intl.formatMessage(messages.NewFailureTitle),
        active: true,
        removable: false,
        customProps: {
          onChange: (val) => {
            this.props.updateUriQuery(
              createNamespacedQuery(
                {
                  ...query,
                  providerType: JSON.parse(val) ? PROVIDER_TYPE_BASELINE : PROVIDER_TYPE_LAUNCH,
                },
                getQueryNamespace(0),
              ),
            );
          },
          options,
        },
      });
    }

    return entities;
  };

  bindDefaultValue = bindDefaultValue;

  render() {
    const { render, ...rest } = this.props;
    return render({
      ...rest,
      filterEntities: this.getEntities(),
    });
  }
}

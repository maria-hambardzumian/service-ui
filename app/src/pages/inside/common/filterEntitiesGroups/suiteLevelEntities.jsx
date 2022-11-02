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
import { URLS } from 'common/urls';
import { commonValidators } from 'common/utils/validation';
import {
  STATS_TOTAL,
  STATS_FAILED,
  STATS_PASSED,
  STATS_SKIPPED,
} from 'common/constants/statistics';
import {
  EntityInputConditional,
  EntityItemStartTime,
  EntityInputConditionalAttributes,
} from 'components/filterEntities';
import { bindDefaultValue } from 'components/filterEntities/utils';
import {
  CONDITION_CNT,
  CONDITION_GREATER_EQ,
  CONDITION_BETWEEN,
  CONDITION_HAS,
  ENTITY_NAME,
  ENTITY_START_TIME,
  ENTITY_DESCRIPTION,
  CONDITION_LESS_EQ,
  CONDITION_EQ,
  ENTITY_ATTRIBUTE,
} from 'components/filterEntities/constants';
import { defectTypesSelector, projectKeySelector } from 'controllers/project';
import { launchIdSelector } from 'controllers/pages';
import { pageEventsMap } from 'components/main/analytics';
import { levelSelector } from 'controllers/testItem';
import { getGroupedDefectTypesOptions } from 'pages/inside/common/utils';
import { NO_DEFECT } from 'common/constants/defectTypes';

const messages = defineMessages({
  NameTitle: {
    id: 'SuiteLevelEntities.NameTitle',
    defaultMessage: 'Suite name',
  },
  DescriptionTitle: {
    id: 'SuiteLevelEntities.DescriptionTitle',
    defaultMessage: 'Description',
  },
  StartTimeTitle: {
    id: 'SuiteLevelEntities.StartTimeTitle',
    defaultMessage: 'Start time',
  },
  Attribute: {
    id: 'LaunchLevelEntities.AttributeTitle',
    defaultMessage: 'Attribute',
  },
  TotalTitle: {
    id: 'SuiteLevelEntities.TotalTitle',
    defaultMessage: 'Total',
  },
  PassedTitle: {
    id: 'SuiteLevelEntities.PassedTitle',
    defaultMessage: 'Passed',
  },
  FailedTitle: {
    id: 'SuiteLevelEntities.FailedTitle',
    defaultMessage: 'Failed',
  },
  SkippedTitle: {
    id: 'SuiteLevelEntities.SkippedTitle',
    defaultMessage: 'Skipped',
  },
  PRODUCT_BUG_title: {
    id: 'SuiteLevelEntities.PRODUCT_BUG_title',
    defaultMessage: 'Product bug',
  },
  PRODUCT_BUG_totalTitle: {
    id: 'SuiteLevelEntities.PRODUCT_BUG_totalTitle',
    defaultMessage: 'Total product bugs',
  },
  AUTOMATION_BUG_title: {
    id: 'SuiteLevelEntities.AUTOMATION_BUG_title',
    defaultMessage: 'Automation bug',
  },
  AUTOMATION_BUG_totalTitle: {
    id: 'SuiteLevelEntities.AUTOMATION_BUG_totalTitle',
    defaultMessage: 'Total automation bugs',
  },
  SYSTEM_ISSUE_title: {
    id: 'SuiteLevelEntities.SYSTEM_ISSUE_title',
    defaultMessage: 'System issue',
  },
  SYSTEM_ISSUE_totalTitle: {
    id: 'SuiteLevelEntities.SYSTEM_ISSUE_totalTitle',
    defaultMessage: 'Total system issues',
  },
  TO_INVESTIGATE_title: {
    id: 'SuiteLevelEntities.TO_INVESTIGATE_title',
    defaultMessage: 'To investigate',
  },
  TO_INVESTIGATE_totalTitle: {
    id: 'SuiteLevelEntities.TO_INVESTIGATE_totalTitle',
    defaultMessage: 'Total to investigate',
  },
  NO_DEFECT_title: {
    id: 'SuiteLevelEntities.NO_DEFECT_title',
    defaultMessage: 'No defects',
  },
  NO_DEFECT_totalTitle: {
    id: 'SuiteLevelEntities.NO_DEFECT_totalTitle',
    defaultMessage: 'Total no defects',
  },
  LAUNCH_NUMBER_PLACEHOLDER: {
    id: 'SuiteLevelEntities.launchNumberPlaceholder',
    defaultMessage: 'Enter number',
  },
  DESCRIPTION_PLACEHOLDER: {
    id: 'SuiteLevelEntities.descriptionPlaceholder',
    defaultMessage: 'Enter description',
  },
  STATS_PLACEHOLDER: {
    id: 'SuiteLevelEntities.entityItemStatistics.placeholder',
    defaultMessage: 'Enter quantity',
  },
  SUITE_NAME_PLACEHOLDER: {
    id: 'SuiteLevelEntities.suiteName.placeholder',
    defaultMessage: 'Enter name',
  },
});

@injectIntl
@connect((state) => ({
  defectTypes: defectTypesSelector(state),
  launchId: launchIdSelector(state),
  level: levelSelector(state),
  projectKey: projectKeySelector(state),
}))
export class SuiteLevelEntities extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    defectTypes: PropTypes.object.isRequired,
    filterValues: PropTypes.object,
    render: PropTypes.func.isRequired,
    launchId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    visibleFilters: PropTypes.array,
    level: PropTypes.string,
    projectKey: PropTypes.string.isRequired,
  };
  static defaultProps = {
    filterValues: {},
    visibleFilters: [],
    level: '',
  };

  getStaticEntities = () => {
    const { intl, launchId, visibleFilters, projectKey } = this.props;

    const getTestItemAttributeValuesSearch = (projectKeyValue, key) => {
      return URLS.testItemAttributeValuesSearch(projectKeyValue, launchId, key);
    };

    const getTestItemAttributeKeysSearch = (projectKeyValue) => {
      return URLS.testItemAttributeKeysSearch(projectKeyValue, launchId);
    };
    return [
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
        customProps: {
          placeholder: intl.formatMessage(messages.SUITE_NAME_PLACEHOLDER),
        },
      },
      {
        id: ENTITY_START_TIME,
        component: EntityItemStartTime,
        value: this.bindDefaultValue(ENTITY_START_TIME, {
          value: '',
          condition: CONDITION_BETWEEN,
        }),
        title: intl.formatMessage(messages.StartTimeTitle),
        active: visibleFilters.includes(ENTITY_START_TIME),
        removable: true,
        customProps: {
          events: pageEventsMap[this.props.level].REFINE_FILTERS_PANEL_EVENTS.commonEvents,
        },
      },
      {
        id: ENTITY_DESCRIPTION,
        component: EntityInputConditional,
        value: this.bindDefaultValue(ENTITY_DESCRIPTION, {
          condition: CONDITION_CNT,
        }),
        title: intl.formatMessage(messages.DescriptionTitle),
        validationFunc: commonValidators.descriptionEntity,
        active: visibleFilters.includes(ENTITY_DESCRIPTION),
        removable: true,
        customProps: {
          placeholder: intl.formatMessage(messages.DESCRIPTION_PLACEHOLDER),
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
        id: STATS_TOTAL,
        component: EntityInputConditional,
        value: this.bindDefaultValue(STATS_TOTAL, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: intl.formatMessage(messages.TotalTitle),
        active: visibleFilters.includes(STATS_TOTAL),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      },
      {
        id: STATS_PASSED,
        component: EntityInputConditional,
        value: this.bindDefaultValue(STATS_PASSED, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: intl.formatMessage(messages.PassedTitle),
        active: visibleFilters.includes(STATS_PASSED),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      },
      {
        id: STATS_FAILED,
        component: EntityInputConditional,
        value: this.bindDefaultValue(STATS_FAILED, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: intl.formatMessage(messages.FailedTitle),
        active: visibleFilters.includes(STATS_FAILED),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      },
      {
        id: STATS_SKIPPED,
        component: EntityInputConditional,
        value: this.bindDefaultValue(STATS_SKIPPED, {
          condition: CONDITION_GREATER_EQ,
        }),
        validationFunc: commonValidators.launchNumericEntity,
        title: intl.formatMessage(messages.SkippedTitle),
        active: visibleFilters.includes(STATS_SKIPPED),
        removable: true,
        customProps: {
          conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
          placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
        },
      },
    ];
  };

  getDynamicEntities = () => {
    const { defectTypes, intl, visibleFilters } = this.props;
    return getGroupedDefectTypesOptions(defectTypes, intl.formatMessage)
      .filter(
        (option) =>
          option.groupId !== NO_DEFECT.toUpperCase() && option.groupRef !== NO_DEFECT.toUpperCase(),
      )
      .map((option) => {
        const meta = option.meta;
        return {
          ...option,
          id: option.value,
          component: EntityInputConditional,
          value: this.bindDefaultValue(option.value, {
            condition: CONDITION_GREATER_EQ,
          }),
          validationFunc: commonValidators.launchNumericEntity,
          title: meta && meta.subItemLabel ? meta.subItemLabel : option.label,
          customProps: {
            conditions: [CONDITION_GREATER_EQ, CONDITION_LESS_EQ, CONDITION_EQ],
            placeholder: intl.formatMessage(messages.STATS_PLACEHOLDER),
          },
          removable: true,
          active: visibleFilters.includes(option.value),
        };
      });
  };

  bindDefaultValue = bindDefaultValue;
  render() {
    const { render, ...rest } = this.props;

    return render({
      ...rest,
      filterEntities: this.getStaticEntities().concat(this.getDynamicEntities()),
    });
  }
}

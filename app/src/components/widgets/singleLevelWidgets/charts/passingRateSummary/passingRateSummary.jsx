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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { STATS_PASSED } from 'common/constants/statistics';
import { PASSED, FAILED, INTERRUPTED, SKIPPED } from 'common/constants/testStatuses';
import { statisticsLinkSelector, TEST_ITEMS_TYPE_LIST } from 'controllers/testItem';
import { urlOrganizationAndProjectSelector } from 'controllers/pages';
import { getDefaultTestItemLinkParams } from 'components/widgets/common/utils';
import { messages } from 'components/widgets/common/messages';
import { PassingRateChart } from '../common/passingRateChart';

@connect(
  (state) => ({
    slugs: urlOrganizationAndProjectSelector(state),
    getStatisticsLink: statisticsLinkSelector(state),
  }),
  {
    navigate: (linkAction) => linkAction,
  },
)
export class PassingRateSummary extends Component {
  static propTypes = {
    getStatisticsLink: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    widget: PropTypes.object.isRequired,
    slugs: PropTypes.shape({
      organizationSlug: PropTypes.string.isRequired,
      projectSlug: PropTypes.string.isRequired,
    }),
  };

  onChartClick = (data) => {
    const {
      widget,
      getStatisticsLink,
      widget: {
        contentParameters: {
          widgetOptions: { excludeSkipped },
        },
      },
      slugs: { organizationSlug, projectSlug },
    } = this.props;

    const linkCreationParametersForFailed = excludeSkipped
      ? [FAILED, INTERRUPTED]
      : [FAILED, INTERRUPTED, SKIPPED];

    const link = getStatisticsLink({
      statuses: data.id === STATS_PASSED ? [PASSED] : linkCreationParametersForFailed,
      launchesLimit: widget.contentParameters.itemsCount,
    });
    const navigationParams = getDefaultTestItemLinkParams(
      projectSlug,
      widget.appliedFilters[0].id,
      TEST_ITEMS_TYPE_LIST,
      organizationSlug,
    );

    this.props.navigate(Object.assign(link, navigationParams));
  };

  getFilterName = ({ appliedFilters = [] }) => appliedFilters[0]?.name;

  render() {
    return (
      <PassingRateChart
        {...this.props}
        filterNameTitle={messages.filterLabel}
        filterName={this.getFilterName(this.props.widget)}
        onChartClick={this.onChartClick}
      />
    );
  }
}

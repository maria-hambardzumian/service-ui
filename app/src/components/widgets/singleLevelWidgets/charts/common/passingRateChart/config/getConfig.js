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

import * as COLORS from 'common/constants/colors';
import { STATS_FAILED, STATS_PASSED } from 'common/constants/statistics';
import { createTooltipRenderer } from 'components/widgets/common/tooltip';
import { IssueTypeStatTooltip } from '../../issueTypeStatTooltip';
import { getPercentage, getChartViewModeOptions, calculateTooltipParams } from './utils';

export const NOT_PASSED_STATISTICS_KEY = 'statistics$executions$notPassed';

export const getConfig = ({
  content,
  isPreview,
  formatMessage,
  positionCallback,
  size,
  onRendered,
  viewMode,
  onChartClick,
  excludeSkipped,
}) => {
  const totalItems = excludeSkipped ? content.total - (content.skipped ?? 0) : content.total;
  const statisticKey = excludeSkipped ? STATS_FAILED : NOT_PASSED_STATISTICS_KEY;
  const notPassed = totalItems - content.passed;

  const columnData = {
    [STATS_PASSED]: content.passed,
    [statisticKey]: notPassed,
  };

  const columns = [
    [STATS_PASSED, columnData[STATS_PASSED]],
    [statisticKey, columnData[statisticKey]],
  ];

  const chartData = {
    columns,
    type: viewMode,
    groups: [[STATS_PASSED, statisticKey]],
    order: null,
    colors: {
      [STATS_PASSED]: COLORS.COLOR_PASSED,
      [statisticKey]: COLORS.COLOR_NOTPASSED,
    },
    labels: {
      show: !isPreview,
      format: (value) => (isPreview || value === 0 ? '' : `${getPercentage(value, totalItems)}%`),
    },
    onclick: isPreview ? undefined : onChartClick,
  };
  const viewModeOptions = getChartViewModeOptions(viewMode, isPreview, totalItems);

  return {
    data: chartData,
    ...viewModeOptions,
    interaction: {
      enabled: !isPreview,
    },
    legend: {
      show: false,
    },
    tooltip: {
      grouped: false,
      position: positionCallback,
      contents: createTooltipRenderer(IssueTypeStatTooltip, calculateTooltipParams, {
        totalItems,
        formatMessage,
      }),
    },
    size,
    onrendered: onRendered,
    transition: {
      duration: 0,
    },
  };
};

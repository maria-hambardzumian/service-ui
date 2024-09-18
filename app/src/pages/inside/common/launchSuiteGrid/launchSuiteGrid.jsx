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

import React, { useCallback, useMemo } from 'react';
import { useTracking } from 'react-tracking';
import { useIntl } from 'react-intl';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import {
  PRODUCT_BUG,
  AUTOMATION_BUG,
  SYSTEM_ISSUE,
  TO_INVESTIGATE,
} from 'common/constants/defectTypes';
import { FAILED, INTERRUPTED, PASSED, SKIPPED } from 'common/constants/launchStatuses';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { Grid } from 'components/main/grid';
import { AbsRelTime } from 'components/main/absRelTime';
import { ItemInfo } from 'pages/inside/common/itemInfo';
import {
  ENTITY_START_TIME,
  ENTITY_NAME,
  CONDITION_HAS,
  CONDITION_IN,
  ENTITY_USER,
  ENTITY_ATTRIBUTE,
} from 'components/filterEntities/constants';
import { NoItemMessage } from 'components/main/noItemMessage';
import {
  STATS_TOTAL,
  STATS_SKIPPED,
  STATS_PASSED,
  STATS_FAILED,
  STATS_AB_TOTAL,
  STATS_PB_TOTAL,
  STATS_SI_TOTAL,
  STATS_TI_TOTAL,
} from 'common/constants/statistics';
import { formatAttribute } from 'common/utils/attributeUtils';
import { Hamburger } from './hamburger';
import { ExecutionStatistics } from './executionStatistics';
import { DefectStatistics } from './defectStatistics';
import styles from './launchSuiteGrid.scss';

const cx = classNames.bind(styles);

const HamburgerColumn = ({ className, ...rest }) => (
  <td rowSpan={2} className={cx('hamburger-col', className)}>
    <Hamburger launch={rest.value} customProps={rest.customProps} />
  </td>
);
HamburgerColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const NameColumn = ({ className, ...rest }) => (
  <>
    <td rowSpan={2} className={cx('name-col', className)}>
      <ItemInfo {...rest} hideDescription />
    </td>
    <div className={cx('name-col-mobile', className)}>
      <ItemInfo {...rest} />
    </div>
  </>
);
NameColumn.propTypes = {
  className: PropTypes.string.isRequired,
  customProps: PropTypes.object,
};

const StartTimeColumn = ({ className, ...rest }) => (
  <div className={cx('start-time-col', className)}>
    <AbsRelTime startTime={rest.value.startTime} />
  </div>
);
StartTimeColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const TotalColumn = ({ className, ...rest }) => (
  <div className={cx('total-col', className)}>
    <ExecutionStatistics
      itemId={rest.value.id}
      title={rest.title}
      value={rest.value.statistics.executions?.total}
      bold
      statuses={[
        PASSED.toUpperCase(),
        FAILED.toUpperCase(),
        SKIPPED.toUpperCase(),
        INTERRUPTED.toUpperCase(),
      ]}
    />
  </div>
);
TotalColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const PassedColumn = ({ className, ...rest }) => (
  <div className={cx('passed-col', className)}>
    <ExecutionStatistics
      itemId={rest.value.id}
      title={rest.title}
      value={rest.value.statistics.executions?.passed}
      statuses={[PASSED.toUpperCase()]}
    />
  </div>
);
PassedColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const FailedColumn = ({ className, ...rest }) => (
  <div className={cx('failed-col', className)}>
    <ExecutionStatistics
      itemId={rest.value.id}
      title={rest.title}
      value={rest.value.statistics.executions?.failed}
      statuses={[FAILED.toUpperCase(), INTERRUPTED.toUpperCase()]}
    />
  </div>
);
FailedColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const SkippedColumn = ({ className, ...rest }) => (
  <div className={cx('skipped-col', className)}>
    <ExecutionStatistics
      itemId={rest.value.id}
      title={rest.title}
      value={rest.value.statistics.executions?.skipped}
      statuses={[SKIPPED.toUpperCase()]}
    />
  </div>
);
SkippedColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const PbColumn = ({ className, ...rest }) => (
  <div className={cx('pb-col', className)}>
    <DefectStatistics
      type={PRODUCT_BUG}
      customProps={rest.customProps}
      data={rest.value.statistics.defects?.product_bug}
      itemId={rest.value.id}
      eventInfo={rest.customProps.events.CLICK_DONUT_PB}
      tooltipEventInfo={rest.customProps.events.getClickTooltipPbEvent()}
    />
  </div>
);
PbColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const AbColumn = ({ className, ...rest }) => (
  <div className={cx('ab-col', className)}>
    <DefectStatistics
      type={AUTOMATION_BUG}
      customProps={rest.customProps}
      data={rest.value.statistics.defects?.automation_bug}
      itemId={rest.value.id}
      eventInfo={rest.customProps.events.CLICK_DONUT_AB}
      tooltipEventInfo={rest.customProps.events.getClickTooltipAbEvent()}
    />
  </div>
);
AbColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const SiColumn = ({ className, ...rest }) => (
  <div className={cx('si-col', className)}>
    <DefectStatistics
      type={SYSTEM_ISSUE}
      customProps={rest.customProps}
      data={rest.value.statistics.defects?.system_issue}
      itemId={rest.value.id}
      eventInfo={rest.customProps.events.CLICK_DONUT_SI}
      tooltipEventInfo={rest.customProps.events.getClickTooltipSiEvent()}
    />
  </div>
);
SiColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

const TiColumn = ({ className, ...rest }) => (
  <div className={cx('ti-col', className)}>
    <DefectStatistics
      type={TO_INVESTIGATE}
      customProps={rest.customProps}
      data={rest.value.statistics.defects?.to_investigate}
      itemId={rest.value.id}
      eventInfo={rest.customProps.events.CLICK_DONUT_TI}
      tooltipEventInfo={rest.customProps.events.getClickTooltipTiEvent()}
    />
  </div>
);
TiColumn.propTypes = {
  className: PropTypes.string.isRequired,
};

export const LaunchSuiteGrid = React.memo(
  ({
    data,
    sortingColumn,
    sortingDirection,
    onChangeSorting,
    onDeleteItem,
    onMove,
    onEditItem,
    onForceFinish,
    selectable,
    selectedItems = [],
    onItemSelect,
    onItemsSelect,
    onAllItemsSelect,
    withHamburger,
    loading,
    onFilterClick,
    events,
    onAnalysis,
    onPatternAnalysis,
    rowHighlightingConfig,
    noItemsBlock,
  }) => {
    const { formatMessage } = useIntl();
    const { trackEvent } = useTracking();

    const handleAttributeFilterClick = useCallback(
      (attribute) => {
        onFilterClick(
          [
            {
              id: ENTITY_ATTRIBUTE,
              value: {
                filteringField: ENTITY_ATTRIBUTE,
                condition: CONDITION_HAS,
                value: formatAttribute(attribute),
              },
            },
          ],
          true,
        );

        if (events.CLICK_ATTRIBUTES) {
          trackEvent(events.CLICK_ATTRIBUTES);
        }
      },
      [onFilterClick, events, trackEvent],
    );

    const handleOwnerFilterClick = useCallback(
      (owner) => {
        onFilterClick({
          id: ENTITY_USER,
          value: {
            filteringField: ENTITY_NAME,
            condition: CONDITION_IN,
            value: owner || '',
          },
        });
      },
      [onFilterClick],
    );

    const columns = useMemo(() => {
      const hamburgerColumn = {
        component: HamburgerColumn,
        customProps: {
          onDeleteItem,
          onMove,
          onForceFinish,
          onAnalysis,
          onPatternAnalysis,
        },
      };

      const baseColumns = [
        {
          id: ENTITY_NAME,
          title: {
            full: 'name',
            short: 'name',
          },
          maxHeight: 170,
          component: NameColumn,
          sortable: true,
          withFilter: true,
          filterEventInfo: events.NAME_FILTER,
          customProps: {
            onEditItem,
            onClickAttribute: handleAttributeFilterClick,
            onOwnerClick: handleOwnerFilterClick,
            events,
            withExtensions: withHamburger,
          },
          sortingEventInfo: events.NAME_SORTING,
        },
        {
          id: ENTITY_START_TIME,
          title: {
            full: 'start time',
            short: 'start',
          },
          component: StartTimeColumn,
          sortable: true,
          withFilter: true,
          filterEventInfo: events.START_TIME_FILTER,
          sortingEventInfo: events.START_TIME_SORTING,
        },
        {
          id: STATS_TOTAL,
          title: {
            full: 'total',
            short: 'ttl',
          },
          component: TotalColumn,
          sortable: true,
          withFilter: true,
          filterEventInfo: events.TOTAL_FILTER,
          sortingEventInfo: events.TOTAL_SORTING,
        },
        {
          id: STATS_PASSED,
          title: {
            full: 'passed',
            short: 'ps',
          },
          component: PassedColumn,
          sortable: true,
          withFilter: true,
          filterEventInfo: events.PASSED_FILTER,
          sortingEventInfo: events.PASSED_SORTING,
        },
        {
          id: STATS_FAILED,
          title: {
            full: 'failed',
            short: 'fl',
          },
          component: FailedColumn,
          sortable: true,
          withFilter: true,
          filterEventInfo: events.FAILED_FILTER,
          sortingEventInfo: events.FAILED_SORTING,
        },
        {
          id: STATS_SKIPPED,
          title: {
            full: 'skipped',
            short: 'skp',
          },
          component: SkippedColumn,
          sortable: true,
          withFilter: true,
          filterEventInfo: events.SKIPPED_FILTER,
          sortingEventInfo: events.SKIPPED_SORTING,
        },
        {
          id: STATS_PB_TOTAL,
          title: {
            full: 'product bug',
            short: 'product bug',
          },
          component: PbColumn,
          customProps: {
            abbreviation: 'pb',
            events,
          },
          sortable: true,
          withFilter: true,
          filterEventInfo: events.PB_FILTER,
          sortingEventInfo: events.PB_SORTING,
        },
        {
          id: STATS_AB_TOTAL,
          title: {
            full: 'auto bug',
            short: 'auto bug',
          },
          component: AbColumn,
          customProps: {
            abbreviation: 'ab',
            events,
          },
          sortable: true,
          withFilter: true,
          filterEventInfo: events.AB_FILTER,
          sortingEventInfo: events.AB_SORTING,
        },
        {
          id: STATS_SI_TOTAL,
          title: {
            full: 'system issue',
            short: 'system issue',
          },
          component: SiColumn,
          customProps: {
            abbreviation: 'si',
            events,
          },
          sortable: true,
          withFilter: true,
          filterEventInfo: events.SI_FILTER,
          sortingEventInfo: events.SI_SORTING,
        },
        {
          id: STATS_TI_TOTAL,
          title: {
            full: 'to investigate',
            short: 'to invest',
          },
          component: TiColumn,
          customProps: {
            abbreviation: 'ti',
            events,
          },
          sortable: true,
          withFilter: true,
          filterEventInfo: events.TI_FILTER,
          sortingEventInfo: events.TI_SORTING,
        },
      ];

      if (withHamburger) {
        baseColumns.unshift(hamburgerColumn);
      }

      return baseColumns;
    }, [
      events,
      withHamburger,
      onDeleteItem,
      onMove,
      onForceFinish,
      onAnalysis,
      onPatternAnalysis,
      onEditItem,
    ]);

    const renderNoItemsBlock = useCallback(() => {
      if (noItemsBlock) {
        return noItemsBlock;
      }
      return <NoItemMessage message={formatMessage(COMMON_LOCALE_KEYS.NO_RESULTS)} />;
    }, [noItemsBlock, formatMessage]);

    return (
      <>
        <Grid
          columns={columns}
          data={data}
          sortingColumn={sortingColumn}
          sortingDirection={sortingDirection}
          onChangeSorting={onChangeSorting}
          selectedItems={selectedItems}
          selectable={selectable}
          onToggleSelection={onItemSelect}
          onItemsSelect={onItemsSelect}
          onToggleSelectAll={onAllItemsSelect}
          loading={loading}
          onFilterClick={onFilterClick}
          rowHighlightingConfig={rowHighlightingConfig}
          descriptionConfig={{ colSpan: 9, className: cx('description') }}
        />
        {!data.length && !loading && renderNoItemsBlock()}
      </>
    );
  },
);

LaunchSuiteGrid.propTypes = {
  data: PropTypes.array,
  sortingColumn: PropTypes.string,
  sortingDirection: PropTypes.string,
  onChangeSorting: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onMove: PropTypes.func,
  onEditItem: PropTypes.func,
  onForceFinish: PropTypes.func,
  selectable: PropTypes.bool,
  selectedItems: PropTypes.arrayOf(PropTypes.object),
  onItemSelect: PropTypes.func,
  onItemsSelect: PropTypes.func,
  onAllItemsSelect: PropTypes.func,
  withHamburger: PropTypes.bool,
  loading: PropTypes.bool,
  onFilterClick: PropTypes.func,
  events: PropTypes.object,
  onAnalysis: PropTypes.func,
  onPatternAnalysis: PropTypes.func,
  rowHighlightingConfig: PropTypes.shape({
    onGridRowHighlighted: PropTypes.func,
    isGridRowHighlighted: PropTypes.bool,
    highlightedRowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  noItemsBlock: PropTypes.element,
};

LaunchSuiteGrid.defaultProps = {
  data: [],
  sortingColumn: null,
  sortingDirection: null,
  onChangeSorting: () => {},
  onDeleteItem: () => {},
  onMove: () => {},
  onEditItem: () => {},
  onForceFinish: () => {},
  selectable: true,
  selectedItems: [],
  onItemSelect: () => {},
  onItemsSelect: () => {},
  onAllItemsSelect: () => {},
  withHamburger: false,
  loading: false,
  onFilterClick: () => {},
  events: {},
  onAnalysis: () => {},
  onPatternAnalysis: () => {},
  rowHighlightingConfig: {
    onGridRowHighlighted: () => {},
    isGridRowHighlighted: false,
    highlightedRowId: null,
  },
  noItemsBlock: null,
};

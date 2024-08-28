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
import track from 'react-tracking';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import classNames from 'classnames/bind';
import Parser from 'html-react-parser';
import { fromNowFormat } from 'common/utils';
import { SAUCE_LABS } from 'common/constants/pluginNames';
import { isStepLevelSelector, formatItemName } from 'controllers/testItem';
import {
  availableIntegrationsByPluginNameSelector,
  uiExtensionLaunchItemComponentsSelector,
} from 'controllers/plugins';
import { IN_PROGRESS } from 'common/constants/testStatuses';
import { ANALYZER_TYPES } from 'common/constants/analyzerTypes';
import { RETENTION_POLICY } from 'common/constants/retentionPolicy';
import { MarkdownViewer } from 'components/main/markdown';
import { LAUNCHES_PAGE_EVENTS } from 'components/main/analytics/events';
import { PLUGIN_NAME_TITLES } from 'components/integrations';
import { getSauceLabsConfig } from 'components/integrations/integrationProviders/sauceLabsIntegration/utils';
import { formatMethodType, formatStatus } from 'common/utils/localizationUtils';
import PencilIcon from 'common/img/pencil-icon-inline.svg';
import RetryIcon from 'common/img/retry-inline.svg';
import StarIcon from 'common/img/star-inline.svg';
import SauceLabsIcon from 'common/img/plugins/sauce-labs-gray-inline.svg';
import { NameLink } from 'pages/inside/common/nameLink';
import { DurationBlock } from 'pages/inside/common/durationBlock';
import { withTooltip } from 'components/main/tooltips/tooltip';
import { TextTooltip } from 'components/main/tooltips/textTooltip';
import { ExtensionLoader, extensionType } from 'components/extensionLoader';
import { AttributesBlock } from './attributesBlock';
import { OwnerBlock } from './ownerBlock';
import { RetriesCounter } from './retriesCounter';
import styles from './itemInfo.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  retryTooltip: {
    id: 'ItemInfo.RetryTooltip',
    defaultMessage: 'Launch has retries of the test cases',
  },
});

const ItemNameTooltip = withTooltip({
  TooltipComponent: TextTooltip,
  data: {
    dynamicWidth: true,
    tooltipTriggerClass: cx('name'),
  },
})(({ children }) => children);

@injectIntl
@connect((state) => ({
  sauceLabsIntegrations: availableIntegrationsByPluginNameSelector(state, SAUCE_LABS),
  extensions: uiExtensionLaunchItemComponentsSelector(state),
  isStepLevel: isStepLevelSelector(state),
}))
@track()
export class ItemInfo extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    sauceLabsIntegrations: PropTypes.array.isRequired,
    value: PropTypes.object,
    refFunction: PropTypes.func,
    customProps: PropTypes.object,
    isStepLevel: PropTypes.bool,
    hideEdit: PropTypes.bool,
    extensions: PropTypes.arrayOf(extensionType),
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
    onClickRetries: PropTypes.func,
    hideDescription: PropTypes.bool,
  };

  static defaultProps = {
    value: {},
    customProps: {
      ownLinkParams: {},
      onEditItem: () => {},
      onClickAttribute: () => {},
      onOwnerClick: () => {},
      events: {},
      withExtensions: false,
    },
    isStepLevel: false,
    hideEdit: false,
    onClickRetries: () => {},
    refFunction: null,
    extensions: [],
    hideDescription: false,
  };

  handleEditItem = () => {
    const { onEditItem, events } = this.props.customProps;
    if (onEditItem) {
      onEditItem(this.props.value);
      this.props.tracking.trackEvent(events.CLICK_EDIT_ICON);
    }
  };

  renderSauceLabsLabel = () => {
    const isSauceLabsIntegrationAvailable = !!getSauceLabsConfig(this.props.value.attributes);
    if (isSauceLabsIntegrationAvailable && this.props.sauceLabsIntegrations.length) {
      return (
        <i className={cx('sauce-labs-label')} title={PLUGIN_NAME_TITLES[SAUCE_LABS]}>
          {Parser(SauceLabsIcon)}
        </i>
      );
    }
    return null;
  };

  render() {
    const {
      intl,
      value,
      hideEdit,
      refFunction,
      isStepLevel,
      tracking,
      onClickRetries,
      customProps,
      extensions,
      hideDescription,
    } = this.props;

    const startTime = new Date(value.startTime).getTime();
    const endTime = new Date(value.endTime).getTime();

    const autoAnalysisLabel = value.analysing?.find(
      (item) => item === ANALYZER_TYPES.AUTO_ANALYZER || item === ANALYZER_TYPES.CLUSTER_ANALYSER,
    );
    const patternAnalyzingLabel = value.analysing?.find(
      (item) => item === ANALYZER_TYPES.PATTERN_ANALYSER,
    );

    const onNameClick = () => {
      const { events } = customProps;
      events.CLICK_ITEM_NAME && tracking.trackEvent(events.CLICK_ITEM_NAME);
    };

    return (
      <div ref={refFunction} className={cx('item-info')}>
        <div className={cx('main-info')}>
          <NameLink
            itemId={value.id}
            ownLinkParams={customProps.ownLinkParams}
            className={cx('name-link')}
            onClick={onNameClick}
          >
            <ItemNameTooltip tooltipContent={value.name}>
              <span>{formatItemName(value.name)}</span>
            </ItemNameTooltip>
          </NameLink>
          <span className={cx('edit-number-box')}>
            <NameLink
              itemId={value.id}
              ownLinkParams={customProps.ownLinkParams}
              className={cx('name-link')}
              onClick={() => tracking.trackEvent(LAUNCHES_PAGE_EVENTS.CLICK_ITEM_NAME)}
            >
              {value.number && <span className={cx('number')}>#{value.number}</span>}
            </NameLink>
            {autoAnalysisLabel && (
              <div className={cx('item-badge', 'auto-analysis')}>Auto-analysis</div>
            )}
            {patternAnalyzingLabel && (
              <div className={cx('item-badge', 'pattern-analysis')}>Pattern-analysis</div>
            )}
            {value.rerun && <div className={cx('item-badge', 'rerun')}>Rerun</div>}
            {!hideEdit && (
              <span className={cx('edit-icon')} onClick={this.handleEditItem}>
                {Parser(PencilIcon)}
              </span>
            )}
          </span>
        </div>

        <div className={cx('additional-info')}>
          {value.retentionPolicy === RETENTION_POLICY.IMPORTANT && (
            <span className={cx('retention-policy')}>
              <div className={cx('star-icon')}>{Parser(StarIcon)}</div>
              Important
            </span>
          )}
          {value.status !== IN_PROGRESS &&
            customProps.withExtensions &&
            extensions.map((extension) => (
              <ExtensionLoader
                key={extension.name}
                extension={extension}
                item={value}
                withPreloader
              />
            ))}
          {!!startTime && (
            <span className={cx('duration-block')}>
              <DurationBlock
                type={value.type}
                status={value.status}
                itemNumber={value.number}
                timing={{
                  start: startTime,
                  end: endTime,
                  approxTime: value.approximateDuration,
                }}
              />
            </span>
          )}
          {!!startTime && <div className={cx('mobile-start-time')}>{fromNowFormat(startTime)}</div>}
          {value.hasRetries && (
            <div className={cx('retry-icon')} title={intl.formatMessage(messages.retryTooltip)}>
              {Parser(RetryIcon)}
            </div>
          )}
          {value.owner && <OwnerBlock owner={value.owner} onClick={customProps.onOwnerClick} />}
          {isStepLevel && this.renderSauceLabsLabel()}
          {!!value.attributes?.length && (
            <AttributesBlock
              attributes={value.attributes}
              onClickAttribute={customProps.onClickAttribute}
              isAttributeClickable
            />
          )}
          {isStepLevel && (
            <div className={cx('mobile-info')}>
              @{formatMethodType(intl.formatMessage, value.type)}
              <span className={cx('mobile-status')}>
                {formatStatus(intl.formatMessage, value.status)}
              </span>
            </div>
          )}
          {isStepLevel && value.retries && value.retries.length > 0 && (
            <div className={cx('retries-counter')}>
              <RetriesCounter testItem={value} onLabelClick={onClickRetries} />
            </div>
          )}
          {value.description && !hideDescription && (
            <div className={cx('item-description')}>
              <MarkdownViewer value={value.description} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

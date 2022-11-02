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

import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { DASHBOARD_PAGE_EVENTS } from 'components/main/analytics/events';
import { DashboardGridList } from './dashboardGridList';

@injectIntl
export class DashboardGrid extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    dashboardItems: PropTypes.array,
  };

  static defaultProps = {
    dashboardItems: [],
  };

  render() {
    const { dashboardItems, intl, ...rest } = this.props;

    return (
      <Fragment>
        <DashboardGridList
          dashboardList={dashboardItems}
          nameEventInfo={DASHBOARD_PAGE_EVENTS.DASHBOARD_NAME_CLICK}
          {...rest}
        />
      </Fragment>
    );
  }
}

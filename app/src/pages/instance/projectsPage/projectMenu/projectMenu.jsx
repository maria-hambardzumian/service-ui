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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import track from 'react-tracking';
import {
  assignToProjectAction,
  unassignFromProjectAction,
  assignedProjectsSelector,
  userIdSelector,
} from 'controllers/user';
import { showModalAction } from 'controllers/modal';
import { deleteProjectAction, navigateToProjectSectionAction } from 'controllers/instance/projects';
import { fetchProjectSuccessAction } from 'controllers/project';
import { MEMBERS, MONITORING } from 'common/constants/projectSections';
import { DotsMenuButton, SEPARATOR_ITEM, DANGER_ITEM } from 'components/buttons/dotsMenuButton';
import { ADMIN_PROJECTS_PAGE_EVENTS } from 'components/main/analytics/events';
import { navigateToProjectSettingsAction } from 'controllers/instance/projects/actionCreators';
import { fetch } from 'common/utils';
import { URLS } from 'common/urls';
import { messages } from '../messages';

@connect(
  (state, ownProps) => ({
    isAssigned: !!assignedProjectsSelector(state)[ownProps.project.projectName],
    userId: userIdSelector(state),
  }),
  {
    showModal: showModalAction,
    assignToProject: assignToProjectAction,
    unassignFromProject: unassignFromProjectAction,
    deleteProject: deleteProjectAction,
    navigateToProjectSection: navigateToProjectSectionAction,
    navigateToProjectSettings: navigateToProjectSettingsAction,
    fetchProjectSuccess: fetchProjectSuccessAction,
  },
)
@injectIntl
@track()
export class ProjectMenu extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    isAssigned: PropTypes.bool.isRequired,
    userId: PropTypes.string.isRequired,
    navigateToProjectSection: PropTypes.func.isRequired,
    navigateToProjectSettings: PropTypes.func.isRequired,
    fetchProjectSuccess: PropTypes.func.isRequired,
    assignToProject: PropTypes.func.isRequired,
    unassignFromProject: PropTypes.func.isRequired,
    deleteProject: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
  };

  onAssign = () => {
    const { assignToProject, project, tracking } = this.props;
    tracking.trackEvent(ADMIN_PROJECTS_PAGE_EVENTS.ASSIGN_ACTION);
    assignToProject(project);
  };

  onUnassign = () => {
    const { unassignFromProject, project, tracking } = this.props;
    tracking.trackEvent(ADMIN_PROJECTS_PAGE_EVENTS.UNASSIGN_ACTION);
    unassignFromProject(project);
  };

  onDelete = () => {
    const { showModal, intl, userId, project, tracking } = this.props;
    const { projectName } = project;
    tracking.trackEvent(ADMIN_PROJECTS_PAGE_EVENTS.DELETE_PROJECT_BTN);
    showModal({
      id: 'deleteItemsModal',
      data: {
        items: [project],
        onConfirm: this.onDeleteSubmit,
        header: intl.formatMessage(messages.deleteModalHeader),
        mainContent: intl.formatMessage(messages.deleteModalContent, {
          name: `'<b>${projectName}</b>'`,
        }),
        userId,
        eventsInfo: {
          closeIcon: ADMIN_PROJECTS_PAGE_EVENTS.CLOSE_ICON_DELETE_MODAL,
          cancelBtn: ADMIN_PROJECTS_PAGE_EVENTS.CANCEL_BTN_DELETE_MODAL,
          deleteBtn: ADMIN_PROJECTS_PAGE_EVENTS.DELETE_BTN_DELETE_MODAL,
        },
      },
    });
  };

  onDeleteSubmit = () => {
    this.props.deleteProject(this.props.project);
  };

  getMenuItems = () => {
    const { intl, project, isAssigned, userId } = this.props;
    const isPersonalProject = project.projectName === `${userId}_personal`;
    return [
      {
        onClick: this.navigateToMembers,
        label: intl.formatMessage(messages.members),
        value: 'action-members',
      },
      {
        onClick: this.navigateToEventsMonitoring,
        label: intl.formatMessage(messages.monitoring),
        value: 'action-monitoring',
      },
      {
        onClick: this.navigateToSettings,
        label: intl.formatMessage(messages.settings),
        value: 'action-settings',
      },
      {
        type: SEPARATOR_ITEM,
      },
      {
        onClick: this.onUnassign,
        label: intl.formatMessage(messages.unassign),
        value: 'action-unassign',
        hidden: !isAssigned,
        disabled: isPersonalProject,
        title: isPersonalProject ? intl.formatMessage(messages.unassignFromPersonal) : '',
      },
      {
        onClick: this.onAssign,
        label: intl.formatMessage(messages.assign),
        value: 'action-assign',
        hidden: isAssigned,
      },
      {
        onClick: this.onDelete,
        label: intl.formatMessage(messages.delete),
        value: 'action-delete',
        type: DANGER_ITEM,
      },
    ];
  };

  navigateWithFetchProject = (projectKey, payload, path) => {
    fetch(URLS.projectByName(projectKey)).then((project) => {
      this.props.fetchProjectSuccess(project);
      this.props.navigateToProjectSection(payload, path);
    });
  };

  navigateToMembers = () => {
    const {
      tracking: { trackEvent },
      project: { organizationSlug, projectSlug, projectKey },
    } = this.props;

    trackEvent(ADMIN_PROJECTS_PAGE_EVENTS.MEMBERS_ACTION);
    this.navigateWithFetchProject(projectKey, { organizationSlug, projectSlug }, MEMBERS);
  };

  navigateToSettings = () => {
    const {
      tracking: { trackEvent },
      project: { organizationSlug, projectSlug },
    } = this.props;

    trackEvent(ADMIN_PROJECTS_PAGE_EVENTS.SETTINGS_ACTION);
    this.props.navigateToProjectSettings({ organizationSlug, projectSlug });
  };

  navigateToEventsMonitoring = () => {
    const {
      tracking: { trackEvent },
      project: { organizationSlug, projectSlug, projectKey },
    } = this.props;

    trackEvent(ADMIN_PROJECTS_PAGE_EVENTS.CLICK_EVENT_MONITORING);
    this.navigateWithFetchProject(projectKey, { organizationSlug, projectSlug }, MONITORING);
  };

  render() {
    return (
      <DotsMenuButton
        items={this.getMenuItems()}
        onClick={() => this.props.tracking.trackEvent(ADMIN_PROJECTS_PAGE_EVENTS.PROJECT_MENU)}
      />
    );
  }
}

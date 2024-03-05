/*
 * Copyright 2023 EPAM Systems
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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { useTracking } from 'react-tracking';
import { useIntl } from 'react-intl';
import { canUpdateSettings } from 'common/utils/permissions';
import {
  projectNotificationsSelector,
  projectNotificationsStateSelector,
  updateProjectNotificationAction,
  deleteProjectNotificationAction,
  addProjectNotificationAction,
  projectNotificationsLoadingSelector,
} from 'controllers/project';
import { isEmailIntegrationAvailableSelector } from 'controllers/plugins';
import { showModalAction } from 'controllers/modal';
import { activeProjectRoleSelector, userAccountRoleSelector } from 'controllers/user';
import { EmptyStatePage } from 'pages/inside/projectSettingsPageContainer/content/emptyStatePage';
import { Button } from 'componentLibrary/button';
import { Checkbox } from 'componentLibrary/checkbox';
import { withTooltip } from 'componentLibrary/tooltip';
import {
  fetchProjectNotificationsAction,
  updateNotificationStateAction,
} from 'controllers/project/actionCreators';
import PencilIcon from 'common/img/newIcons/pencil-inline.svg';
import BinIcon from 'common/img/newIcons/bin-inline.svg';
import CopyIcon from 'common/img/newIcons/copy-inline.svg';
import { SpinningPreloader } from 'components/preloaders/spinningPreloader';
import { PROJECT_SETTINGS_NOTIFICATIONS_EVENTS } from 'analyticsEvents/projectSettingsPageEvents';
import { docsReferences, createExternalLink } from 'common/utils';
import {
  RuleList,
  FieldElement,
  NotificationRuleContent,
  FormattedDescription,
  MODAL_ACTION_TYPE_ADD,
  MODAL_ACTION_TYPE_EDIT,
  MODAL_ACTION_TYPE_COPY,
} from '../elements';
import { Layout } from '../layout';
import { SettingsPageContent } from '../settingsPageContent';
import styles from './notifications.scss';
import { DEFAULT_CASE_CONFIG } from './constants';
import { convertNotificationCaseForSubmission } from './utils';
import { messages } from './messages';

const cx = classNames.bind(styles);
const COPY_POSTFIX = '_copy';

const TooltipComponent = ({ tooltip }) => <p>{tooltip}</p>;
TooltipComponent.propTypes = {
  tooltip: PropTypes.string.isRequired,
};

const ButtonWithTooltip = withTooltip({
  ContentComponent: TooltipComponent,
})(Button);

export const Notifications = ({ setHeaderTitleNode }) => {
  const { formatMessage } = useIntl();
  const { trackEvent } = useTracking();
  const dispatch = useDispatch();

  const projectRole = useSelector(activeProjectRoleSelector);
  const userRole = useSelector(userAccountRoleSelector);
  const enabled = useSelector(projectNotificationsStateSelector);
  const notifications = useSelector(projectNotificationsSelector);
  const isEmailIntegrationAvailable = useSelector(isEmailIntegrationAvailableSelector);
  const loading = useSelector(projectNotificationsLoadingSelector);

  useEffect(() => {
    dispatch(fetchProjectNotificationsAction());
  }, []);

  const isAbleToEdit = () =>
    canUpdateSettings(userRole, projectRole) && isEmailIntegrationAvailable;

  const toggleNotificationsEnabled = (isEnabled) => {
    trackEvent(PROJECT_SETTINGS_NOTIFICATIONS_EVENTS.CLICK_CHECKBOX_AUTO_NOTIFICATIONS(isEnabled));
    dispatch(updateNotificationStateAction(isEnabled));
  };

  const confirmAdd = (newNotification) => {
    const notification = convertNotificationCaseForSubmission(newNotification);
    dispatch(addProjectNotificationAction(notification));
  };

  const confirmEdit = (notification) => {
    dispatch(
      updateProjectNotificationAction(
        convertNotificationCaseForSubmission({
          ...notification,
          name: notification.ruleName,
        }),
      ),
    );
  };

  const confirmDelete = (id) => {
    dispatch(deleteProjectNotificationAction(id));
  };

  const onAdd = () => {
    trackEvent(PROJECT_SETTINGS_NOTIFICATIONS_EVENTS.CLICK_CREATE_RULE_BUTTON);

    dispatch(
      showModalAction({
        id: 'addEditNotificationModal',
        data: {
          actionType: MODAL_ACTION_TYPE_ADD,
          onSave: confirmAdd,
          notification: DEFAULT_CASE_CONFIG,
          notifications,
        },
      }),
    );
  };

  const onEdit = (notification) => {
    trackEvent(PROJECT_SETTINGS_NOTIFICATIONS_EVENTS.CLICK_ICON_EDIT_NOTIFICATIONS);

    dispatch(
      showModalAction({
        id: 'addEditNotificationModal',
        data: {
          actionType: MODAL_ACTION_TYPE_EDIT,
          onSave: confirmEdit,
          notification,
          notifications,
        },
      }),
    );
  };

  const onDelete = (notification) => {
    trackEvent(PROJECT_SETTINGS_NOTIFICATIONS_EVENTS.CLICK_ICON_DELETE_NOTIFICATIONS);

    dispatch(
      showModalAction({
        id: 'deleteNotificationModal',
        data: {
          onSave: () => confirmDelete(notification.id),
        },
      }),
    );
  };

  const onCopy = (notification) => {
    trackEvent(PROJECT_SETTINGS_NOTIFICATIONS_EVENTS.CLICK_ICON_DUPLICATE_NOTIFICATIONS);

    const { id, ...newNotification } = notification;
    dispatch(
      showModalAction({
        id: 'addEditNotificationModal',
        data: {
          actionType: MODAL_ACTION_TYPE_COPY,
          onSave: (withoutAttributes) => confirmAdd(withoutAttributes),
          notification: {
            ...newNotification,
            ruleName: notification.ruleName + COPY_POSTFIX,
          },
          notifications,
        },
      }),
    );
  };

  useEffect(() => {
    if (notifications.length > 0) {
      setHeaderTitleNode(
        <span className={cx('button')}>
          {isAbleToEdit() ? (
            <Button onClick={onAdd} dataAutomationId="createNotificationRuleButton">
              {formatMessage(messages.create)}
            </Button>
          ) : (
            <ButtonWithTooltip
              disabled
              mobileDisabled
              tooltip={formatMessage(messages.notConfiguredNotificationTooltip)}
              dataAutomationId="createNotificationRuleButton"
            >
              {formatMessage(messages.create)}
            </ButtonWithTooltip>
          )}
        </span>,
      );
    }

    return () => setHeaderTitleNode(null);
  }, [notifications]);

  const onToggleHandler = (isEnabled, notification) => {
    trackEvent(PROJECT_SETTINGS_NOTIFICATIONS_EVENTS.SWITCH_NOTIFICATION_RULE(isEnabled));

    dispatch(
      updateProjectNotificationAction(
        convertNotificationCaseForSubmission({ ...notification, enabled: isEnabled }),
      ),
    );
  };

  const isReadOnly = !isAbleToEdit();

  const actions = [
    {
      icon: CopyIcon,
      handler: onCopy,
      dataAutomationId: 'duplicateNotificationRuleIcon',
    },
    {
      icon: PencilIcon,
      handler: onEdit,
      dataAutomationId: 'editNotificationRuleIcon',
    },
    {
      icon: BinIcon,
      handler: onDelete,
      dataAutomationId: 'deleteNotificationRuleIcon',
    },
  ];

  const handleRuleItemClick = (isShown) => {
    if (isShown) {
      trackEvent(PROJECT_SETTINGS_NOTIFICATIONS_EVENTS.CLICK_TO_EXPAND_NOTIFICATIONS_DETAILS);
    }
  };

  const handleDocumentationClick = () => {
    trackEvent(PROJECT_SETTINGS_NOTIFICATIONS_EVENTS.clickDocumentationLink('no_notifications'));
  };

  if (loading) {
    return <SpinningPreloader />;
  }

  return (
    <>
      {notifications.length ? (
        <SettingsPageContent>
          <Layout
            description={
              <FormattedDescription
                content={formatMessage(messages.tabDescription, {
                  a: (data) => createExternalLink(data, docsReferences.notificationsDocs),
                })}
                event={PROJECT_SETTINGS_NOTIFICATIONS_EVENTS.clickDocumentationLink()}
              />
            }
          >
            <FieldElement
              withoutProvider
              description={formatMessage(messages.toggleNote)}
              dataAutomationId="notificationsEnabledCheckbox"
            >
              <Checkbox
                disabled={isReadOnly}
                value={enabled}
                onChange={(e) => toggleNotificationsEnabled(e.target.checked)}
              >
                {formatMessage(messages.toggleLabel)}
              </Checkbox>
            </FieldElement>
          </Layout>
          <div className={cx('notifications-container')}>
            <RuleList
              disabled={isReadOnly}
              data={notifications.map((item) => ({ name: item.ruleName, ...item }))}
              actions={actions}
              onToggle={onToggleHandler}
              ruleItemContent={NotificationRuleContent}
              handleRuleItemClick={handleRuleItemClick}
              dataAutomationId="notificationsRulesList"
            />
          </div>
        </SettingsPageContent>
      ) : (
        <EmptyStatePage
          title={formatMessage(messages.noItemsMessage)}
          description={formatMessage(messages.notificationsInfo)}
          buttonName={formatMessage(messages.create)}
          buttonTooltip={isReadOnly && formatMessage(messages.notConfiguredNotificationTooltip)}
          buttonDataAutomationId="createNotificationRuleButton"
          documentationLink={docsReferences.emptyStateNotificationsDocs}
          disableButton={isReadOnly}
          handleButton={onAdd}
          handleDocumentationClick={handleDocumentationClick}
          imageType="bell"
        />
      )}
    </>
  );
};
Notifications.propTypes = {
  setHeaderTitleNode: PropTypes.func.isRequired,
};

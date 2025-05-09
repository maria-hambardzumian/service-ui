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

import { getBasicClickEventParameters } from './common/ga4Utils';

export const ADMIN_SERVER_SETTINGS_PAGE = 'server_settings';

const basicClickEventParametersAdminServerSettingsPage = getBasicClickEventParameters(
  ADMIN_SERVER_SETTINGS_PAGE,
);

export const submitAnalyticsBtn = (status) => ({
  ...basicClickEventParametersAdminServerSettingsPage,
  element_name: 'submit',
  status,
});

export const ADMIN_SERVER_SETTINGS_PAGE_EVENTS = {
  toggleSsoUsers: (switcherValue) => ({
    ...basicClickEventParametersAdminServerSettingsPage,
    element_name: 'sso',
    switcher: switcherValue ? 'on' : 'off',
  }),
  changeSessionInactivity: (condition) => ({
    ...basicClickEventParametersAdminServerSettingsPage,
    element_name: 'session_inactivity_timeout',
    condition,
  }),
  ANALYTICS_TAB: {
    ...basicClickEventParametersAdminServerSettingsPage,
    element_name: 'analytics',
  },
  // GA3 events
  AUTHORIZATION_CONFIGURATION_TAB: {
    category: ADMIN_SERVER_SETTINGS_PAGE,
    action: 'Click on tab Authorization Configuration',
    label: 'Open tab Authorization Configuration',
  },
  ACTIVATE_GITHUB_SWITCHER: {
    category: ADMIN_SERVER_SETTINGS_PAGE,
    action: 'Click on switcher Activate Github authorization on tab Authorization Configuration',
    label: 'On/off Activate Github authorization on tab Authorization Configuration',
  },
  ADD_GITHUB_ORGANIZATION_BTN: {
    category: ADMIN_SERVER_SETTINGS_PAGE,
    action: 'Click on Btn Add Github Organization on tab Authorization Configuration',
    label: 'Arise field to Add Github Organization on tab Authorization Configuration',
  },
  SUBMIT_GITHUB_BTN: {
    category: ADMIN_SERVER_SETTINGS_PAGE,
    action: 'Click on Btn Submit on GitHub block on tab Authorization Configuration',
    label: 'Submit changes for GitHub on tab Authorization Configuration',
  },
  ACTIVATE_AD_SWITCHER: {
    category: ADMIN_SERVER_SETTINGS_PAGE,
    action:
      'Click on switcher Activate Active Directory authorization on tab Authorization Configuration',
    label: 'On/off Activate Active Directory authorization on tab Authorization Configuration',
  },
  SUBMIT_AD_BTN: {
    category: ADMIN_SERVER_SETTINGS_PAGE,
    action: 'Click on Btn Submit on Active Directory block on tab Authorization Configuration',
    label: 'Submit changes for Active Directory on tab Authorization Configuration',
  },
  ACTIVATE_LDAP_SWITCHER: {
    category: ADMIN_SERVER_SETTINGS_PAGE,
    action: 'Click on switcher Activate LDAP authorization on tab Authorization Configuration',
    label: 'On/off Activate LDAP authorization on tab Authorization Configuration',
  },
  SUBMIT_LDAP_BTN: {
    category: ADMIN_SERVER_SETTINGS_PAGE,
    action: 'Click on Btn Submit on LDAP block on tab Authorization Configuration',
    label: 'Submit changes for LDAP on tab Authorization Configuration',
  },
  MAKE_RP_GREAT_AGAIN_CHECK: {
    category: ADMIN_SERVER_SETTINGS_PAGE,
    action: 'Edit checkbox Help make ReportPortal better on tab Analytics',
    label: 'Check Help make ReportPortal better on tab Analytics',
  },
  MAKE_RP_GREAT_AGAIN_UNCHECK: {
    category: ADMIN_SERVER_SETTINGS_PAGE,
    action: 'Edit checkbox Help make ReportPortal better on tab Analytics',
    label: 'Uncheck Help make ReportPortal better on tab Analytics',
  },
};

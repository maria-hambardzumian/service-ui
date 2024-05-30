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

import { combineReducers } from 'redux';
import {
  SET_ACTIVE_PROJECT,
  SET_START_TIME_FORMAT,
  SETTINGS_INITIAL_STATE,
  SET_PHOTO_TIME_STAMP,
  ASSIGN_TO_PROJECT_SUCCESS,
  UNASSIGN_FROM_PROJECT_SUCCESS,
  FETCH_USER_SUCCESS,
  SET_API_KEYS,
  ADD_API_KEY_SUCCESS,
  DELETE_API_KEY_SUCCESS,
  SET_ACTIVE_PROJECT_KEY,
  SET_LOG_TIME_FORMAT,
} from './constants';

export const settingsReducer = (state = SETTINGS_INITIAL_STATE, { type = '', payload = {} }) => {
  switch (type) {
    case SET_START_TIME_FORMAT:
      return { ...state, startTimeFormat: payload };
    case SET_LOG_TIME_FORMAT:
      return { ...state, logTimeFormat: payload };
    case SET_PHOTO_TIME_STAMP:
      return { ...state, photoTimeStamp: payload };
    default:
      return state;
  }
};

export const activeProjectKeyReducer = (state = '', { type, payload }) => {
  switch (type) {
    case SET_ACTIVE_PROJECT_KEY:
      return payload;
    default:
      return state;
  }
};

export const activeProjectReducer = (state = '', { type = '', payload = {} }) => {
  switch (type) {
    case SET_ACTIVE_PROJECT:
      return payload;
    default:
      return state;
  }
};

export const userAssignedProjectReducer = (state = {}, { type = '', payload = {} }) => {
  switch (type) {
    case ASSIGN_TO_PROJECT_SUCCESS: {
      const { projectName, projectRole, entryType } = payload;
      return {
        ...state,
        [projectName]: {
          projectRole,
          entryType,
        },
      };
    }
    case UNASSIGN_FROM_PROJECT_SUCCESS: {
      const { projectName } = payload;
      return Object.keys(state).reduce(
        (result, assignedProjectName) =>
          assignedProjectName === projectName
            ? result
            : {
                ...result,
                [assignedProjectName]: state[assignedProjectName],
              },
        {},
      );
    }
    default:
      return state;
  }
};

export const userInfoReducer = (state = {}, { type = '', payload = {} }) => {
  switch (type) {
    case FETCH_USER_SUCCESS:
      return payload;
    case ASSIGN_TO_PROJECT_SUCCESS:
    case UNASSIGN_FROM_PROJECT_SUCCESS:
      return {
        ...state,
        assignedProjects: userAssignedProjectReducer(state.assignedProjects, { type, payload }),
      };
    default:
      return state;
  }
};

export const apiKeysReducer = (state = [], { type, payload }) => {
  switch (type) {
    case SET_API_KEYS:
      return payload.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    case ADD_API_KEY_SUCCESS:
      return [payload, ...state];
    case DELETE_API_KEY_SUCCESS:
      return state.filter((key) => key.id !== payload);
    default:
      return state;
  }
};

export const userReducer = combineReducers({
  info: userInfoReducer,
  activeProject: activeProjectReducer,
  activeProjectKey: activeProjectKeyReducer,
  settings: settingsReducer,
  apiKeys: apiKeysReducer,
});

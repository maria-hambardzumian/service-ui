/*
 * Copyright 2025 EPAM Systems
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

import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { Modal, FieldText } from '@reportportal/ui-kit';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { hideModalAction, withModal } from 'controllers/modal';
import { FieldProvider } from 'components/fields';
import { commonValidators } from 'common/utils/validation';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';

import { messages } from './messages';

export const CREATE_PRODUCT_VERSION_MODAL_KEY = 'createProductVersionModal';

const CreateProductVersionModal = ({ data: { onSubmit }, handleSubmit }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const okButton = {
    children: formatMessage(COMMON_LOCALE_KEYS.CREATE),
    onClick: handleSubmit(onSubmit),
  };

  return (
    <Modal
      title={formatMessage(messages.title)}
      okButton={okButton}
      cancelButton={{ children: formatMessage(COMMON_LOCALE_KEYS.CANCEL) }}
      onClose={() => dispatch(hideModalAction())}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldProvider name="productVersion" placeholder={formatMessage(messages.namePlaceholder)}>
          <FieldErrorHint provideHint={false}>
            <FieldText label={formatMessage(messages.name)} defaultWidth={false} />
          </FieldErrorHint>
        </FieldProvider>
      </form>
    </Modal>
  );
};

CreateProductVersionModal.propTypes = {
  data: PropTypes.shape({
    onSubmit: PropTypes.func.isRequired,
  }),
  handleSubmit: PropTypes.func.isRequired,
};

withModal(CREATE_PRODUCT_VERSION_MODAL_KEY)(
  reduxForm({
    form: 'createProductVersionForm',
    validate: ({ productVersion }) => ({
      productVersion: commonValidators.createProjectVersionValidator()(productVersion),
    }),
  })(CreateProductVersionModal),
);

/*
 *
 * EntityNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import { getPasswordCurrentField } from 'utils/forms';

import {
  saveEntity,
  createDeleteMultipleEntities,
  openPasswordModal,
} from 'containers/App/actions';

import Content from 'components/Content';
import AuthForm from 'components/forms/AuthForm';
import messages from './messages';

export class UserPasswordConfirm extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      data,
      action,
      intl,
    } = this.props;
    return (
      <div>
        <Content inModal>
          <AuthForm
            inModal
            initialValues={{ password: '' }}
            headerTitle="Your password is required to update protected information"
            handleSubmit={(formData) => this.props.handleSubmit(
              formData,
              action,
              data,
            )}
            labels={{ submit: intl.formatMessage(messages.submit) }}
            handleCancel={this.props.onCancel}
            fields={[
              getPasswordCurrentField({ formatMessage: intl.formatMessage }),
            ]}
          />
        </Content>
      </div>
    );
  }
}

UserPasswordConfirm.propTypes = {
  action: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  // inModal: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formValues, action, data) => {
      if (action === 'saveEntity') {
        // console.log(formValues)
        dispatch(saveEntity(data.toJS(), formValues.password));
      }
      if (action === 'createDeleteMultipleEntities') {
        // console.log(formValues)
        dispatch(createDeleteMultipleEntities(data.toJS(), formValues.password));
      }
      dispatch(openPasswordModal(null));
    },
  };
}

export default injectIntl(connect(null, mapDispatchToProps)(UserPasswordConfirm));

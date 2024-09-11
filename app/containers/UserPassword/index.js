/*
 *
 * UserPassword
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import {
  getPasswordCurrentField,
  getPasswordNewField,
  getPasswordConfirmationField,
} from 'utils/forms';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';

import { updatePath } from 'containers/App/actions';

import { ROUTES } from 'containers/App/constants';
import messages from './messages';
import { FORM_INITIAL } from './constants';

import { save } from './actions';
import userPasswordSelector from './selectors';

export class UserPassword extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl, handleCancel, handleSubmit } = this.props;
    const { passwordSending, passwordError } = this.props.userPassword.get('page').toJS();
    const reference = this.props.params.id;
    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <ContentNarrow>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
          />
          {passwordError
            && <Messages type="error" messages={passwordError.messages} />
          }
          {passwordSending
            && <Loading />
          }
          <AuthForm
            sending={passwordSending}
            handleSubmit={(formData, actions) => handleSubmit(formData, reference, actions)}
            handleCancel={() => handleCancel(reference)}
            labels={{ submit: intl.formatMessage(messages.submit) }}
            initialValues={FORM_INITIAL}
            fields={[
              getPasswordCurrentField(intl.formatMessage),
              getPasswordNewField(intl.formatMessage),
              getPasswordConfirmationField(intl.formatMessage),
            ]}
          />
        </ContentNarrow>
      </div>
    );
  }
}

UserPassword.propTypes = {
  userPassword: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  params: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userPassword: userPasswordSelector(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formData, userId, { resetForm }) => {
      const saveData = {
        ...formData,
        id: userId,
      };
      dispatch(save(saveData));
      resetForm();
    },
    handleCancel: (userId) => {
      dispatch(updatePath(`${ROUTES.USERS}/${userId}`, { replace: true }));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UserPassword));

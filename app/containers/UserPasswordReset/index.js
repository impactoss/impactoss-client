/*
 *
 * UserPasswordReset
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import {
  getPasswordField,
  getPasswordConfirmationField,
} from 'utils/forms';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';

import { updatePath } from 'containers/App/actions';

import messages from './messages';

import { reset } from './actions';
import { selectDomain } from './selectors';

import { FORM_INITIAL } from './constants';

export class UserPasswordReset extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl, handleCancel, handleSubmit } = this.props;
    const { resetSending, resetError } = this.props.viewDomain.get('page').toJS();

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
          {resetError
            && <Messages type="error" messages={resetError.messages} />
          }
          {resetSending
            && <Loading />
          }
          <AuthForm
            model="userPasswordReset.form.data"
            sending={resetSending}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            initialValues={FORM_INITIAL}
            labels={{ submit: intl.formatMessage(messages.submit) }}
            fields={[
              getPasswordField({
                formatMessage: intl.formatMessage,
                isNotLogin: true,
              }),
              getPasswordConfirmationField({ formatMessage: intl.formatMessage }),
            ]}
          />
        </ContentNarrow>
      </div>
    );
  }
}

UserPasswordReset.propTypes = {
  viewDomain: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formData) => {
      dispatch(reset(formData));
    },
    handleCancel: () => {
      dispatch(updatePath('/'));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UserPasswordReset));

/*
 *
 * UserPasswordReset
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

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

export class UserPasswordReset extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.initialiseForm();
  }

  render() {
    const { intl } = this.context;
    const { resetSending, resetError } = this.props.viewDomain.get('page').toJS();

    return (
      <div>
        <Helmet
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
          { this.props.viewDomain.get('form')
            && (
              <AuthForm
                model="userPasswordReset.form.data"
                sending={resetSending}
                handleSubmit={(formData) => this.props.handleSubmit(formData)}
                handleCancel={this.props.handleCancel}
                labels={{ submit: intl.formatMessage(messages.submit) }}
                fields={[
                  getPasswordField(intl.formatMessage, '.password'),
                  getPasswordConfirmationField(intl.formatMessage, '.passwordConfirmation'),
                ]}
              />
            )
          }
        </ContentNarrow>
      </div>
    );
  }
}

UserPasswordReset.propTypes = {
  viewDomain: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  initialiseForm: PropTypes.func,
};

UserPasswordReset.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: () => {
      dispatch(formActions.reset('userPasswordReset.form.data'));
    },
    handleSubmit: (formData) => {
      dispatch(reset(formData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPasswordReset);

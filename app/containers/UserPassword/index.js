/*
 *
 * UserPassword
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

import ErrorMessages from 'components/ErrorMessages';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';

import { updatePath } from 'containers/App/actions';

import appMessages from 'containers/App/messages';
import messages from './messages';

import { save } from './actions';
import userPasswordSelector from './selectors';

export class UserPassword extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.initialiseForm();
  }
  render() {
    const { passwordSending, passwordError } = this.props.userPassword.page;
    const reference = this.props.params.id;
    const required = (val) => val && val.length;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <ContentNarrow>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
          />
          {passwordError &&
            <ErrorMessages error={passwordError} />
          }
          {passwordSending &&
            <Loading />
          }
          { this.props.userPassword.form &&
            <AuthForm
              model="userPassword.form.data"
              sending={passwordSending}
              handleSubmit={(formData) => this.props.handleSubmit(formData, reference)}
              handleCancel={() => this.props.handleCancel(reference)}
              labels={{ submit: this.context.intl.formatMessage(messages.submit) }}
              fields={[
                {
                  id: 'password',
                  controlType: 'input',
                  type: 'password',
                  model: '.attributes.password',
                  placeholder: this.context.intl.formatMessage(messages.fields.password.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
                  },
                },
                {
                  id: 'passwordNew',
                  controlType: 'input',
                  model: '.attributes.passwordNew',
                  type: 'password',
                  placeholder: this.context.intl.formatMessage(messages.fields.passwordNew.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
                  },
                },
                {
                  id: 'passwordConfirmation',
                  controlType: 'input',
                  model: '.attributes.passwordConfirmation',
                  type: 'password',
                  placeholder: this.context.intl.formatMessage(messages.fields.passwordConfirmation.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
                  },
                },
              ]}
            />
          }
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
  initialiseForm: PropTypes.func,
};

UserPassword.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userPassword: userPasswordSelector(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: () => {
      dispatch(formActions.reset('userPassword.form.data'));
    },
    handleSubmit: (formData, userId) => {
      const saveData = {
        ...formData.toJS(),
        id: userId,
      };
      dispatch(save(saveData));
    },
    handleCancel: (userId) => {
      dispatch(updatePath(`/users/${userId}`));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPassword);

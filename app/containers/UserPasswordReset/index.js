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

import ErrorMessages from 'components/ErrorMessages';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';

import { updatePath } from 'containers/App/actions';

import appMessages from 'containers/App/messages';
import messages from './messages';

import { reset } from './actions';
import { selectDomain } from './selectors';

export class UserPasswordReset extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.initialiseForm();
  }
  render() {
    const { resetSending, resetError } = this.props.viewDomain.page;
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
          {resetError &&
            <ErrorMessages error={resetError} />
          }
          {resetSending &&
            <Loading />
          }
          { this.props.viewDomain.form &&
            <AuthForm
              model="userPasswordReset.form.data"
              sending={resetSending}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              labels={{ submit: this.context.intl.formatMessage(messages.submit) }}
              fields={[
                {
                  id: 'password',
                  controlType: 'input',
                  model: '.password',
                  type: 'password',
                  placeholder: this.context.intl.formatMessage(messages.fields.password.placeholder),
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
                  model: '.passwordConfirmation',
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

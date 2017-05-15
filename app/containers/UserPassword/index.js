/*
 *
 * UserPassword
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';

import Page from 'components/Page';
import SimpleForm from 'components/forms/SimpleForm';

import { updatePath } from 'containers/App/actions';
import userPasswordSelector from './selectors';
import messages from './messages';
import { save } from './actions';


export class UserPassword extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
        <Page
          title={this.context.intl.formatMessage(messages.pageTitle)}
          actions={
            [
              {
                type: 'simple',
                title: 'Cancel',
                onClick: () => this.props.handleCancel(reference),
              },
              {
                type: 'primary',
                title: 'Update',
                onClick: () => this.props.handleSubmit(
                  this.props.userPassword.form.data,
                  reference
                ),
              },
            ]
          }
        >
          {passwordSending &&
            <p>Sending... </p>
          }
          {passwordError &&
            <p>{passwordError}</p>
          }
          { this.props.userPassword.form &&
            <SimpleForm
              model="userPassword.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData, reference)}
              handleCancel={() => this.props.handleCancel(reference)}
              labels={{ submit: 'Submit' }}
              fields={[
                {
                  id: 'password',
                  controlType: 'input',
                  model: '.attributes.password',
                  placeholder: this.context.intl.formatMessage(messages.fields.password.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(messages.fieldRequired),
                  },
                },
                {
                  id: 'passwordNew',
                  controlType: 'input',
                  model: '.attributes.passwordNew',
                  placeholder: this.context.intl.formatMessage(messages.fields.passwordNew.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(messages.fieldRequired),
                  },
                },
                {
                  id: 'passwordConfirmation',
                  controlType: 'input',
                  model: '.attributes.passwordConfirmation',
                  placeholder: this.context.intl.formatMessage(messages.fields.passwordConfirmation.placeholder),
                  validators: {
                    required,
                  },
                  errorMessages: {
                    required: this.context.intl.formatMessage(messages.fieldRequired),
                  },
                },
              ]}
            />
          }
        </Page>
      </div>
    );
  }
}

UserPassword.propTypes = {
  userPassword: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  params: PropTypes.object,
};

UserPassword.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userPassword: userPasswordSelector(state),
});

export function mapDispatchToProps(dispatch) {
  return {
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

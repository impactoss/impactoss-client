/*
 *
 * UserPasswordRecover
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import Page from 'components/Page';
import SimpleForm from 'components/forms/SimpleForm';

import { updatePath } from 'containers/App/actions';

import { recover } from './actions';
import makeUserPasswordRecoverSelector from './selectors';
import messages from './messages';

export class UserPasswordRecover extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
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
                onClick: this.props.handleCancel,
              },
              {
                type: 'primary',
                title: 'Recover',
                onClick: () => this.props.handleSubmit(
                  this.props.userPasswordRecover.form.data
                ),
              },
            ]
          }
        >
          { this.props.userPasswordRecover.form &&
            <SimpleForm
              model="userPasswordRecover.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              labels={{ submit: 'Recover password' }}
              fields={[
                {
                  id: 'email',
                  controlType: 'input',
                  model: '.email',
                  placeholder: this.context.intl.formatMessage(messages.fields.email.placeholder),
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

UserPasswordRecover.propTypes = {
  userPasswordRecover: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

UserPasswordRecover.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userPasswordRecover: makeUserPasswordRecoverSelector(),
});

export function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formData) => {
      dispatch(recover(formData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPasswordRecover);

/*
 *
 * UserPasswordRecover
 *
 */

import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';

import Icon from 'components/Icon';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';
import A from 'components/basic/A';

import { updatePath } from 'containers/App/actions';

import appMessages from 'containers/App/messages';
import messages from './messages';

import { recover } from './actions';
import makeUserPasswordRecoverSelector from './selectors';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

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
        <ContentNarrow>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
          />
          { this.props.userPasswordRecover.form &&
            <AuthForm
              model="userPasswordRecover.form.data"
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              labels={{ submit: this.context.intl.formatMessage(messages.submit) }}
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
                    required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
                  },
                },
              ]}
            />
          }
          <BottomLinks>
            <p>
              <A
                href="/login"
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.handleLink('/login');
                }}
              >
                <FormattedMessage {...messages.loginLink} />
                <Icon name="arrowRight" text textRight size="1em" />
              </A>
            </p>
          </BottomLinks>
        </ContentNarrow>
      </div>
    );
  }
}

UserPasswordRecover.propTypes = {
  userPasswordRecover: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
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
    handleLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPasswordRecover);

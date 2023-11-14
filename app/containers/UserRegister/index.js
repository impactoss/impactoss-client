/*
 *
 * UserRegister
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { actions as formActions } from 'react-redux-form/immutable';

import {
  getNameField,
  getEmailField,
  getPasswordField,
  getPasswordConfirmationField,
} from 'utils/forms';

import Icon from 'components/Icon';
import Messages from 'components/Messages';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';
import A from 'components/styled/A';

import { selectQueryMessages } from 'containers/App/selectors';
import { updatePath, dismissQueryMessages } from 'containers/App/actions';

import { PATHS } from 'containers/App/constants';

import messages from './messages';

import { register } from './actions';
import { selectDomain } from './selectors';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

export class UserRegister extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.initialiseForm();
  }

  render() {
    const { intl } = this.context;
    const { registerError, registerSending } = this.props.viewDomain.get('page').toJS();

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
          {this.props.queryMessages.info
            && (
              <Messages
                type="info"
                onDismiss={this.props.onDismissQueryMessages}
                messageKey={this.props.queryMessages.info}
              />
            )
          }
          {registerError
            && (
              <Messages
                type="error"
                messages={registerError.messages}
              />
            )
          }
          {registerSending
            && <Loading />
          }
          { this.props.viewDomain.get('form')
            && (
              <AuthForm
                model="userRegister.form.data"
                sending={registerSending}
                handleSubmit={(formData) => this.props.handleSubmit(formData)}
                handleCancel={this.props.handleCancel}
                labels={{ submit: intl.formatMessage(messages.submit) }}
                fields={[
                  getNameField(intl.formatMessage),
                  getEmailField(intl.formatMessage),
                  getPasswordField(intl.formatMessage),
                  getPasswordConfirmationField(intl.formatMessage),
                ]}
              />
            )
          }
          <BottomLinks>
            <p>
              <FormattedMessage {...messages.loginLinkBefore} />
              <A
                href={PATHS.LOGIN}
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.handleLink(PATHS.LOGIN, { keepQuery: true });
                }}
              >
                <FormattedMessage {...messages.loginLink} />
                <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
              </A>
            </p>
          </BottomLinks>
        </ContentNarrow>
      </div>
    );
  }
}

UserRegister.propTypes = {
  viewDomain: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
  initialiseForm: PropTypes.func,
  onDismissQueryMessages: PropTypes.func,
  queryMessages: PropTypes.object,
};

UserRegister.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  queryMessages: selectQueryMessages(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: () => {
      dispatch(formActions.reset('userRegister.form.data'));
    },
    handleSubmit: (formData) => {
      dispatch(register(formData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/'));
    },
    handleLink: (path, args) => {
      dispatch(updatePath(path, args));
    },
    onDismissQueryMessages: () => {
      dispatch(dismissQueryMessages());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);

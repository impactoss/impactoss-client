/*
 *
 * UserLogin
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
  getEmailFormField,
  getPasswordField,
} from 'utils/forms';


import ButtonHero from 'components/buttons/ButtonHero';
import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Icon from 'components/Icon';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';
import A from 'components/styled/A';

import { selectQueryMessages } from 'containers/App/selectors';
import { updatePath, dismissQueryMessages } from 'containers/App/actions';

import { ROUTES } from 'containers/App/constants';
import { ENABLE_AZURE, IS_PROD, SERVER } from 'themes/config';
import messages from './messages';

import { login, loginWithAzure } from './actions';
import { selectDomain } from './selectors';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

const AzureButton = styled(ButtonHero)`
  width: 100%;
`;


export class UserLogin extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.initialiseForm();
  }

  render() {
    const { intl } = this.context;
    const { authError, authSending } = this.props.viewDomain.get('page').toJS();

    const {
      handleSubmit,
      handleCancel,
      onDismissQueryMessages,
      queryMessages,
      handleSubmitWithAzure,
    } = this.props;

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
          {!IS_PROD && (
            <Messages
              type="info"
              messageKey="signingInServer"
              messageArgs={{ server: SERVER }}
            />
          )}
          {queryMessages.info
            && (
              <Messages
                type="info"
                onDismiss={onDismissQueryMessages}
                messageKey={queryMessages.info}
              />
            )
          }
          {authError
            && (
              <Messages
                type="error"
                messages={authError.messages}
              />
            )
          }
          {!ENABLE_AZURE && authSending
            && <Loading />
          }
          {!ENABLE_AZURE && (
            <>
              {this.props.viewDomain.get('form')
                && (
                  <AuthForm
                    model="userLogin.form.data"
                    sending={authSending}
                    handleSubmit={(formData) => handleSubmit(formData)}
                    handleCancel={handleCancel}
                    labels={{ submit: intl.formatMessage(messages.submit) }}
                    fields={[
                      getEmailFormField(intl.formatMessage, '.email'),
                      getPasswordField(intl.formatMessage, '.password'),
                    ]}
                  />
                )
              }
              <BottomLinks>
                <p>
                  <FormattedMessage {...messages.registerLinkBefore} />
                  <A
                    href={ROUTES.REGISTER}
                    onClick={(evt) => {
                      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                      this.props.handleLink(ROUTES.REGISTER, { keepQuery: true });
                    }}
                  >
                    <FormattedMessage {...messages.registerLink} />
                    <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
                  </A>
                </p>
                <p>
                  <A
                    href={ROUTES.RECOVER_PASSWORD}
                    onClick={(evt) => {
                      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                      this.props.handleLink(ROUTES.RECOVER_PASSWORD, { keepQuery: true });
                    }}
                  >
                    <FormattedMessage {...messages.recoverPasswordLink} />
                    <Icon name="arrowRight" text size="1.5em" sizes={{ mobile: '1em' }} />
                  </A>
                </p>
              </BottomLinks>
            </>
          )}
          {ENABLE_AZURE && (
            <>
              <div>
                {!authSending && (
                  <AzureButton onClick={() => handleSubmitWithAzure()}>
                    <FormattedMessage {...messages.submitWithAzure} />
                  </AzureButton>
                )}
                {authSending && <Loading />}
              </div>
            </>
          )}
        </ContentNarrow>
      </div>
    );
  }
}

UserLogin.propTypes = {
  viewDomain: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleSubmitWithAzure: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
  initialiseForm: PropTypes.func,
  onDismissQueryMessages: PropTypes.func,
  queryMessages: PropTypes.object,
};

UserLogin.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  queryMessages: selectQueryMessages(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: () => {
      dispatch(formActions.reset('userLogin.form.data'));
    },
    handleSubmit: (formData) => {
      dispatch(login(formData.toJS()));
      dispatch(dismissQueryMessages());
    },
    handleSubmitWithAzure: () => {
      dispatch(loginWithAzure());
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

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);

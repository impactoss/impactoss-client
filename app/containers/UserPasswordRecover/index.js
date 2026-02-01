/*
 *
 * UserPasswordRecover
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import styled from 'styled-components';

import {
  getEmailFormField,
} from 'utils/forms';

import Icon from 'components/Icon';
import Messages from 'components/Messages';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';
import A from 'components/styled/A';

import { ROUTES } from 'containers/App/constants';
import { updatePath } from 'containers/App/actions';
import { FORM_INITIAL } from './constants';


import messages from './messages';

import { recover } from './actions';
import { selectDomain } from './selectors';

const BottomLinks = styled.div`
  padding: 2em 0;
`;

export class UserPasswordRecover extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl, handleCancel, handleSubmit } = this.props;
    const { error, sending } = this.props.viewDomain.get('page').toJS();

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
          {error
            && <Messages type="error" messages={error.messages} />
          }
          {sending
            && <Loading />
          }
          <AuthForm
            sending={sending}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            initialValues={FORM_INITIAL}
            labels={{ submit: intl.formatMessage(messages.submit) }}
            fields={[
              getEmailFormField(intl.formatMessage),
            ]}
          />
          <BottomLinks>
            <p>
              <A
                href={ROUTES.LOGIN}
                onClick={(evt) => {
                  if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                  this.props.handleLink(ROUTES.LOGIN, { keepQuery: true });
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

UserPasswordRecover.propTypes = {
  viewDomain: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleLink: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formData) => {
      dispatch(recover(formData));
    },
    handleCancel: () => {
      dispatch(updatePath('/'));
    },
    handleLink: (path, args) => {
      dispatch(updatePath(path, args));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UserPasswordRecover));

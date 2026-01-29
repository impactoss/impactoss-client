/*
 * UserMfa
 * Configure multi-factor authentication
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import HelmetCanonical from 'components/HelmetCanonical';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import Loading from 'components/Loading';
import Messages from 'components/Messages';
import AuthForm from 'components/forms/AuthForm';
import { getPasswordCurrentField } from 'utils/forms';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { selectReady, selectEntity } from 'containers/App/selectors';

import messages from './messages';
import { DEPENDENCIES, FORM_INITIAL } from './constants';
import { enableMfa, disableMfa } from './actions';
import selectDomain from './selectors';

export class UserMfa extends React.PureComponent {
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  render() {
    const { intl, dataReady, user, viewDomain } = this.props;
    const mfaEnabled = user && user.getIn(['attributes', 'multi_factor_email_code_enabled']);

    const saveSending = viewDomain && viewDomain.get('saveSending');
    const saveError = viewDomain && viewDomain.get('saveError');
    const reference = this.props.params.id;

    return (
      <div>
        <HelmetCanonical title={intl.formatMessage(messages.pageTitle)} />
        <ContentNarrow>
          <ContentHeader title={intl.formatMessage(messages.pageTitle)} />
          {!dataReady && <Loading />}
          {saveError && saveError.messages && <Messages type="error" messages={saveError.messages} />}
          {saveSending && <Loading />}
          {dataReady && (
            <div>
              <p>
                <FormattedMessage {...messages.instructions} />
              </p>
              <p>
                <strong>
                  <FormattedMessage {...messages.currentStatus} />:{' '}
                </strong>
                {mfaEnabled ? <FormattedMessage {...messages.enabled} /> : <FormattedMessage {...messages.disabled} />}
              </p>
              <AuthForm
                sending={saveSending}
                handleSubmit={(formData, actions) => {
                  if (mfaEnabled) {
                    this.props.handleDisableMfa(reference, formData.password);
                  } else {
                    this.props.handleEnableMfa(reference, formData.password);
                  }
                  actions.resetForm();
                }}
                handleCancel={() => this.props.handleCancel(reference)}
                labels={{
                  submit: mfaEnabled
                    ? intl.formatMessage(messages.disableButton)
                    : intl.formatMessage(messages.enableButton),
                }}
                initialValues={FORM_INITIAL}
                fields={[getPasswordCurrentField(intl.formatMessage)]}
              />
            </div>
          )}
        </ContentNarrow>
      </div>
    );
  }
}

UserMfa.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleEnableMfa: PropTypes.func.isRequired,
  handleDisableMfa: PropTypes.func.isRequired,
  dataReady: PropTypes.bool,
  params: PropTypes.object.isRequired,
  user: PropTypes.object,
  viewDomain: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) =>
  createStructuredSelector({
    dataReady: (st) => selectReady(st, { path: DEPENDENCIES }),
    user: (st) => selectEntity(st, { id: props.params.id, path: 'users' }),
    viewDomain: selectDomain,
  });

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleCancel: (userId) => {
      dispatch(updatePath(`/users/${userId}`, { replace: true }));
    },
    handleEnableMfa: (userId, password) => {
      dispatch(enableMfa({ userId, password }));
    },
    handleDisableMfa: (userId, password) => {
      dispatch(disableMfa({ userId, password }));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UserMfa));

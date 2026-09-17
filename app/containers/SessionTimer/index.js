/**
 *
 * SessionTimer
 *
 * Watches the stored session expiry and triggers teardown when it passes.
 * Renders nothing. Mounted from App so that teardown does not depend on
 * any part of the UI being visible.
 *
 */

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sessionExpired, setSessionExpiry } from 'containers/App/actions';
import { selectSessionExpiresAt } from 'containers/App/selectors';
import { SESSION_TICK_INTERVAL } from 'containers/App/constants';
import { SESSION_EXPIRES_AT_KEY } from 'themes/config';

export function SessionTimer({ expiresAt, onExpired, onExpirySet }) {
  useEffect(() => {
    if (!expiresAt) return undefined;
    // compare against the stored expiry rather than counting down, so that
    // background throttling or the machine sleeping cannot skip the check
    const interval = setInterval(
      () => {
        if (Date.now() >= expiresAt) onExpired();
      },
      SESSION_TICK_INTERVAL,
    );
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  // tabs share one token and one server-side activity row, so an expiry set by
  // a ping in another tab applies here too. Without this an idle tab would tear
  // down a session another tab is keeping alive.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== SESSION_EXPIRES_AT_KEY) return;
      onExpirySet(event.newValue ? parseInt(event.newValue, 10) : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [onExpirySet]);

  return null;
}

SessionTimer.propTypes = {
  expiresAt: PropTypes.number,
  onExpired: PropTypes.func.isRequired,
  onExpirySet: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  expiresAt: selectSessionExpiresAt(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    onExpired: () => {
      dispatch(sessionExpired());
    },
    onExpirySet: (expiresAt) => {
      dispatch(setSessionExpiry(expiresAt));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionTimer);

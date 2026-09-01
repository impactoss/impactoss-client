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

import { sessionExpired } from 'containers/App/actions';
import { selectSessionExpiresAt } from 'containers/App/selectors';
import { SESSION_TICK_INTERVAL } from 'containers/App/constants';

export function SessionTimer({ expiresAt, onExpired }) {
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
  return null;
}

SessionTimer.propTypes = {
  expiresAt: PropTypes.number,
  onExpired: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  expiresAt: selectSessionExpiresAt(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    onExpired: () => {
      dispatch(sessionExpired());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionTimer);

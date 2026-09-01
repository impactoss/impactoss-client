/**
 *
 * SessionWarningModal
 *
 * Shown when the current session is close to expiring. Any interaction
 * extends the session, so the modal usually closes without the button
 * being used. The button is there so that the extend mechanism is a
 * named, operable control rather than an undocumented side effect. *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { FormattedMessage } from 'react-intl';
import { Box, Text } from 'grommet';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonDefault from 'components/buttons/ButtonDefault';
import Loading from 'components/Loading';

import { sessionActivity } from 'containers/App/actions';
import { selectSessionExpiresAt } from 'containers/App/selectors';
import { SESSION_TICK_INTERVAL, SESSION_WARNING_THRESHOLD } from 'containers/App/constants';

import messages from './messages';


const StyledTitle = styled(Text)`
  text-transform: uppercase;
  color: ${palette('text', 0)};
`;
const TitleWrapper = styled((p) => <Box {...p} />)`
  fill: ${palette('text', 0)};
`;

const StyledBodyText = styled(Text)`
  color: ${palette('dark', 0)};
`;


const SESSION_EXTEND_TIMEOUT = 10000;

export function SessionWarningModal({ expiresAt, onExtend }) {
  const [remaining, setRemaining] = useState(null);
  const [extending, setExtending] = useState(false);

  useEffect(() => {
    if (!expiresAt) {
      setRemaining(null);
      return undefined;
    }
    const update = () => {
      const remainingMs = expiresAt - Date.now();

      setRemaining(
        remainingMs <= SESSION_WARNING_THRESHOLD
          ? Math.max(0, Math.round(remainingMs / 1000))
          : null,
      );
    };
    update();
    const interval = setInterval(update, SESSION_TICK_INTERVAL);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // a successful ping changes the expiry and closes the modal, so this
  // only matters when the ping fails: release the button so it can be used again
  useEffect(() => {
    if (!extending) return undefined;
    const timeout = setTimeout(() => setExtending(false), SESSION_EXTEND_TIMEOUT);
    return () => clearTimeout(timeout);
  }, [extending]);

  if (remaining === null) return null;

  const minutes = Math.ceil(remaining / 60);

  return (
    <ReactModal
      isOpen
      appElement={document.getElementById('app')}
      contentLabel="Session expiring"
      className="session-warning-modal"
      overlayClassName="session-warning-modal-overlay"
      aria={{
        labelledby: 'session-dialog-title',
        describedby: 'session-dialog-desc',
      }}
    >
      <Box background="white" pad="large" round="small">
        <Box
          direction="row"
          justify="between"
          margin={{ bottom: 'medium' }}
          align="center"
        >
          <TitleWrapper direction="row" gap="small">
            <StyledTitle
              id="session-dialog-title"
              role="heading"
              aria-level="2"
              size="large"
              weight="bold"
            >
              <FormattedMessage {...messages.title} />
            </StyledTitle>
          </TitleWrapper>
        </Box>
        <Box gap="xsmall" id="session-dialog-desc">
          <StyledBodyText>
            {remaining >= 60
              ? <FormattedMessage {...messages.remainingMinutes} values={{ minutes }} />
              : <FormattedMessage {...messages.remainingSeconds} values={{ seconds: remaining }} />}
          </StyledBodyText>
          <StyledBodyText>
            <FormattedMessage {...messages.extendHint} />
          </StyledBodyText>
          {extending && <Loading />}
        </Box>
        <Box direction="row" justify="start" margin={{ top: 'ml' }}>
          <ButtonDefault
            disabled={extending}
            inactive={extending}
            onClick={() => {
              setExtending(true);
              onExtend();
            }}
          >
            <FormattedMessage {...messages.extendButton} />
          </ButtonDefault>
        </Box>
      </Box>
    </ReactModal>
  );
}

SessionWarningModal.propTypes = {
  expiresAt: PropTypes.number,
  onExtend: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  expiresAt: selectSessionExpiresAt(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    onExtend: () => {
      dispatch(sessionActivity());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionWarningModal);

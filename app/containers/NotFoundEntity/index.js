import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { showSettingsModal } from 'containers/App/actions';
import { selectSettingsFromQuery } from 'containers/App/selectors';
import A from 'components/styled/A';

import messages from './messages';

const SettingsLink = styled(A)`
  color: #ba5d03;
  &:hover {
    color: #ba5d03;
    text-decoration: underline;
  }
`;

const NotFoundEntity = ({
  type,
  id,
  settingsFromQuery,
  onShowSettingsModal,
}) => {
  const allActive = settingsFromQuery
    && Object.values(settingsFromQuery).every((value) => !!value);
  return (
    <>
      {allActive && (
        <p>
          <FormattedMessage {...messages.notFoundAllLoaded} values={{ type, id }} />
        </p>
      )}
      {!allActive && (
        <>
          <p>
            <FormattedMessage {...messages.notFound} values={{ type, id }} />
          </p>
          <p>
            <FormattedMessage
              {...messages.settingsHint}
              values={{
                settingsLink: (
                  <SettingsLink
                    onClick={() => onShowSettingsModal()}
                  >
                    <FormattedMessage {...messages.settingsLinkAnchor} />
                  </SettingsLink>
                ),
              }}
            />
          </p>
        </>
      )}
    </>
  );
};

NotFoundEntity.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  settingsFromQuery: PropTypes.object,
  onShowSettingsModal: PropTypes.func,
};


const mapStateToProps = (state) => ({
  settingsFromQuery: selectSettingsFromQuery(state),
});
function mapDispatchToProps(dispatch) {
  return {
    onShowSettingsModal: () => {
      dispatch(showSettingsModal(true));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotFoundEntity);

/*
 *
 * UserLogin
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';

// import { ROUTES } from 'containers/App/constants';
import {
  forwardOnAuthenticationChange,
  validateToken,
} from 'containers/App/actions';

import ContentNarrow from 'components/ContentNarrow';
import Loading from 'components/Loading';

import messages from './messages';

const UserLoginOAuthSuccess = ({
  intl, handleForward,
}) => {
  React.useEffect(() => {
    handleForward();
  }, []);
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
        <p>
          <FormattedMessage {...messages.note} />
        </p>
        <Loading />
      </ContentNarrow>
    </div>
  );
};

UserLoginOAuthSuccess.propTypes = {
  handleForward: PropTypes.func.isRequired,
  path: PropTypes.string,
  intl: intlShape,
};

export function mapDispatchToProps(dispatch) {
  return {
    onInvalidateEntities: () => {
    },
    handleForward: () => {
      dispatch(validateToken());
      dispatch(forwardOnAuthenticationChange());
    },
  };
}

export default connect(null, mapDispatchToProps)(injectIntl(UserLoginOAuthSuccess));

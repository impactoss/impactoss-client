/*
 * UserLogout
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';

import { logout } from 'containers/App/actions';

import messages from './messages';

export class UserLogout extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.doLogout();
  }

  render() {
    const { intl } = this.context;
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
          <Loading />
        </ContentNarrow>
      </div>
    );
  }
}

UserLogout.propTypes = {
  doLogout: PropTypes.func,
};

UserLogout.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    doLogout: () => {
      dispatch(logout());
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(null, mapDispatchToProps)(UserLogout);

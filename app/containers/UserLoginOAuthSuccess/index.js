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

// import { ROUTES } from 'containers/App/constants';
import { forwardOnAuthenticationChange } from 'containers/App/actions';
import ContentNarrow from 'components/ContentNarrow';
import Loading from 'components/Loading';

import messages from './messages';

export class UserLoginOAuthSuccess extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.handleForward();
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
          <p>
            <FormattedMessage {...messages.note} />
          </p>
          <Loading />
        </ContentNarrow>
      </div>
    );
  }
}

UserLoginOAuthSuccess.propTypes = {
  handleForward: PropTypes.func.isRequired,
  path: PropTypes.string,
};

UserLoginOAuthSuccess.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return {
    handleForward: () => {
      dispatch(forwardOnAuthenticationChange());
    },
  };
}

export default connect(null, mapDispatchToProps)(UserLoginOAuthSuccess);

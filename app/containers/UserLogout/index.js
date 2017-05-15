/*
 * UserLogout
 *
 */
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';

import { logout } from 'containers/App/actions';

import Page from 'components/Page';

import messages from './messages';

export class UserLogout extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.doLogout();
  }

  render() {
    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Page
          title={this.context.intl.formatMessage(messages.pageTitle)}
        >
          <FormattedMessage {...messages.header} />
        </Page>
      </div>
    );
  }
}

UserLogout.propTypes = {
  doLogout: React.PropTypes.func,
};

UserLogout.contextTypes = {
  intl: React.PropTypes.object.isRequired,
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

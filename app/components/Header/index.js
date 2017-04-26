import React from 'react';
import { FormattedMessage } from 'react-intl';

import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import messages from './messages';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    isSignedIn: React.PropTypes.bool,
    isManager: React.PropTypes.bool,
    userId: React.PropTypes.string,
  }

  render() {
    return (
      <NavBar>
        <HeaderLink to="/">
          <FormattedMessage {...messages.home} />
        </HeaderLink>
        <HeaderLink to="/categories">
          <FormattedMessage {...messages.taxonomies} />
        </HeaderLink>
        <HeaderLink to="/recommendations">
          <FormattedMessage {...messages.recommendations} />
        </HeaderLink>
        <HeaderLink to="/actions">
          <FormattedMessage {...messages.actions} />
        </HeaderLink>
        <HeaderLink to="/indicators">
          <FormattedMessage {...messages.indicators} />
        </HeaderLink>
        {this.props.isSignedIn && this.props.isManager &&
          <span>
            <HeaderLink to="/users">
              <FormattedMessage {...messages.users} />
            </HeaderLink>
            <HeaderLink to="/pages">
              <FormattedMessage {...messages.pages} />
            </HeaderLink>
          </span>
        }
        {this.props.isSignedIn &&
          <span>
            <HeaderLink to="/logout">
              <FormattedMessage {...messages.logout} />
            </HeaderLink>
            <HeaderLink to={`/users/${this.props.userId}`}>
              <FormattedMessage {...messages.user} />
            </HeaderLink>
          </span>
        }
        {!this.props.isSignedIn &&
          <span>
            <HeaderLink to="/login">
              <FormattedMessage {...messages.login} />
            </HeaderLink>
            <HeaderLink to="/register">
              <FormattedMessage {...messages.register} />
            </HeaderLink>
          </span>
        }
      </NavBar>
    );
  }
}

export default Header;

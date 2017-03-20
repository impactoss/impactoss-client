import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from 'components/Icon';

import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import messages from './messages';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    isSignedIn: React.PropTypes.bool,
  }

  render() {
    return (
      <div>
        <NavBar>
          <HeaderLink to="/">
            <Icon name="home" />
            <FormattedMessage {...messages.home} />
          </HeaderLink>
          <HeaderLink to="/categories">
            <FormattedMessage {...messages.taxonomies} />
          </HeaderLink>
          <HeaderLink to="/actions">
            <FormattedMessage {...messages.actions} />
          </HeaderLink>
          {this.props.isSignedIn &&
            <HeaderLink to="/logout">
              <FormattedMessage {...messages.logout} />
            </HeaderLink>
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
      </div>
    );
  }
}

export default Header;

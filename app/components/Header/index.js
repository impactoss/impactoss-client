import React from 'react';
import { FormattedMessage } from 'react-intl';

import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import messages from './messages';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <NavBar>
          <HeaderLink to="/">
            <FormattedMessage {...messages.home} />
          </HeaderLink>
          <HeaderLink to="/login">
            <FormattedMessage {...messages.login} />
          </HeaderLink>
          <HeaderLink to="/logout">
            <FormattedMessage {...messages.logout} />
          </HeaderLink>
          <HeaderLink to="/register">
            <FormattedMessage {...messages.register} />
          </HeaderLink>
        </NavBar>
      </div>
    );
  }
}

export default Header;

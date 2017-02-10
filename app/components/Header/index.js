import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
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
        </NavBar>
      </div>
    );
  }
}

export default Header;

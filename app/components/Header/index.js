import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

import HeaderComponent from './HeaderComponent';
import Top from './Top';
import Brand from './Brand';
import AppTitle from './AppTitle';
import Claim from './Claim';
import PageNav from './PageNav';
import PageLink from './PageLink';
import AccountNav from './AccountNav';
import AccountLink from './AccountLink';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    isSignedIn: React.PropTypes.bool,
    userId: React.PropTypes.string,
    currentPath: React.PropTypes.string,
    pages: React.PropTypes.array,
    navItems: React.PropTypes.array,
    onPageLink: React.PropTypes.func,
  }

  onClick = (evt, path) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.props.onPageLink(path);
  }

  render() {
    const { pages, navItems, isSignedIn, currentPath } = this.props;

    return (
      <HeaderComponent>
        <Top>
          <Brand href={'/'} onClick={(evt) => this.onClick(evt, '/')}>
            <AppTitle>
              <FormattedMessage {...messages.appTitle} />
            </AppTitle>
            <Claim>
              <FormattedMessage {...messages.claim} />
            </Claim>
          </Brand>
          <AccountNav>
            {isSignedIn &&
              <span>
                <AccountLink href={'/logout'} onClick={(evt) => this.onClick(evt, '/logout')}>
                  <FormattedMessage {...messages.logout} />
                </AccountLink>
                <AccountLink
                  href={`/users/${this.props.userId}`}
                  onClick={(evt) => this.onClick(evt, `/users/${this.props.userId}`)}
                >
                  <FormattedMessage {...messages.user} />
                </AccountLink>
              </span>
            }
            {!isSignedIn &&
              <span>
                <AccountLink href={'/login'} onClick={(evt) => this.onClick(evt, '/login')}>
                  <FormattedMessage {...messages.login} />
                </AccountLink>
                <AccountLink href={'/register'} onClick={(evt) => this.onClick(evt, '/register')}>
                  <FormattedMessage {...messages.register} />
                </AccountLink>
              </span>
            }
          </AccountNav>
          <PageNav>
            { pages &&
              pages.map((page, i) => (
                <PageLink
                  key={i}
                  href={page.path}
                  active={page.active || currentPath === page.path}
                  onClick={(evt) => this.onClick(evt, page.path)}
                >
                  {page.title}
                </PageLink>
              ))
            }
          </PageNav>
        </Top>
        <NavBar>
          { navItems &&
            navItems.map((item, i) => (
              <HeaderLink
                key={i}
                href={item.path}
                active={item.active || currentPath.startsWith(item.path)}
                onClick={(evt) => this.onClick(evt, item.path)}
              >
                {item.title}
              </HeaderLink>
            ))
          }
        </NavBar>
      </HeaderComponent>
    );
  }
}

export default Header;

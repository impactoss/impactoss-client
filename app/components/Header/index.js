import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { filter } from 'lodash/collection';

import { SHOW_HEADER_TITLE } from 'themes/config';

import appMessages from 'containers/App/messages';

import Logo from './Logo';
import Banner from './Banner';
import Brand from './Brand';
import BrandText from './BrandText';
import BrandTitle from './BrandTitle';
import BrandClaim from './BrandClaim';
import NavPages from './NavPages';
import NavAdmin from './NavAdmin';
import LinkPage from './LinkPage';
import NavAccount from './NavAccount';
import NavMain from './NavMain';
import LinkMain from './LinkMain';
import LinkAdmin from './LinkAdmin';


const Styled = styled.div`
  position: ${(props) => props.isHome ? 'relative' : 'absolute'};
  top:0;
  left:0;
  right:0;
  height:${(props) => props.isHome
    ? 0
    : props.theme.sizes.header.banner.height + props.theme.sizes.header.nav.height
  }px;
  background-color: ${palette('header', 0)};
  box-shadow: ${(props) => props.isHome ? 'none' : '0px 0px 15px 0px rgba(0,0,0,0.5)'};
  z-index: 101;
`;
const HomeNavWrap = styled.div`
  position: absolute;
  top:0;
  left:0;
  right:0;
  wdith: 100%;
  z-index: 101;
`;


class Header extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  onClick = (evt, path, currentPath) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if (currentPath) {
      if (currentPath === '/login' || currentPath === '/register') {
        this.props.onPageLink(path, { keepQuery: true });
      } else {
        this.props.onPageLink(path, { query: { arg: 'redirectOnAuthSuccess', value: currentPath } });
      }
    } else {
      this.props.onPageLink(path);
    }
  }

  render() {
    const { pages, isSignedIn, currentPath, isHome } = this.props;
    const navItems = filter(this.props.navItems, (item) => !item.isAdmin);
    const navItemsAdmin = filter(this.props.navItems, (item) => item.isAdmin);

    const appTitle = `${this.context.intl.formatMessage(appMessages.app.title)} - ${this.context.intl.formatMessage(appMessages.app.claim)}`;
    return (
      <Styled isHome={isHome}>
        { isHome &&
          <HomeNavWrap>
            <NavAccount
              isSignedIn={isSignedIn}
              user={this.props.user}
              onPageLink={this.props.onPageLink}
              currentPath={currentPath}
            />
            <NavPages>
              { pages && pages.map((page, i) => (
                <LinkPage
                  key={i}
                  href={page.path}
                  active={page.active || currentPath === page.path}
                  onClick={(evt) => this.onClick(evt, page.path)}
                >
                  {page.title}
                </LinkPage>
              ))}
            </NavPages>
          </HomeNavWrap>
        }
        { !isHome &&
          <Banner showPattern={!isHome}>
            <Brand
              href={'/'}
              onClick={(evt) => this.onClick(evt, '/')}
              title={appTitle}
            >
              <Logo src={this.props.theme.media.headerLogo} alt={appTitle} />
              { SHOW_HEADER_TITLE &&
                <BrandText>
                  <BrandTitle>
                    <FormattedMessage {...appMessages.app.title} />
                  </BrandTitle>
                  <BrandClaim>
                    <FormattedMessage {...appMessages.app.claim} />
                  </BrandClaim>
                </BrandText>
              }
            </Brand>
            <NavAccount
              isSignedIn={isSignedIn}
              user={this.props.user}
              onPageLink={this.props.onPageLink}
              currentPath={currentPath}
            />
            <NavPages>
              { pages && pages.map((page, i) => (
                <LinkPage
                  key={i}
                  href={page.path}
                  active={page.active || currentPath === page.path}
                  onClick={(evt) => this.onClick(evt, page.path)}
                >
                  {page.title}
                </LinkPage>
              ))}
            </NavPages>
            { navItemsAdmin &&
              <NavAdmin>
                { navItemsAdmin.map((item, i) => (
                  <LinkAdmin
                    key={i}
                    href={item.path}
                    active={item.active}
                    onClick={(evt) => this.onClick(evt, item.path)}
                  >
                    {item.title}
                  </LinkAdmin>
                ))}
              </NavAdmin>
            }
          </Banner>
        }
        { !isHome &&
          <NavMain hasBorder>
            { navItems && navItems.map((item, i) => (
              <LinkMain
                key={i}
                href={item.path}
                active={item.active || currentPath.startsWith(item.path)}
                onClick={(evt) => this.onClick(evt, item.path)}
              >
                {item.title}
              </LinkMain>
            ))}
          </NavMain>
        }
      </Styled>
    );
  }
}

Header.contextTypes = {
  intl: PropTypes.object.isRequired,
};

Header.propTypes = {
  isSignedIn: PropTypes.bool,
  user: PropTypes.object,
  currentPath: PropTypes.string,
  pages: PropTypes.array,
  navItems: PropTypes.array,
  onPageLink: PropTypes.func.isRequired,
  isHome: PropTypes.bool, // not shown on home page
  theme: PropTypes.object.isRequired, // not shown on home page
};

Header.defaultProps = {
  isHome: true,
};

export default withTheme(Header);

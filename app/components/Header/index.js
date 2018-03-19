import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { filter } from 'lodash/collection';

import {
  SHOW_HEADER_TITLE,
  SHOW_HEADER_PATTERN,
  SHOW_BRAND_ON_HOME,
} from 'themes/config';

import appMessages from 'containers/App/messages';
import Icon from 'components/Icon';

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
  position: ${(props) => {
    if (props.fixed) {
      return 'fixed';
    }
    return props.sticky ? 'absolute' : 'relative';
  }};
  top: 0;
  left: 0;
  right: 0;
  height:${(props) => {
    if (props.hasBrand) {
      if (props.hasNav) {
        return props.theme.sizes.header.banner.height + props.theme.sizes.header.nav.height;
      }
      return props.theme.sizes.header.banner.height;
    }
    return 0;
  }}px;
  background-color: ${(props) => props.hasBackground ? palette('header', 0) : 'transparent'};
  box-shadow: ${(props) => props.hasShadow ? '0px 0px 15px 0px rgba(0,0,0,0.5)' : 'none'};
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
      <Styled
        fixed={isHome}
        sticky={!isHome}
        hasBackground={!isHome}
        hasShadow={!isHome}
        hasNav={!isHome}
        hasBrand={SHOW_BRAND_ON_HOME || !isHome}
      >
        { !SHOW_BRAND_ON_HOME && isHome &&
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
        { (SHOW_BRAND_ON_HOME || !isHome) &&
          <Banner
            showPattern={(!isHome && SHOW_HEADER_PATTERN)}
          >
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
                align={item.align}
                icon={item.icon}
              >
                {item.title}
                { item.icon &&
                  <Icon title={item.title} name={item.icon} text textRight size={'1em'} />
                }
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

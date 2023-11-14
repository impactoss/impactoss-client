import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { filter } from 'lodash/collection';

import { truncateText } from 'utils/string';

import {
  SHOW_HEADER_TITLE,
  SHOW_HEADER_PATTERN,
  SHOW_BRAND_ON_HOME,
  TEXT_TRUNCATE,
} from 'themes/config';

import appMessages from 'containers/App/messages';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import ScreenReaderOnly from 'components/styled/ScreenReaderOnly';
import PrintHide from 'components/styled/PrintHide';

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
        return props.theme.sizes.header.banner.heightMobile + props.theme.sizes.header.nav.heightMobile;
      }
      return props.theme.sizes.header.banner.heightMobile;
    }
    return 0;
  }}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    height:${(props) => {
    if (props.hasBrand) {
      if (props.hasNav) {
        return props.theme.sizes.header.banner.height + props.theme.sizes.header.nav.height;
      }
      return props.theme.sizes.header.banner.height;
    }
    return 0;
  }}px;
  }
  background-color: ${(props) => props.hasBackground ? palette('header', 0) : 'transparent'};
  box-shadow: ${(props) => props.hasShadow ? '0px 0px 15px 0px rgba(0,0,0,0.5)' : 'none'};
  z-index: 101;
  @media print {
    display: ${({ isHome }) => isHome ? 'none' : 'block'};
    height: ${({ theme }) => theme.sizes.header.banner.height}px;
    position: static;
    box-shadow: none;
    background: white;
  }
`;
const HomeNavWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 101;
  color: ${palette('headerBrand', 0)};
`;

const NavSecondary = styled(PrintHide)`
  display: ${(props) => props.visible ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 99999;
  background-color:  ${palette('header', 0)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    position: relative;
    top: auto;
    bottom: auto;
    left: auto;
    right: auto;
    z-index: 300;
    display: block;
  }
`;
const ShowSecondary = styled(Button)`
  display: ${(props) => props.visible ? 'block' : 'none'};
  position: absolute;
  right: 0;
  top: 0;
  z-index: 300;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: none;
  }
  background-color: transparent;
`;
const HideSecondaryWrap = styled.div`
  background-color: ${palette('header', 0)};
  text-align: right;
  display: block;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: none;
  }
`;
const HideSecondary = styled(Button)``;

const LinkSuperTitle = styled.div`
  font-size: ${(props) => props.theme.sizes.text.smallMobile};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.theme.sizes.text.smaller};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;
const LinkTitle = styled.div`
  font-size: ${(props) => props.theme.sizes.text.small};
  font-weight: bold;
  color: ${(props) => props.active ? palette('headerNavMainItem', 1) : 'inherit'};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.theme.sizes.text.default};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;
const SelectFrameworks = styled(LinkMain)`
  display: none;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: inline-block;
    min-width: ${({ theme }) => theme.sizes.aside.width.small}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-width: ${({ theme }) => theme.sizes.aside.width.large}px;
  }
`;
const Search = styled(LinkMain)`
  display: none;
  color: ${(props) => props.active ? palette('headerNavMainItem', 1) : palette('headerNavMainItem', 0)};
  &:hover {
    color:${palette('headerNavMainItemHover', 0)};
  }
  padding: 2px ${(props) => props.theme.sizes.header.paddingLeft.mobile}px 1px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: inline-block;
    min-width: auto;
    padding: 15px ${(props) => props.theme.sizes.header.paddingLeft.small}px 0;
    position: absolute;
    right: 0;
    border-left: none;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-left: 24px;
    padding-right: 24px;
  }
`;

const FrameworkOptions = styled(PrintHide)`
  display: none;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    position: absolute;
    top: 100%;
    left: 0;
    display: block;
    min-width: ${({ theme }) => theme.sizes.aside.width.small}px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-width: ${({ theme }) => theme.sizes.aside.width.large}px;
  }
  background: white;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  margin-top: 3px;
  padding: 5px 0;
`;
const FrameworkOption = styled(Button)`
  display: block;
  width: 100%;
  text-align: left;
  &:hover {
    color:${palette('headerNavMainItemHover', 0)};
  }
  color: ${(props) => props.active ? palette('headerNavMainItem', 1) : 'inherit'};
`;

const STATE_INITIAL = {
  showSecondary: false,
  showFrameworks: false,
};

class Header extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = STATE_INITIAL;
    this.fwWrapperRef = React.createRef();
    this.fwButtonRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState(STATE_INITIAL);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousedown', this.handleClickOutside);
  }

  /**
   * Alert if clicked on outside of element
   * after https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
   */
  handleClickOutside = (evt) => {
    const wrapperContains = this.fwWrapperRef
      && this.fwWrapperRef.current
      && this.fwWrapperRef.current.contains(evt.target);
    const buttonContains = this.fwButtonRef
      && this.fwButtonRef.current
      && this.fwButtonRef.current.contains(evt.target);
    if (!wrapperContains && !buttonContains) {
      this.setState({ showFrameworks: false });
    }
  }

  onShowSecondary = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ showSecondary: true });
  };

  onHideSecondary = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ showSecondary: false });
  };

  onShowFrameworks = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ showFrameworks: true });
  };

  onHideFrameworks = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ showFrameworks: false });
  };

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

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.forceUpdate();
  };

  renderSecondary = (navItemsAdmin) => (
    <PrintHide>
      <ShowSecondary
        visible={!this.state.showSecondary}
        onClick={this.onShowSecondary}
      >
        <ScreenReaderOnly>
          <FormattedMessage {...appMessages.buttons.showSecondaryNavigation} />
        </ScreenReaderOnly>
        <Icon name="menu" hasStroke />
      </ShowSecondary>
      <NavSecondary
        visible={this.state.showSecondary}
        onClick={(evt) => {
          evt.stopPropagation();
          this.onHideSecondary();
        }}
      >
        <HideSecondaryWrap>
          <HideSecondary
            onClick={this.onHideSecondary}
          >
            <ScreenReaderOnly>
              <FormattedMessage {...appMessages.buttons.hideSecondaryNavigation} />
            </ScreenReaderOnly>
            <Icon name="close" size="30px" />
          </HideSecondary>
        </HideSecondaryWrap>
        <NavAccount
          isSignedIn={this.props.isSignedIn}
          user={this.props.user}
          onPageLink={(evt, path, query) => {
            if (evt !== undefined && evt.stopPropagation) evt.stopPropagation();
            this.onHideSecondary();
            this.props.onPageLink(path, query);
          }}
          currentPath={this.props.currentPath}
        />
        { navItemsAdmin
          && (
            <NavAdmin>
              { navItemsAdmin.map((item, i) => (
                <LinkAdmin
                  key={i}
                  href={item.path}
                  active={item.active}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    this.onHideSecondary();
                    this.onClick(evt, item.path);
                  }}
                >
                  {item.title}
                </LinkAdmin>
              ))}
            </NavAdmin>
          )
        }
        <NavPages>
          { this.props.pages && this.props.pages.map((page, i) => (
            <LinkPage
              key={i}
              href={page.path}
              active={page.active || this.props.currentPath === page.path}
              onClick={(evt) => this.onClick(evt, page.path)}
            >
              {page.title}
            </LinkPage>
          ))}
        </NavPages>
      </NavSecondary>
    </PrintHide>
  );

  render() {
    const {
      isHome,
      frameworkOptions,
      onSelectFramework,
      search,
    } = this.props;
    const { intl } = this.context;
    const navItems = filter(this.props.navItems, (item) => !item.isAdmin);
    const navItemsAdmin = filter(this.props.navItems, (item) => item.isAdmin);

    const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;

    const currentFrameworkOption = frameworkOptions
      && frameworkOptions.find((option) => option.active);
    return (
      <Styled
        isHome={isHome}
        fixed={isHome}
        sticky={!isHome}
        hasBackground={!isHome}
        hasShadow={!isHome}
        hasNav={!isHome}
        hasBrand={SHOW_BRAND_ON_HOME || !isHome}
      >
        {this.state.showFrameworks && (
          <FrameworkOptions ref={this.fwWrapperRef}>
            {frameworkOptions && frameworkOptions.map((option) => (
              <FrameworkOption
                key={option.value}
                active={option.active}
                onClick={() => {
                  onSelectFramework(option.value);
                  this.onHideFrameworks();
                }}
              >
                {option.label}
              </FrameworkOption>
            ))}
          </FrameworkOptions>
        )}
        { !SHOW_BRAND_ON_HOME && isHome
          && (
            <HomeNavWrap>
              { this.renderSecondary(navItemsAdmin) }
            </HomeNavWrap>
          )
        }
        {(SHOW_BRAND_ON_HOME || !isHome) && (
          <Banner
            showPattern={(!isHome && SHOW_HEADER_PATTERN)}
          >
            <Brand
              href="/"
              onClick={(evt) => this.onClick(evt, '/')}
              title={appTitle}
            >
              <Logo src={this.props.theme.media.headerLogo} alt={appTitle} />
              {SHOW_HEADER_TITLE && (
                <BrandText>
                  <BrandTitle>
                    <FormattedMessage {...appMessages.app.title} />
                  </BrandTitle>
                  <BrandClaim>
                    <FormattedMessage {...appMessages.app.claim} />
                  </BrandClaim>
                </BrandText>
              )}
            </Brand>
            {this.renderSecondary(navItemsAdmin)}
          </Banner>
        )}
        {!isHome && (
          <NavMain hasBorder>
            <SelectFrameworks
              as="button"
              ref={this.fwButtonRef}
              onClick={(evt) => this.state.showFrameworks
                ? this.onHideFrameworks(evt)
                : this.onShowFrameworks(evt)
              }
            >
              <LinkSuperTitle>
                {intl.formatMessage(appMessages.frameworks.single)}
              </LinkSuperTitle>
              {currentFrameworkOption && (
                <LinkTitle active>
                  {truncateText(
                    currentFrameworkOption.label,
                    TEXT_TRUNCATE.FW_SELECT,
                    false,
                  )}
                  {!this.state.showFrameworks && (
                    <Icon name="dropdownOpen" text textRight size="1em" />
                  )}
                  {this.state.showFrameworks && (
                    <Icon name="dropdownClose" text textRight size="1em" />
                  )}
                </LinkTitle>
              )}
            </SelectFrameworks>
            {navItems && navItems.map((item, i) => (
              <LinkMain
                key={i}
                href={item.path}
                active={item.active}
                onClick={(evt) => this.onClick(evt, item.path)}
              >
                <LinkSuperTitle>
                  {item.titleSuper}
                </LinkSuperTitle>
                <LinkTitle active={item.active}>
                  {item.title}
                </LinkTitle>
              </LinkMain>
            ))}
            {search && (
              <Search
                href={search.path}
                active={search.active}
                onClick={(evt) => this.onClick(evt, search.path)}
                icon={search.icon}
              >
                {search.title}
                {search.icon
                && <Icon title={search.title} name={search.icon} text textRight size="1em" />
                }
              </Search>
            )}
          </NavMain>
        )}
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
  onSelectFramework: PropTypes.func.isRequired,
  isHome: PropTypes.bool, // not shown on home page
  theme: PropTypes.object.isRequired,
  search: PropTypes.object,
  frameworkOptions: PropTypes.array,
};

Header.defaultProps = {
  isHome: true,
};

export default withTheme(Header);

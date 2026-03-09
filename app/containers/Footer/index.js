import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { Box, Text, ResponsiveContext } from 'grommet';
import { updatePath } from 'containers/App/actions';
import A from 'components/styled/A';

import qe from 'utils/quasi-equals';
import { isMaxSize, isMinSize } from 'utils/responsive';

import {
  selectEntitiesWhere,
  selectIsSignedIn,
} from 'containers/App/selectors';

import NormalImg from 'components/Img';
import Container from 'components/styled/Container';

import { ROUTES } from 'containers/App/constants';
import { VERSION, FOOTER } from 'themes/config';

import appMessages from 'containers/App/messages';
import messages from './messages';

const FooterMain = styled.div`
  background-color: ${palette('mainBackground', 0)};
  color: ${palette('dark', 1)};
  padding: 0 0 40px;
  border-bottom: 12px solid ${palette('primary', 0)};
  @media print {
    color: ${palette('text', 0)};
    background-color: transparent;
    border-top: 1px solid;
    border-bottom: 2px solid ${palette('primary', 0)};
  }
`;

const Upper = styled(
  (p) => (
    <Box
      justify="between"
      align="start"
      responsive={false}
      {...p}
    />
  ),
)``;
const Lower = styled(
  (p) => (
    <Box
      {...p}
    />
  ),
)``;

const FooterLinks = styled(
  (p) => <Box align="start" {...p} />,
)`
  @media print {
    display: none !important;
  }
`;
const FooterLink = styled(A)`
  display: inline-block;
  font-weight: 600;
  font-size: ${({ theme }) => theme.text.xsmall.size};
  color: ${palette('dark', 1)};
  &:hover, &:focus-visible {
    color: ${palette('primary', 0)};
  }
  &:focus-visible {
    text-decoration: underline;
    outline: none;
  }
`;

const LogoItemLink = styled(A)`
  &:hover {
    opacity: 0.8;
  }
`;

const Logo = styled(NormalImg)`
  height: ${({ isAgency }) => isAgency ? 42 : 50}px;
  margin-top: ${({ isAgency }) => isAgency ? 4 : 0}px;
  max-width: 100%;
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    height: ${({ isAgency }) => isAgency ? 45 : 55}px;
    margin-top: ${({ isAgency }) => isAgency ? 5 : 0}px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    height: ${({ isAgency }) => isAgency ? 56 : 68}px;
    margin-top: ${({ isAgency }) => isAgency ? 6 : 0}px;
  }
`;

const Wrapper = styled((p) => <Box margin={{ bottom: 'large' }} {...p} />)`
  font-size: 0.8em;
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    width: 100%;
    font-size: 0.9em;
    padding: 0;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    font-size: 1em;
  }
  @media print {
    padding: 0px;
    font-size: ${({ theme }) => theme.sizes.print.default};
  }
`;

const FooterNote = styled((p) => <Text size="xxxsmall" {...p} />)``;
const FooterVersion = styled((p) => <Text size="xxxsmall" {...p} />)``;
const Divider = styled.span`
  @media (min-width: ${({ theme }) => theme.breakpoints.xsmall}) {
    border-right: 1px solid rgba(0, 0, 0, 0.33);
    height: 20px;
  }
`;

const Footer = ({
  theme,
  onPageLink,
  pages,
  fill,
  isUserSignedIn,
}) => {
  const intl = useIntl();
  const size = useContext(ResponsiveContext);
  const isMobile = isMaxSize(size, 'xsmall');
  return (
    <FooterMain as="footer">
      <Container noPaddingBottom>
        <Wrapper fill={fill}>
          <Upper
            direction={isMobile ? 'column' : 'row'}
            border={!isMobile ? 'bottom' : false}
            pad={{
              top: 'medium',
            }}
          >
            <Box
              gap="small"
              pad={{ vertical: 'medium' }}
              border={isMobile ? 'bottom' : false}
              fill={isMobile ? 'horizontal' : false}
            >
              <Box>
                <FooterNote>
                  <FormattedMessage {...messages.disclaimer2} />
                </FooterNote>
              </Box>
              <Box>
                <Box
                  direction="row"
                  gap="medium"
                  wrap
                >
                  {theme.media.agencyLogos.map((src, i) => (
                    <LogoItemLink
                      key={i}
                      href={intl.formatMessage(messages.agencies[`url${i + 1}`])}
                      title={`${intl.formatMessage(messages.agencies[`title${i + 1}`])} (opens in new tab)`}
                      target="_blank"
                    >
                      <Logo isAgency src={src} alt={intl.formatMessage(messages.agencies[`title${i + 1}`])} />
                    </LogoItemLink>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box
              gap="small"
              border={isMobile ? 'bottom' : false}
              pad={{ vertical: 'medium' }}
              align={isMobile ? 'start' : 'end'}
              fill={isMobile ? 'horizontal' : false}
            >
              <Box>
                <FooterNote>
                  <FormattedMessage {...messages.project.text} />
                </FooterNote>
              </Box>
              <Box>
                <LogoItemLink
                  href={intl.formatMessage(messages.project.url)}
                  title={`${intl.formatMessage(messages.project.anchor)} (opens in new tab)`}
                  target="_blank"
                >
                  <Logo src={theme.media.impactossLogo} alt={intl.formatMessage(messages.project.anchor)} />
                </LogoItemLink>
              </Box>
            </Box>
          </Upper>
          <Lower gap={isMobile ? 'medium' : 'xsmall'}>
            {pages && (
              <FooterLinks
                direction={isMobile ? 'column' : 'row'}
                justify={isMobile ? 'start' : 'between'}
                gap={isMobile ? 'small' : 'none'}
                pad={{ top: isMobile ? 'medium' : 'small' }}
              >
                <Box
                  direction={isMobile ? 'column' : 'row'}
                  gap="small"
                  align={isMobile ? 'start' : 'end'}
                  role="navigation"
                >
                  <FooterLink
                    target="_blank"
                    href={`mailto:${intl.formatMessage(messages.contact.email)}`}
                    title={intl.formatMessage(messages.contactUs)}
                  >
                    <FormattedMessage {...messages.contactUs} />
                  </FooterLink>
                </Box>
                <Box
                  direction={isMobile ? 'column' : 'row'}
                  gap="small"
                  align={isMobile ? 'start' : 'end'}
                  role="navigation"
                  responsive={false}
                >
                  {isUserSignedIn && (
                    <FooterLink
                      onClick={(evt) => {
                        if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                        onPageLink(ROUTES.BOOKMARKS);
                      }}
                      href={ROUTES.BOOKMARKS}
                    >
                      <FormattedMessage {...appMessages.nav.bookmarks} />
                    </FooterLink>
                  )}
                  <FooterLink
                    onClick={(evt) => {
                      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                      onPageLink(ROUTES.SEARCH);
                    }}
                    href={ROUTES.SEARCH}
                  >
                    <FormattedMessage {...appMessages.nav.search} />
                  </FooterLink>
                  {isMinSize(size, 'small') && (<Divider />)}
                  {pages.size > 0 && FOOTER.INTERNAL_LINKS && FOOTER.INTERNAL_LINKS.map((pageId) => {
                    const page = pages.find((p) => qe(p.get('id'), pageId));
                    return page
                      ? (
                        <FooterLink
                          key={pageId}
                          onClick={(evt) => {
                            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                            onPageLink(`${ROUTES.PAGES}/${pageId}`);
                          }}
                          href={`${ROUTES.PAGES}/${pageId}`}
                        >
                          {page.getIn(['attributes', 'menu_title']) || page.getIn(['attributes', 'title'])}
                        </FooterLink>
                      )
                      : null;
                  })}
                </Box>
              </FooterLinks>
            )}
            <FooterLinks
              border={isMobile ? 'top' : false}
              direction={isMobile ? 'column' : 'row'}
              justify={isMobile ? 'end' : 'between'}
              gap={isMobile ? 'small' : 'none'}
              pad={{ top: isMobile ? 'medium' : 'xxsmall' }}
            >
              <FooterLink
                target="_blank"
                href={`${intl.formatMessage(messages.govLinkHref)}`}
                title={intl.formatMessage(messages.govLinkAnchor)}
              >
                <FormattedMessage {...messages.govLinkAnchor} />
              </FooterLink>
              <FooterVersion>
                {`${intl.formatMessage(appMessages.app.title)} ${intl.formatMessage(appMessages.app.claim)}: IMPACT OSS v${VERSION}`}
              </FooterVersion>
            </FooterLinks>
          </Lower>
        </Wrapper>
      </Container>
    </FooterMain>
  );
};


Footer.propTypes = {
  theme: PropTypes.object.isRequired,
  onPageLink: PropTypes.func.isRequired,
  pages: PropTypes.object,
  fill: PropTypes.bool,
  // hasBorder: PropTypes.bool,
  isUserSignedIn: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  pages: selectEntitiesWhere(state, {
    path: 'pages',
    where: { draft: false },
  }),
  isUserSignedIn: selectIsSignedIn(state),
});
function mapDispatchToProps(dispatch) {
  return {
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Footer));

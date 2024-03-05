import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { Box, Text, ResponsiveContext } from 'grommet';
import { updatePath } from 'containers/App/actions';
import A from 'components/styled/A';

import qe from 'utils/quasi-equals';
import { isMinSize } from 'utils/responsive';

import { selectEntitiesWhere } from 'containers/App/selectors';

import NormalImg from 'components/Img';
import Container from 'components/styled/Container';

import { ROUTES } from 'containers/App/constants';
import { VERSION, FOOTER } from 'themes/config';

import appMessages from 'containers/App/messages';
import messages from './messages';

const FooterMain = styled.div`
  margin-top: 80px;
  background-color: transparent;
  color: ${palette('dark', 1)};
  padding: 0;
  @media print {
    color: ${palette('text', 0)};
  }
`;

const FooterLink = styled(A)`
  display: inline-block;
  font-weight: 600;
  font-size: ${({ theme }) => theme.text.xsmall.size};
  color: ${palette('dark', 1)};
  &:hover {
    color: ${palette('dark', 2)};
  }
`;

const LogoItemLink = styled(A)`
  &:hover {
    opacity: 0.8;
  }
`;

const Logo = styled(NormalImg)`
  height: 50px;
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    height: 55px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    height: 68px;
  }
`;

const Wrapper = styled((p) => <Box margin={{ bottom: 'large' }} {...p} />)`
  font-size: 0.8em;
  padding: ${({ fill }) => fill ? 0 : '0px 30px'};
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    width: 100%;
    font-size: 0.9em;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    font-size: 1em;
  }
  @media print {
    font-size: ${({ theme }) => theme.sizes.print.default};
  }
`;
const BoxRow = styled((p) => <Box direction="row" {...p} />)``;

const FooterNote = styled((p) => <Text size="small" {...p} />)``;
const FooterVersion = styled((p) => <Text size="xxxsmall" {...p} />)``;

const Footer = ({
  intl,
  theme,
  onPageLink,
  pages,
  fill,
}) => {
  const size = useContext(ResponsiveContext);
  const isMobile = !isMinSize(size, 'medium');
  return (
    <FooterMain>
      <Container noPaddingBottom>
        <Wrapper fill={fill}>
          <Box
            direction={isMobile ? 'column' : 'row'}
            justify="between"
            border="top"
            align="start"
            pad={{ top: 'medium' }}
          >
            <Box gap="small" pad={{ bottom: isMobile ? 'medium' : 'small' }}>
              <Box>
                <FooterNote>
                  <FormattedMessage {...messages.agencies.note} />
                </FooterNote>
              </Box>
              <Box>
                <BoxRow gap="xsmall">
                  {theme.media.agencyLogos.map((src, i) => (
                    <LogoItemLink
                      key={i}
                      href={intl.formatMessage(messages.agencies[`url${i + 1}`])}
                      title={intl.formatMessage(messages.agencies[`title${i + 1}`])}
                      target="_blank"
                    >
                      <Logo src={src} alt={intl.formatMessage(messages.agencies[`title${i + 1}`])} />
                    </LogoItemLink>
                  ))}
                </BoxRow>
              </Box>
            </Box>
            <Box gap="small" align="end">
              <Box>
                <FooterNote>
                  <FormattedMessage {...messages.project.text} />
                </FooterNote>
              </Box>
              <Box>
                <LogoItemLink
                  href={intl.formatMessage(messages.project.url)}
                  title={intl.formatMessage(messages.project.anchor)}
                  target="_blank"
                >
                  <Logo src={theme.media.impactossLogo} alt={intl.formatMessage(messages.project.anchor)} />
                </LogoItemLink>
              </Box>
            </Box>
          </Box>
          <Box gap="xsmall">
            <Box
              direction={isMobile ? 'column' : 'row'}
              justify="between"
              border="top"
              margin={{ top: 'medium' }}
              pad={{ top: 'small' }}
            >
              {!isMobile
                && (
                  <Box>
                    <FooterLink
                      target="_blank"
                      href={`mailto:${intl.formatMessage(messages.contact.email)}`}
                      title={intl.formatMessage(messages.contactUs)}
                    >
                      <FormattedMessage {...messages.contactUs} />
                    </FooterLink>
                  </Box>
                )}
              <BoxRow gap="small" align="end">
                {isMobile
                  && (
                    <FooterLink
                      target="_blank"
                      href={`mailto:${intl.formatMessage(messages.contact.email)}`}
                      title={intl.formatMessage(messages.contactUs)}
                    >
                      <FormattedMessage {...messages.contactUs} />
                    </FooterLink>
                  )}
                {pages && pages.size > 0 && FOOTER.INTERNAL_LINKS && FOOTER.INTERNAL_LINKS.map((pageId) => {
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
                    : 'page not found';
                })}
                <FooterLink
                  target="_blank"
                  href={`${intl.formatMessage(messages.govLinkHref)}`}
                  title={intl.formatMessage(messages.govLinkAnchor)}
                >
                  <FormattedMessage {...messages.govLinkAnchor} />
                </FooterLink>
              </BoxRow>
            </Box>
            <Box>
              <FooterVersion>
                {`${intl.formatMessage(appMessages.app.title)}, version: ${VERSION}`}
              </FooterVersion>
            </Box>
          </Box>
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
  intl: intlShape,
};

const mapStateToProps = (state) => ({
  pages: selectEntitiesWhere(state, {
    path: 'pages',
    where: { draft: false },
  }),
});
function mapDispatchToProps(dispatch) {
  return {
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withTheme(Footer)));

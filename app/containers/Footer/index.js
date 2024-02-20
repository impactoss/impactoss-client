import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { Box, Text } from 'grommet';
import { updatePath } from 'containers/App/actions';

import qe from 'utils/quasi-equals';
import { selectEntitiesWhere } from 'containers/App/selectors';

import NormalImg from 'components/Img';
import Container from 'components/styled/Container';

import { ROUTES } from 'containers/App/constants';
import { VERSION, FOOTER } from 'themes/config';

import appMessages from 'containers/App/messages';
import messages from './messages';

const FooterMain = styled.div`
  margin-top: 50px;
  background-color: transparent;
  color: ${palette('dark', 1)};
  padding: 0;
  @media print {
    color: ${palette('text', 0)};
  }
`;

const FooterLink = styled.a`
  display:inline-block;
  font-weight:bold;
  color: ${palette('dark', 1)};
  &:hover {
    color: ${palette('dark', 2)};
  }
`;

const Logo = styled(NormalImg)`
  height: 55px;
  padding-right: ${({ hasRightPadding }) => hasRightPadding ? '2em' : 0};
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    height: 45px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    height: 65px;
  }
`;

const Wrapper = styled((p) => <Box margin={{ bottom: 'large' }} {...p} />)`
  font-size: 0.8em;
  padding: 0px 30px;
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

const BoxColumn = styled((p) => <Box {...p} />)``;

const Footer = ({
  intl,
  theme,
  onPageLink,
  pages,
}) => {
  const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;
  return (
    <FooterMain>
      <Container noPaddingBottom>
        <Wrapper>
          <BoxRow
            justify="between"
            border="top"
            align="start"
            pad={{ top: 'medium' }}
          >
            <BoxColumn gap="medium">
              <BoxColumn>
                <FormattedMessage {...messages.disclaimer2} />
              </BoxColumn>
              <BoxColumn>
                <BoxRow>
                  <Logo src={theme.media.nzGovLogo} alt={appTitle} hasRightPadding />
                  <Logo src={theme.media.nzJusticeLogo} alt={appTitle} />
                </BoxRow>
              </BoxColumn>
            </BoxColumn>
            <BoxColumn gap="medium">
              <BoxColumn>Powered By</BoxColumn>
              <BoxColumn>
                <Logo src={theme.media.impactossLogo} alt={intl.formatMessage(messages.project.anchor)} />
              </BoxColumn>
            </BoxColumn>
          </BoxRow>
          <BoxColumn gap="xsmall">
            <BoxRow
              justify="between"
              border="top"
              margin={{ top: 'large' }}
              pad={{ top: 'small' }}
            >
              <BoxColumn>
                <FooterLink
                  target="_blank"
                  href={`mailto:${intl.formatMessage(messages.contact.email)}`}
                  title={intl.formatMessage(messages.contactUs)}
                >
                  <FormattedMessage {...messages.contactUs} />
                </FooterLink>
              </BoxColumn>
              <BoxColumn>
                <BoxRow gap="small" align="start">
                  {pages && pages.size > 0 && FOOTER.INTERNAL_LINKS && FOOTER.INTERNAL_LINKS.map((pageId) => {
                    const page = pages.find((p) => qe(p.get('id'), pageId));
                    return (
                      <div key={pageId}>
                        {page && (
                          <FooterLink
                            onClick={(evt) => {
                              if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                              onPageLink(`${ROUTES.PAGES}/${pageId}`);
                            }}
                            href={`${ROUTES.PAGES}/${pageId}`}
                          >
                            {page.getIn(['attributes', 'menu_title']) || page.getIn(['attributes', 'title'])}
                          </FooterLink>
                        )}
                        {!page && 'page not found'}
                      </div>
                    );
                  })}
                  <FooterLink
                    target="_blank"
                    href={`${intl.formatMessage(messages.govLinkHref)}`}
                    title={intl.formatMessage(messages.govLinkAnchor)}
                  >
                    <FormattedMessage {...messages.govLinkAnchor} />
                  </FooterLink>
                </BoxRow>
              </BoxColumn>
            </BoxRow>
            <BoxRow>
              <BoxColumn>
                <Text size="small">
                  {`${intl.formatMessage(appMessages.app.title)}, version: ${VERSION}`}
                </Text>
              </BoxColumn>
            </BoxRow>
          </BoxColumn>
        </Wrapper>
      </Container>
    </FooterMain>
  );
};


Footer.propTypes = {
  theme: PropTypes.object.isRequired,
  onPageLink: PropTypes.func.isRequired,
  pages: PropTypes.object,
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

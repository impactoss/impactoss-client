import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';

import { updatePath } from 'containers/App/actions';

import NormalImg from 'components/Img';
import Container from 'components/styled/Container';

import { ROUTES } from 'containers/App/constants';
import { VERSION, CONTAINER_FOOTER } from 'themes/config';

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
  padding-right: 20px;
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

const Table = styled.div`
  font-size: 0.8em;
  padding: 0px 30px;
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    display: table;
    width: 100%;
    table-layout: fixed;
    font-size: 0.9em;
    border-collapse: collapse;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    font-size: 1em;
  }
  @media print {
    font-size: ${({ theme }) => theme.sizes.print.default};
  }
`;
const TableRow = styled.div`
display: table-row;
&:first-child > div {
  border-top: 1px solid ${palette('light', 3)};
}
&:nth-child(3) > div {
  border-top: 1px solid ${palette('light', 3)};
}
`;

const TableCell = styled.div`
  padding-top:${({ noHorizontalPadding, lessPadding }) => {
    if (noHorizontalPadding) {
      return '0em';
    }
    return lessPadding ? '0.4em' : '0.8em';
  }};
  padding-bottom:${({ noHorizontalPadding }) => noHorizontalPadding ? '0em' : '0.8em'};
  border-bottom: 1px solid ${palette('footer', 3)};
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    display: table-cell;
    vertical-align: top;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom: none;
    width: 50%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    padding-left: 35px;
    padding-right: 35px;
    padding-top:${({ noHorizontalPadding, lessPadding }) => {
    if (noHorizontalPadding) {
      return '0em';
    }
    return lessPadding ? '0.8em' : '1.6em';
  }};
    padding-bottom: ${({ noHorizontalPadding }) => noHorizontalPadding ? '0em' : '1.6em'};
  }
`;
const TableCellSmall = styled(TableCell)`
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    width: 25%;
  }
`;

const Footer = ({ intl, theme, onPageLink }) => {
  const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;
  return (
    <FooterMain>
      <Container noPaddingBottom>
        <Table>
          <TableRow>
            <TableCell>
              <FormattedMessage {...messages.disclaimer2} />
            </TableCell>
            <TableCellSmall>Powered By</TableCellSmall>
          </TableRow>
          <TableRow>
            <TableCell lessPadding>
              <Logo src={theme.media.nzGovLogo} alt={appTitle} hasRightPadding />
              <Logo src={theme.media.nzJusticeLogo} alt={appTitle} />
            </TableCell>
            <TableCellSmall lessPadding>
              <Logo src={theme.media.impactossLogo} alt={intl.formatMessage(messages.project.anchor)} />
            </TableCellSmall>
          </TableRow>
          <TableRow>
            <TableCellSmall lessPadding>
              <FooterLink
                target="_blank"
                href={`mailto:${intl.formatMessage(messages.contact.email)}`}
                title={intl.formatMessage(messages.contactUs)}
              >
                <FormattedMessage {...messages.contactUs} />
              </FooterLink>
            </TableCellSmall>
            <TableCell lessPadding>
              {CONTAINER_FOOTER.LINK_TARGET_INTERNAL && CONTAINER_FOOTER.LINKS.map((link) => (
                <FooterLink
                  onClick={(evt) => {
                    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                    onPageLink(`${ROUTES.PAGES}/${link.LINK_TARGET_INTERNAL_ID}`);
                  }}
                  href={`${ROUTES.PAGES}/${link.LINK_TARGET_INTERNAL_ID}`}
                >
                  <FormattedMessage {...messages.containerLinks[link.TYPE]} />
                </FooterLink>
              ))}
              <FooterLink
                target="_blank"
                href={`${intl.formatMessage(messages.govLink)}`}
                title={intl.formatMessage(messages.govLink)}
              >
                <FormattedMessage {...messages.govLink} />
              </FooterLink>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell noHorizontalPadding>
              <p>{`Version: ${VERSION}`}</p>
            </TableCell>
          </TableRow>
        </Table>
      </Container>
    </FooterMain>
  );
};


Footer.propTypes = {
  theme: PropTypes.object.isRequired,
  onPageLink: PropTypes.func.isRequired,
  intl: intlShape,
};

function mapDispatchToProps(dispatch) {
  return {
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

export default injectIntl(connect(null, mapDispatchToProps)(withTheme(Footer)));

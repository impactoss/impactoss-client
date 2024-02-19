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
  background-color: ${palette('mainBackground', 0)};
  color: ${palette('dark', 1)};
  padding: 0;
  @media print {
    color: ${palette('text', 0)};
    background: transparent;
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

const PartnerLogo = styled(NormalImg)`
  height: 55px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    height: 90px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    height: 80px;
  }
`;
const ImpactLogo = styled(NormalImg)`
  height: 90px;
`;

const TableWrapper = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-left: -15px;
    margin-right: -15px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    margin-left: -35px;
    margin-right: -35px;
  }
`;
const Table = styled.div`
  font-size: 0.8em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: table;
    width: 100%;
    table-layout: fixed;
    font-size: 0.9em;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 1em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

const TableRow = styled.div`
`;

const TableCell = styled.div`
  padding-top:${({ noPaddingHorizontal }) => noPaddingHorizontal ? '0em' : '0.8em'};
  padding-bottom:${({ noPaddingHorizontal }) => noPaddingHorizontal ? '0em' : '0.8em'}
  border-bottom: 1px solid ${palette('footer', 3)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: table-cell;
    vertical-align: top;
    width: 50%;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom: none;
    &:last-child {
      border-right: none;
    }
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-left: 35px;
    padding-right: 35px;
    padding-top:${({ noPaddingHorizontal }) => noPaddingHorizontal ? '0em' : '1.6em'};
    padding-bottom: ${({ noPaddingHorizontal }) => noPaddingHorizontal ? '0em' : '1.6em'};
  }
`;
const TableCellSmall = styled(TableCell)`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: 25%;
  }
`;
const Divider = styled.div`
border-top: 1px solid ${palette('light', 3)};
`;

const ContainerFooter = ({ intl, theme, onPageLink }) => {
  const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;
  return (
    <FooterMain>
      <Container noPaddingBottom>
        <TableWrapper>
          <Table>
            <Divider />
            <TableRow>
              <TableCell>
                <FormattedMessage {...messages.disclaimer2} />
              </TableCell>
              <TableCellSmall>Powered By</TableCellSmall>
            </TableRow>
            <TableRow>
              <TableCell>
                <PartnerLogo src={theme.media.nzGovLogo} alt={appTitle} />
              </TableCell>
              <TableCellSmall>
                <PartnerLogo src={theme.media.nzJusticeLogo} alt={appTitle} />
              </TableCellSmall>
              <TableCellSmall>
                <ImpactLogo src={theme.media.headerLogo} alt={intl.formatMessage(messages.project.anchor)} />
              </TableCellSmall>
            </TableRow>
            <Divider />
            <TableRow>
              <TableCell>
                <FooterLink
                  target="_blank"
                  href={`mailto:${intl.formatMessage(messages.contact.email)}`}
                  title={intl.formatMessage(messages.contactUs)}
                >
                  <FormattedMessage {...messages.contactUs} />
                </FooterLink>
              </TableCell>
              <TableCell>
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
              <TableCell noPaddingHorizontal>
                <p>{`Version: ${VERSION}`}</p>
              </TableCell>
            </TableRow>
          </Table>
        </TableWrapper>
      </Container>
    </FooterMain>
  );
};


ContainerFooter.propTypes = {
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

export default injectIntl(connect(null, mapDispatchToProps)(withTheme(ContainerFooter)));

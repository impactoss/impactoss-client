import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';

import NormalImg from 'components/Img';
import Container from 'components/styled/Container';
import A from 'components/styled/A';

import { SHOW_FOOTER_PARTNERS } from 'themes/config';
import responsibleLogo from 'themes/media/publisher-logo.png';

import messages from './messages';

const ResponsibleLogo = styled(NormalImg)`
  width: 100%;
  max-width: 170px;
  margin-top: 1em;
`;

const FooterLogos = styled.div`
  padding: 1.2em 0;
  background-color: ${palette('footer', 2)};
`;

const FooterMain = styled.div`
  background-color: ${palette('footer', 1)};
  color: ${palette('footer', 0)};
  padding: 0;
`;

const FooterLink = styled.a`
  font-weight:bold;
  color: ${palette('footerLinks', 0)};
  &:hover {
    color: ${palette('footerLinksHover', 0)};
  }
`;
const ImpactLink = styled.a`
  font-weight:bold;
  color: ${palette('footerLinks', 0)};
  &:hover {
    color: ${palette('footerLinksHover', 0)};
    opacity: 0.8;
  }
`;

const LogoList = styled.div`
  text-align: center;
`;
const LogoItem = styled.div`
  display: inline-block;
`;
const LogoItemLink = styled(A)`
  padding: 0 1.5em;
  display: block;
  &:hover {
    opacity: 0.8;
  }
`;
const PartnerLogo = styled(NormalImg)`
  height: 90px;
`;
const ImpactLogo = styled(NormalImg)`
  height: 90px;
`;

const Table = styled.div`
  display: table;
  margin-left: -35px;
  margin-right: -35px;
`;
const TableCell = styled.div`
  display: table-cell;
  width: 50%;
  vertical-align: top;
  padding-left: 35px;
  padding-right: 35px;
  padding-top: 2em;
  padding-bottom: 2em;
  border-right: 1px solid ${palette('footer', 3)};
  &:last-child {
    border-right: none;
  }
`;
const TableCellSmall = styled(TableCell)`
  width: 25%;
`;

class Footer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { theme } = this.props;
    return (
      <div>
        { SHOW_FOOTER_PARTNERS > 0 &&
          <FooterLogos>
            <Container noPaddingBottom>
              <LogoList>
                {
                  theme.media.partnerLogos.map((src, i) => (
                    <LogoItem key={i}>
                      <LogoItemLink
                        href={this.context.intl.formatMessage(messages.partners[`url${i + 1}`])}
                        title={this.context.intl.formatMessage(messages.partners[`title${i + 1}`])}
                        target="_blank"
                      >
                        <PartnerLogo src={src} alt={this.context.intl.formatMessage(messages.partners.title1)} />
                      </LogoItemLink>
                    </LogoItem>
                  ))
                }
              </LogoList>
            </Container>
          </FooterLogos>
        }
        <FooterMain>
          <Container noPaddingBottom>
            <Table>
              <TableCell>
                <FormattedMessage {...messages.disclaimer} />
                <FooterLink
                  target="_blank"
                  href={`mailto:${this.context.intl.formatMessage(messages.contact.email)}`}
                  title={this.context.intl.formatMessage(messages.contact.anchor)}
                >
                  <FormattedMessage {...messages.contact.anchor} />
                </FooterLink>
              </TableCell>
              <TableCellSmall>
                <FormattedMessage {...messages.responsible.text} />
                <div>
                  <FooterLink
                    target="_blank"
                    href={this.context.intl.formatMessage(messages.responsible.url)}
                    title={this.context.intl.formatMessage(messages.responsible.anchor)}
                  >
                    <FormattedMessage {...messages.responsible.anchor} />
                  </FooterLink>
                  <ResponsibleLogo src={responsibleLogo} alt={this.context.intl.formatMessage(messages.responsible.logo)} />
                </div>
              </TableCellSmall>
              <TableCellSmall>
                <FormattedMessage {...messages.project.text} />
                <div>
                  <ImpactLink
                    target="_blank"
                    href={this.context.intl.formatMessage(messages.project.url)}
                    title={this.context.intl.formatMessage(messages.project.anchor)}
                  >
                    <div>
                      <FormattedMessage {...messages.project.anchor} />
                    </div>
                    <ImpactLogo src={theme.media.impactossLogo} alt={this.context.intl.formatMessage(messages.project.anchor)} />
                  </ImpactLink>
                </div>
              </TableCellSmall>
            </Table>
          </Container>
        </FooterMain>
      </div>
    );
  }
}

Footer.propTypes = {
  theme: PropTypes.object.isRequired,
};

Footer.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default withTheme(Footer);

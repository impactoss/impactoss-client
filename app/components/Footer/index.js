import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Grid from 'grid-styled';

import NormalImg from 'components/Img';
import Container from 'components/styled/Container';
import Row from 'components/styled/Row';

import { SHOW_FOOTER_LOGOS } from 'containers/App/constants';

import partner1 from 'media/partner1.png';
import partner2 from 'media/partner2.png';
import partner3 from 'media/partner3.png';
import partner4 from 'media/partner4.png';
// const footerImages = requireAll(require.context('media/footer', true, /^\.\/.*\.png$/));

import messages from './messages';

const importLogos = [partner1, partner2, partner3, partner4];

const FooterMain = styled.div`
  background-color: ${palette('secondary', 1)};
  color: ${palette('primary', 4)};
  padding: 2em 0 3em;
`;

const FooterLink = styled.a`
  font-weight:bold;
  color: ${palette('primary', 4)};
  &:hover {
    color: ${palette('primary', 4)};
    opacity: 0.8;
  }
`;

const FooterLogos = styled.div`
  padding: 1.5em 0;
`;

const LogoList = styled.div`
  text-align: center;
`;
const LogoItem = styled.div`
  display: inline-block;
  padding: 0 1em;
`;
const LogoItemLink = styled.a`
  &:hover {
    opacity: 0.8;
  }
`;
const PartnerLogo = styled(NormalImg)`
  height: 80px;
`;

// const FooterProjectLink = styled.a`
//   font-weight:bold;
//   color: ${palette('primary', 4)};
// `;

class Footer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div>
        { SHOW_FOOTER_LOGOS > 0 &&
          <FooterLogos>
            <Container noPaddingBottom>
              <LogoList>
                {
                  importLogos.map((src, i) => (
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
          <Container>
            <Row>
              <Grid sm={1 / 2}>
                <FormattedMessage {...messages.disclaimer} />
                <FooterLink
                  target="_blank"
                  href={`mailto:${this.context.intl.formatMessage(messages.contact.email)}`}
                  title={this.context.intl.formatMessage(messages.contact.anchor)}
                >
                  <FormattedMessage {...messages.contact.anchor} />
                </FooterLink>
              </Grid>
              <Grid sm={1 / 4}>
                <FormattedMessage {...messages.responsible.text} />
                <div>
                  <FooterLink
                    target="_blank"
                    href={this.context.intl.formatMessage(messages.responsible.url)}
                    title={this.context.intl.formatMessage(messages.responsible.anchor)}
                  >
                    <FormattedMessage {...messages.responsible.anchor} />
                  </FooterLink>
                </div>
              </Grid>
              <Grid sm={1 / 4}>
                <FormattedMessage {...messages.project.text} />
                <div>
                  <FooterLink
                    target="_blank"
                    href={this.context.intl.formatMessage(messages.project.url)}
                    title={this.context.intl.formatMessage(messages.project.anchor)}
                  >
                    <FormattedMessage {...messages.project.anchor} />
                  </FooterLink>
                </div>
              </Grid>
            </Row>
          </Container>
        </FooterMain>
      </div>
    );
  }
}

Footer.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default Footer;

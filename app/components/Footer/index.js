import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Grid from 'grid-styled';

import NormalImg from 'components/Img';
import Container from 'components/styled/Container';
import Row from 'components/styled/Row';

import messages from './messages';

import hrclogo from './hrcnz-logo.png';

const HrcLogo = styled(NormalImg)`
  width: 100%;
  max-width: 170px;
  margin-top: 1em;
`;

const Styled = styled.div`
  background-color: ${palette('secondary', 1)};
  color: ${palette('primary', 4)};
`;
const Main = styled.div`
  padding: 2em 0 0;
`;

const FooterLink = styled.a`
  font-weight:bold;
  color: ${palette('primary', 4)};
  &:hover {
    color: ${palette('primary', 4)};
    opacity: 0.8;
  }
`;
// const FooterProjectLink = styled.a`
//   font-weight:bold;
//   color: ${palette('primary', 4)};
// `;


// const FooterProjectLink = styled.a`
//   font-weight:bold;
//   color: ${palette('primary', 4)};
// `;


class Footer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  // onClick = (evt, path) => {
  //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
  //   this.props.onPageLink(path);
  // }

  render() {
    return (
      <Styled >
        <Main>
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
                  <HrcLogo src={hrclogo} alt={this.context.intl.formatMessage(messages.responsible.logo)} />
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
        </Main>
      </Styled>
    );
  }
}

Footer.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default Footer;

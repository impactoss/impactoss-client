/*
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import Grid from 'grid-styled';
import Row from 'components/styled/Row';
import Container from 'components/styled/Container';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import ButtonHero from 'components/buttons/ButtonHero';
import NormalImg from 'components/Img';
import Footer from 'components/Footer';

import appMessages from 'containers/App/messages';
import { PATHS } from 'containers/App/constants';

import {
  DB_TABLES,
  SHOW_HOME_TITLE,
  SHOW_BRAND_ON_HOME,
  HEADER_PATTERN_HEIGHT,
  SHOW_HEADER_PATTERN_HOME_GRAPHIC,
} from 'themes/config';

import messages from './messages';

const GraphicHomeWrapper = styled.div`
  width: 100%;
  padding-top: ${(props) => props.hasBrand
    ? props.theme.sizes.header.banner.heightMobile
    : 0
  }px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-top: ${(props) => props.hasBrand
      ? props.theme.sizes.header.banner.height
      : 0
    }px;
  }
  background-image: ${(props) => (props.showPattern && props.theme.backgroundImages.header)
    ? props.theme.backgroundImages.header
    : 'none'
  };
  background-repeat: repeat;
  background-size: ${HEADER_PATTERN_HEIGHT}px auto;
`;

const GraphicHome = styled(NormalImg)`
  width: 100%;
  max-width: 800px;
`;
// TODO @tmfrnz config
// max-width

const SectionTop = styled.div`
  min-height: ${(props) => props.hasBrand ? 0 : '100vH'};
  display: ${(props) => props.hasBrand ? 'static' : 'table'};
  background-color: ${palette('home', 0)};
  color: ${palette('homeIntro', 0)};
  text-align: center;
`;

const SectionWrapper = styled.div`
  display: ${(props) => props.hasBrand ? 'static' : 'table-cell'};
  vertical-align: ${(props) => props.hasBrand ? 'baseline' : 'middle'};
  padding-bottom: 3em;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-bottom: 6em;
  }
`;

const HomeActions = styled.div`
  padding-top: 1em;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-top: 2em;
  }
`;
const Title = styled.h1`
  color:${palette('headerBrand', 0)};
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.sizes.home.text.titleMobile};
  margin-top: 0.5em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.theme.sizes.home.text.title};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    margin-top: 1em;
  }
`;
// TODO @tmfrnz config
// margin-top

const Claim = styled.p`
  color: ${palette('headerBrand', 1)};
  font-family: ${(props) => props.theme.fonts.claim};
  font-size: ${(props) => props.theme.sizes.home.text.claimMobile};
  font-weight: 100;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.3;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.theme.sizes.home.text.claim};
    margin-bottom: 1.5em;
  }
`;

const Intro = styled(ReactMarkdown)`
  font-size: 1em;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.3;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 1.1em;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 1.25em;
    width: 80%;
  }
`;
const GridSpace = styled(Grid)`
  display: none !important;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: inline-block;
  }
`;
export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  render() {
    const { onPageLink, theme } = this.props;
    const appTitle = `${this.context.intl.formatMessage(appMessages.app.title)} - ${this.context.intl.formatMessage(appMessages.app.claim)}`;

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <SectionTop hasBrand={SHOW_BRAND_ON_HOME}>
          <SectionWrapper hasBrand={SHOW_BRAND_ON_HOME}>
            <GraphicHomeWrapper
              hasBrand={SHOW_BRAND_ON_HOME}
              showPattern={SHOW_HEADER_PATTERN_HOME_GRAPHIC}
            >
              <GraphicHome src={theme.media.graphicHome} alt={this.context.intl.formatMessage(appMessages.app.title)} />
            </GraphicHomeWrapper>
            { !SHOW_HOME_TITLE &&
              <GraphicHome src={theme.media.titleHome} alt={appTitle} />
            }
            <Container noPaddingBottom >
              { SHOW_HOME_TITLE &&
                <Row>
                  <GridSpace lg={1 / 6} sm={1 / 8} />
                  <Grid lg={4 / 6} sm={6 / 8} xs={1}>
                    <Title>
                      <FormattedMessage {...appMessages.app.title} />
                    </Title>
                    <Claim>
                      <FormattedMessage {...appMessages.app.claim} />
                    </Claim>
                  </Grid>
                </Row>
              }
              <Row>
                <GridSpace lg={1 / 6} sm={1 / 12} />
                <Grid lg={4 / 6} sm={10 / 12} xs={1}>
                  <Intro source={this.context.intl.formatMessage(messages.intro)} />
                  <HomeActions>
                    <ButtonHero onClick={() => onPageLink(PATHS.OVERVIEW)}>
                      <FormattedMessage {...messages.explore} />
                    </ButtonHero>
                  </HomeActions>
                </Grid>
              </Row>
            </Container>
          </SectionWrapper>
        </SectionTop>
        <Footer />
      </div>
    );
  }
}

HomePage.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func.isRequired,
  onPageLink: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

HomePage.contextTypes = {
  intl: PropTypes.object.isRequired,
};

// const mapStateToProps = () => ({
//   // dataReady: selectReady(state, { path: DEPENDENCIES }),
//   // taxonomies: selectEntities(state, 'taxonomies'),
//   // pages: selectEntitiesWhere(state, {
//   //   path: 'pages',
//   //   where: { draft: false },
//   // }),
// });

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DB_TABLES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
      // kick off loading although not needed
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(null, mapDispatchToProps)(withTheme(HomePage));

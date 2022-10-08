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
import { selectFrameworks, selectIsSigningIn, selectReady } from 'containers/App/selectors';

import ButtonHero from 'components/buttons/ButtonHero';
import ButtonFlat from 'components/buttons/ButtonFlat';
import NormalImg from 'components/Img';
import Loading from 'components/Loading';
import Footer from 'containers/Footer';

import appMessages from 'containers/App/messages';
import { PATHS } from 'containers/App/constants';

import {
  SHOW_HOME_TITLE,
  SHOW_BRAND_ON_HOME,
  HEADER_PATTERN_HEIGHT,
  SHOW_HEADER_PATTERN_HOME_GRAPHIC,
} from 'themes/config';

import { DEPENDENCIES } from './constants';

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
  max-width: 1200px;
`;

const SectionTop = styled.div`
  min-height: ${(props) => props.hasBrand ? 0 : '100vH'};
  display: ${(props) => props.hasBrand ? 'static' : 'table'};
  width: ${(props) => props.hasBrand ? 'auto' : '100%'};
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
  }
`;
const GridSpace = styled(Grid)`
  display: none !important;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: inline-block;
  }
`;
const StyledButtonHero = styled(ButtonHero)`
  max-width: 250px;
`;

const StyledButtonFlat = styled(ButtonFlat)`
  color: ${palette('homeIntro', 0)};
`;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  render() {
    const { theme, frameworks, onSelectFramework, onPageLink, signingIn, dataReady } = this.props;
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
                  <GridSpace lg={1 / 8} />
                  <Grid lg={3 / 4} sm={1}>
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
                <GridSpace lg={1 / 6} sm={1 / 8} />
                <Grid lg={2 / 3} sm={3 / 4} xs={1}>
                  <Intro source={this.context.intl.formatMessage(messages.intro)} />
                </Grid>
              </Row>
              <HomeActions>
                {(signingIn || !dataReady) && (
                  <Row space>
                    <GridSpace lg={1 / 6} sm={1 / 8} />
                    <Grid lg={2 / 3} sm={3 / 4} xs={1}>
                      <Loading />
                    </Grid>
                  </Row>
                )}
                {(signingIn || !dataReady) && (
                  <Row space>
                    <GridSpace lg={1 / 6} sm={1 / 8} />
                    <Grid lg={2 / 3} sm={3 / 4} xs={1}>
                      {signingIn && (
                        <FormattedMessage {...messages.signingIn} />
                      )}
                      {!signingIn && (
                        <FormattedMessage {...messages.loading} />
                      )}
                    </Grid>
                  </Row>
                )}
                {dataReady && !signingIn && frameworks.size > 1 && (
                  <span>
                    <Row>
                      <GridSpace lg={1 / 6} sm={1 / 8} />
                      <Grid lg={2 / 3} sm={3 / 4} xs={1}>
                        <FormattedMessage {...messages.selectFramework} />
                      </Grid>
                    </Row>
                    <Row space>
                      <Grid lg={1} sm={1} xs={1}>
                        {frameworks.entrySeq().map(([key, fw]) => (
                          <StyledButtonHero space key={key} onClick={() => onSelectFramework(fw.get('id'))}>
                            <FormattedMessage {...appMessages.frameworks[fw.get('id')]} />
                          </StyledButtonHero>
                        ))}
                      </Grid>
                    </Row>
                    <Row space>
                      <GridSpace lg={1 / 6} sm={1 / 8} />
                      <Grid lg={2 / 3} sm={3 / 4} xs={1}>
                        <StyledButtonFlat onClick={() => onSelectFramework('all')}>
                          <FormattedMessage {...messages.exploreAllFrameworks} />
                        </StyledButtonFlat>
                      </Grid>
                    </Row>
                  </span>
                )}
                {dataReady && !signingIn && frameworks.size === 1 && (
                  <Row space>
                    <GridSpace lg={1 / 6} sm={1 / 8} />
                    <Grid lg={2 / 3} sm={3 / 4} xs={1}>
                      <ButtonHero onClick={() => onPageLink(PATHS.OVERVIEW)}>
                        <FormattedMessage {...messages.explore} />
                      </ButtonHero>
                    </Grid>
                  </Row>
                )}
              </HomeActions>
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
  onSelectFramework: PropTypes.func.isRequired,
  onPageLink: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  frameworks: PropTypes.object,
  signingIn: PropTypes.bool,
  dataReady: PropTypes.bool,
};

HomePage.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  frameworks: selectFrameworks(state),
  signingIn: selectIsSigningIn(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
    onSelectFramework: (framework) => {
      dispatch(updatePath(
        PATHS.OVERVIEW,
        {
          query: {
            arg: 'fw',
            value: framework,
            replace: true,
          },
          extend: true,
        },
      ));
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(HomePage));

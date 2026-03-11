/*
 * HomePage
 *
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { FormattedMessage, injectIntl } from 'react-intl';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';

import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import {
  Box, Text, ResponsiveContext, Image,
} from 'grommet';

import { isMinSize } from 'utils/responsive';

import Icon from 'components/Icon';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { selectFrameworks, selectIsSigningIn, selectReady } from 'containers/App/selectors';

import NormalImg from 'components/Img';
import CardTeaser from 'components/CardTeaser';
import Footer from 'containers/Footer';

import appMessages from 'containers/App/messages';
import { ROUTES } from 'containers/App/constants';

import {
  SHOW_HOME_TITLE,
  SHOW_HOME_TITLE_OR_CLAIM,
  SHOW_BRAND_ON_HOME,
  HEADER_PATTERN_HEIGHT,
  SHOW_HEADER_PATTERN_HOME_GRAPHIC,
  HOME_GRAPHIC_WIDTH,
  HOME_GRAPHIC_WIDTH_XS,
  SHOW_HOME_CLAIM,
} from 'themes/config';

import { DEPENDENCIES } from './constants';

import messages from './messages';

/* eslint-disable react/no-children-prop */

const GraphicHomeWrapper = styled.div`
  width: 100%;
  background-image: ${(props) => (props.showPattern && props.theme.backgroundImages.header)
    ? props.theme.backgroundImages.header
    : 'none'
};
  background-repeat: repeat;
  background-size: ${HEADER_PATTERN_HEIGHT}px auto;
`;

const GraphicHome = styled(NormalImg)`
  width: 100%;
  max-width: ${HOME_GRAPHIC_WIDTH_XS}px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    max-width: ${HOME_GRAPHIC_WIDTH}px;
  }
`;

const SectionTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.hasBrand ? 'auto' : '100%'};
  background-color: ${palette('home', 0)};
  color: ${palette('homeIntro', 0)};
  text-align: center;
  min-height: 400px;
  /* border: 1px solid yellow; */
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    min-height: 444px;
    /* min-height: calc(100vh - ${({ theme }) => theme.sizes.header.banner.height + theme.sizes.header.nav.height}px - 200px); */
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-height: 555px;
    /* min-height: calc(100vh - ${({ theme }) => theme.sizes.header.banner.height + theme.sizes.header.nav.height}px - 200px); */
  }
  @media print {
    background-color: transparent;
    color: ${palette('text', 0)};
    display: block;
    min-height: auto;
  }
`;

const SectionTopInner = styled((p) => <Box responsive={false} pad={{ horizontal: 'small', top: 'xsmall' }} {...p} />)`
  width: 100%;
  position: relative;
  max-width: 96%;
  @media (min-width: ${(props) => props.theme.breakpoints.xsmall}) {
    max-width: 80%;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    max-width: 680px;
  }
  /* border: 1px solid blue; */
  /* padding-bottom: 140px; */
`;

const Section = styled((p) => <Box {...p} />)`
  padding-top: 30px;
  padding-bottom: 80px;
  background-color: ${palette('mainBackground', 0)};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-top: 60px;
  }
`;
const SectionInner = styled((p) => <Box responsive={false} pad={{ horizontal: 'small' }} {...p} />)`
  max-width: 96%;
  @media (min-width: ${(props) => props.theme.breakpoints.xsmall}) {
    max-width: 90%;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    max-width: 800px;
  }
`;
const BackgroundImageSection = styled((p) => <Box {...p} />)`
  overflow: hidden;
  margin-top: -50px;
  background: linear-gradient(to bottom, #ffffff 5%, ${palette('mainBackground', 0)} 60%);
`;


const CirclesContainer = styled.div`
  position: absolute;
  /* border: 1px solid red; */
  top: -8%;
  bottom: 50%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1170px;
  pointer-events: none;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    top: -5%;
    bottom: 42%;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    top: -10%;
    bottom: 40%;
  }
`;

const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
  background-color: ${({ id }) => palette('taxonomies', id)};
  width: ${({ size }) => size}%;
  min-width: ${({ minSize }) => minSize}px;
  min-height: ${({ minSize }) => minSize}px;
  left: ${({ x }) => x}%;
  top: ${({ y }) => y}%;
  transform: translate(-50%, -50%);
  will-change: transform; /* ready for parallax */
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
`;

const IconWrap = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: 40px;
    height: 40px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: 44px;
    height: 44px;
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
`;
const SectionTitle = styled.h2`
  color:${palette('headerBrand', 0)};
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.sizes.home.text.titleMobile};
  font-weight: 700;
  margin-top: 0.5em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.theme.sizes.home.text.title};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    margin-top: 1em;
  }
`;

const Claim = styled.h3`
  color: ${palette('headerBrand', 1)};
  font-family: ${(props) => props.theme.fonts.claim};
  font-size: ${(props) => props.theme.sizes.home.text.claimMobile};
  margin-left: auto;
  margin-right: auto;
  line-height: 1.3;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: ${(props) => props.theme.sizes.home.text.claim};
    margin-bottom: 0.5em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.home.print.claim};
    color: ${palette('primary', 0)}
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
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: 1.2em;
    max-width: 666px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 1.25em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;
const SectionDescription = styled(Text)`
  font-size: 0.8;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.3;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 0.9;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: 1em;
    max-width: 666px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 1.1em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

const CIRCLES = [
  {
    id: 2, size: 6, minSize: 30, x: 10, y: 25,
  },
  {
    id: 3, size: 11, minSize: 55, x: 21, y: 42,
  },
  {
    id: 1, size: 8, minSize: 40, x: 31, y: 23,
  },
  {
    id: 4, size: 11, minSize: 50, x: 74, y: 25,
  },
  {
    id: 5, size: 15, minSize: 60, x: 88, y: 50,
  },
];
export function HomePage({ onPageLink, theme, intl }) {
  const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;
  const size = useContext(ResponsiveContext);
  return (
    <div>
      <HelmetCanonical
        title={intl.formatMessage(messages.pageTitle)}
        meta={[
          {
            name: 'description',
            content: `${intl.formatMessage(appMessages.app.titleHome)} - ${intl.formatMessage(messages.intro)}`,
          },
        ]}
      />
      <main id="main-content">
        <SectionTop hasBrand={SHOW_BRAND_ON_HOME}>
          <SectionTopInner
            hasBrand={SHOW_BRAND_ON_HOME}
            style={{ position: 'relative' }}
            align="center"
            justify="evenly"
            fill="vertical"
            flex={{ grow: 1 }}
          >
            <CirclesContainer aria-hidden="true">
              {CIRCLES.map((c) => (
                <Circle key={c.id} {...c}>
                  <IconWrap>
                    <Icon
                      name={`taxonomy_${c.id}`}
                      size="100%"
                      color="white"
                      alt=""
                      role="presentation"
                    />
                  </IconWrap>
                </Circle>
              ))}
            </CirclesContainer>
            <GraphicHomeWrapper
              hasBrand={SHOW_BRAND_ON_HOME}
              showPattern={SHOW_HEADER_PATTERN_HOME_GRAPHIC}
              aria-hidden="true"
            >
              <GraphicHome src={theme.media.graphicHome} alt="" />
            </GraphicHomeWrapper>
            { !SHOW_HOME_TITLE && theme.media.titleHome
              && <GraphicHome src={theme.media.titleHome} alt={appTitle} />
            }
            <Box>
              {SHOW_HOME_TITLE_OR_CLAIM && (
                <Box gap="xsmall" align="center" responsive={false}>
                  {SHOW_HOME_TITLE && (
                    <Title>
                      <FormattedMessage {...appMessages.app.titleHome} />
                    </Title>
                  )}
                  {SHOW_HOME_CLAIM && (
                    <Claim>
                      <FormattedMessage {...appMessages.app.claim} />
                    </Claim>
                  )}
                  <Intro
                    children={intl.formatMessage(messages.intro)}
                    rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
                  />
                </Box>
              )}
              <Box
                margin={{ top: 'small' }}
                align="center"
                style={{ minHeight: '58px' }}
              >
                <Icon name="arrowDown" palette="primary" paletteIndex={0} />
              </Box>
            </Box>
          </SectionTopInner>
        </SectionTop>
        <BackgroundImageSection aria-hidden="true">
          <Image
            src={theme.media.graphicHomeSection}
            fit="contain"
            alt=""
          />
        </BackgroundImageSection>
        <Section align="center">
          <SectionInner gap="medium">
            <Box align="center">
              <Box>
                <SectionTitle id="home-nav-title">
                  <FormattedMessage {...messages.sectionTitle} />
                </SectionTitle>
              </Box>
              <Box>
                <SectionDescription>
                  <FormattedMessage {...messages.sectionDescription} />
                </SectionDescription>
              </Box>
            </Box>
            <nav aria-label="Explore the tracker">
              <Box gap="ms" direction={isMinSize(size, 'xsmall') ? 'row' : 'column'}>
                <CardTeaser
                  path={ROUTES.OVERVIEW}
                  onClick={(evt) => {
                    if (evt && evt.preventDefault) evt.preventDefault();
                    onPageLink(ROUTES.OVERVIEW);
                  }}
                  title={intl.formatMessage(messages.cardTitleOverview)}
                  description={intl.formatMessage(messages.cardDescriptionOverview)}
                  explore={intl.formatMessage(messages.cardLinkOverview)}
                  graphicSrc={theme.media.teaserCategories}
                  isHome
                  basis={isMinSize(size, 'xsmall') ? '1/2' : '1'}
                  headingLevel={3}
                />
                <CardTeaser
                  path={ROUTES.RECOMMENDATIONS}
                  onClick={(evt) => {
                    if (evt && evt.preventDefault) evt.preventDefault();
                    onPageLink(ROUTES.RECOMMENDATIONS);
                  }}
                  dataReady
                  title={intl.formatMessage(messages.cardTitleRecommendations)}
                  description={intl.formatMessage(messages.cardDescriptionRecommendations)}
                  explore={intl.formatMessage(messages.cardLinkRecommendations)}
                  graphicSrc={theme.media.teaserRecommendations}
                  isHome
                  headingLevel={3}
                />
              </Box>
            </nav>
          </SectionInner>
        </Section>
      </main>
      <Footer fill />
    </div>
  );
}

HomePage.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func.isRequired,
  onSelectFramework: PropTypes.func.isRequired,
  onPageLink: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  frameworks: PropTypes.object,
  signingIn: PropTypes.bool,
  dataReady: PropTypes.bool,
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
        ROUTES.OVERVIEW,
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
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withTheme(HomePage)));

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
import { Box, ResponsiveContext } from 'grommet';

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
  SHOW_HOME_CLAIM,
} from 'themes/config';

import { DEPENDENCIES } from './constants';

import messages from './messages';

/* eslint-disable react/no-children-prop */

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
  max-width: ${HOME_GRAPHIC_WIDTH}px;
`;

const SectionTop = styled.div`
  display: ${(props) => props.hasBrand ? 'block' : 'table'};
  width: ${(props) => props.hasBrand ? 'auto' : '100%'};
  background-color: ${palette('home', 0)};
  color: ${palette('homeIntro', 0)};
  text-align: center;
  min-height: 500px;
  @media print {
    background-color: transparent;
    color: ${palette('text', 0)};
    display: block;
    min-height: auto;
  }
`;

const SectionTopInner = styled((p) => <Box pad={{ horizontal: 'small' }} {...p} />)`
  display: ${(props) => props.hasBrand ? 'block' : 'table-cell'};
  vertical-align: ${(props) => props.hasBrand ? 'baseline' : 'middle'};
  padding-bottom: 2em;
  min-height: 500px;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-bottom: 3em;
  }
`;

const Section = styled((p) => <Box {...p} />)`
  padding-top: 60px;
  padding-bottom: 80px;
  background-color: ${palette('mainBackground', 0)};
`;
const SectionInner = styled((p) => <Box pad={{ horizontal: 'small' }} {...p} />)`
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    max-width: 800px;
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
const SectionDescription = styled(ReactMarkdown)`
  font-size: 0.8;
  margin-left: auto;
  margin-right: auto;
  line-height: 1;
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

export function HomePage({ onPageLink, theme, intl }) {
  const appTitle = `${intl.formatMessage(appMessages.app.title)} - ${intl.formatMessage(appMessages.app.claim)}`;
  const size = useContext(ResponsiveContext);

  return (
    <div>
      <HelmetCanonical
        title={intl.formatMessage(messages.pageTitle)}
        meta={[
          { name: 'description', content: intl.formatMessage(messages.metaDescription) },
        ]}
      />
      <SectionTop hasBrand={SHOW_BRAND_ON_HOME}>
        <SectionTopInner
          hasBrand={SHOW_BRAND_ON_HOME}
          style={{ position: 'relative' }}
          align="center"
          justify="evenly"
          fill="vertical"
          flex={{ grow: 1 }}
        >
          <GraphicHomeWrapper
            hasBrand={SHOW_BRAND_ON_HOME}
            showPattern={SHOW_HEADER_PATTERN_HOME_GRAPHIC}
          >
            <GraphicHome src={theme.media.graphicHome} alt={intl.formatMessage(appMessages.app.title)} />
          </GraphicHomeWrapper>
          { !SHOW_HOME_TITLE && theme.media.titleHome
            && <GraphicHome src={theme.media.titleHome} alt={appTitle} />
          }
          <Box>
            {SHOW_HOME_TITLE_OR_CLAIM && (
              <Box gap="xsmall" align="center">
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
              margin={{ top: 'small', bottom: 'large' }}
              align="center"
              style={{ minHeight: '58px' }}
            >
              <Icon name="arrowDown" palette="primary" paletteIndex={0} />
            </Box>
          </Box>
        </SectionTopInner>
      </SectionTop>
      <Section align="center">
        <SectionInner gap="medium">
          <Box align="center">
            <Box>
              <SectionTitle>
                <FormattedMessage {...messages.sectionTitle} />
              </SectionTitle>
            </Box>
            <Box>
              <SectionDescription
                children={intl.formatMessage(messages.sectionDescription)}
                rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}
              />
            </Box>
          </Box>
          <Box gap="ms" direction={isMinSize(size, 'small') ? 'row' : 'column'}>
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
              basis={isMinSize(size, 'small') ? '1/2' : '1'}
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
            />
          </Box>
        </SectionInner>
      </Section>
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

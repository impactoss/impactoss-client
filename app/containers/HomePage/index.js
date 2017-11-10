/*
 * HomePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Grid from 'grid-styled';
import Row from 'components/styled/Row';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import ButtonHero from 'components/buttons/ButtonHero';
import NormalImg from 'components/Img';
import Footer from 'components/Footer';

import appMessages from 'containers/App/messages';

import { DB_TABLES, SHOW_HOME_TITLE } from 'themes/config';
import graphicHome from 'themes/media/homeGraphic.png';
import graphicHome2x from 'themes/media/homeGraphic@2x.png';

import messages from './messages';

const GraphicHome = styled(NormalImg)`
  width: 100%;
  max-width: 1200px;
`;

const SectionTop = styled.div`
  min-height: 100vH;
  background-color: ${palette('home', 0)};
  color: ${palette('homeIntro', 0)};
  text-align: center;
`;

const TopActions = styled.div`
  padding-top: 2em;
`;
const Title = styled.h1`
  color:${palette('headerBrand', 0)};
  font-family: ${(props) => props.theme.fonts.brandMain};
  font-size: ${(props) => props.theme.sizes.brandMain.home};
  text-transform: uppercase;
`;

const Claim = styled.p`
  color: ${palette('headerBrand', 1)};
  font-family: ${(props) => props.theme.fonts.brandClaim};
  font-size: ${(props) => props.theme.sizes.brandClaim.home};
  font-weight: 100;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1.5em;
`;

const Intro = styled.p`
  font-size: 1.25em;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  // componentWillReceiveProps(nextProps) {
  //   // reload entities if invalidated
  //   // if (!nextProps.dataReady) {
  //     this.props.loadEntitiesIfNeeded();
  //   }
  // }

  // preparePageMenuPages = (pages) =>
  //   pages.map((page) => ({
  //     path: `/pages/${page.get('id')}`,
  //     title: page.getIn(['attributes', 'menu_title']) || page.getIn(['attributes', 'title']),
  //   })).toArray();

  render() {
    const { onPageLink } = this.props;
    const appTitle = `${this.context.intl.formatMessage(appMessages.app.title)} - ${this.context.intl.formatMessage(appMessages.app.claim)}`;

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <SectionTop>
          <GraphicHome src={[graphicHome, graphicHome2x]} alt={appTitle} />
          { SHOW_HOME_TITLE &&
            <Row>
              <Grid sm={1 / 6} />
              <Grid sm={4 / 6}>
                <Title>
                  <FormattedMessage {...appMessages.app.title} />
                </Title>
                <Claim>
                  <FormattedMessage {...appMessages.app.claim} />
                </Claim>
              </Grid>
              <Grid sm={1 / 6} />
            </Row>
          }
          <Row>
            <Grid sm={1 / 6} />
            <Grid sm={4 / 6}>
              <Intro>
                <FormattedMessage {...messages.intro} />
              </Intro>
              <TopActions>
                <div>
                  <ButtonHero onClick={() => onPageLink('/overview')}>
                    <FormattedMessage {...messages.explore} />
                  </ButtonHero>
                </div>
              </TopActions>
            </Grid>
            <Grid sm={1 / 6} />
          </Row>
        </SectionTop>
        <Footer />
      </div>
    );
  }
}

HomePage.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func.isRequired,
  onPageLink: PropTypes.func.isRequired,
  // pages: PropTypes.object,
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
export default connect(null, mapDispatchToProps)(HomePage);

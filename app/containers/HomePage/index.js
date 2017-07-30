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

import {
  selectReady,
  selectEntities,
  selectEntitiesWhere,
} from 'containers/App/selectors';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';

import ButtonHero from 'components/buttons/ButtonHero';
import Section from 'components/styled/Section';
// import NormalImg from 'components/Img';
import Footer from 'components/Footer';

import appMessages from 'containers/App/messages';
import { DB_TABLES } from 'containers/App/constants';
import messages from './messages';
import { DEPENDENCIES } from './constants';

// import graphicHome from './graphicHome.png';
//
// const GraphicHome = styled(NormalImg)`
//   width: 100%;
//   margin-bottom: -2em;
// `;

const SectionTop = styled(Section)`
  text-align: center;
  min-height: 100vH;
  margin-top: -150px;
  padding-top: 130px;
`;

const TopActions = styled.div`
  padding-top: 2em;
`;
const Title = styled.h1`
  color:${palette('headerBrand', 0)};
  font-family: ${(props) => props.theme.fonts.headerBrandMain};
  text-transform: uppercase;
  margin-bottom:0;
  font-size: 2.8em;
`;

const Claim = styled.p`
  color: ${palette('headerBrand', 1)};
  font-family: ${(props) => props.theme.fonts.headerBrandClaim};
  font-size: 1.25em;
  width: 40%;
  margin-left: auto;
  margin-right: auto;
`;

const Intro = styled.p`
  font-family: ${(props) => props.theme.fonts.secondary};
  font-size: 1.25em;
  width: 40%;
  margin-left: auto;
  margin-right: auto;
`;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  preparePageMenuPages = (pages) =>
    pages.map((page) => ({
      path: `/pages/${page.get('id')}`,
      title: page.getIn(['attributes', 'menu_title']) || page.getIn(['attributes', 'title']),
    })).toArray();

  render() {
    const { onPageLink, pages } = this.props;

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <SectionTop dark>
          <Title>
            <FormattedMessage {...appMessages.app.title} />
          </Title>
          <Claim>
            <FormattedMessage {...appMessages.app.claim} />
          </Claim>
          <Intro>
            <FormattedMessage {...messages.intro} />
          </Intro>
          <TopActions>
            <div>
              <ButtonHero onClick={() => onPageLink('overview')}>
                <FormattedMessage {...messages.explore} />
              </ButtonHero>
            </div>
          </TopActions>
        </SectionTop>
        <Footer
          pages={pages && this.preparePageMenuPages(pages)}
          onPageLink={onPageLink}
        />
      </div>
    );
  }
}

HomePage.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func.isRequired,
  onPageLink: PropTypes.func.isRequired,
  pages: PropTypes.object,
};

HomePage.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectEntities(state, 'taxonomies'),
  pages: selectEntitiesWhere(state, {
    path: 'pages',
    where: { draft: false },
  }),
});

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
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

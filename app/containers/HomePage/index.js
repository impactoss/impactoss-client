/*
 * HomePage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Link } from 'react-router';

import {
  getEntities,
  isReady,
} from 'containers/App/selectors';
import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Button from 'components/basic/Button';
import Section from 'components/basic/Section';
import Container from 'components/basic/Container';
import Icon from 'components/Icon';
import TaxonomyList from 'components/TaxonomyList';
import NormalImg from 'components/Img';

import appMessages from 'containers/App/messages';
import messages from './messages';

import graphicHome from './graphicHome.png';

const GraphicHome = styled(NormalImg)`
  width: 200px;
`;

const SectionTop = styled(Section)`
  text-align: center;
  min-height: 100vH;
  margin-top: -115px;
  padding-top: 130px;
`;

const Title = styled.h1`
  color:${palette('primary', 0)}
  font-family: ${(props) => props.theme.fonts.secondary};
  text-transform: uppercase;
  margin-bottom:0;
  font-size: 2.8em
`;

const Claim = styled.p`
  color: ${palette('secondary', 0)};
  font-family: ${(props) => props.theme.fonts.secondary};
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
  mapToTaxonomyList = (taxonomies) => Object.values(taxonomies).map((tax) => ({
    id: tax.id,
    title: tax.attributes.title,
    count: tax.count,
    linkTo: `/categories/${tax.id}`,
    tags: {
      recommendations: !!tax.attributes.tags_recommendations,
      actions: !!tax.attributes.tags_measures,
      users: !!tax.attributes.tags_users,
    },
  }))
  render() {
    const { dataReady } = this.props;

    const taxonomies = this.mapToTaxonomyList(this.props.taxonomies);

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <SectionTop dark>
          <GraphicHome src={graphicHome} alt={this.context.intl.formatMessage(messages.pageTitle)} />
          <Title>
            <FormattedMessage {...appMessages.app.title} />
          </Title>
          <Claim>
            <FormattedMessage {...appMessages.app.claim} />
          </Claim>
          <Intro>
            <FormattedMessage {...messages.intro} />
          </Intro>
        </SectionTop>
        <Section>
          <Container>
            <div>
              <h2>
                <FormattedMessage {...messages.categoriesExplore} />
              </h2>
              <p>
                <FormattedMessage {...messages.categoriesExploreContent} />
              </p>
              { !dataReady &&
                <div>
                  <FormattedMessage {...messages.loading} />
                </div>
              }
              { dataReady && taxonomies &&
                <TaxonomyList
                  taxonomies={taxonomies}
                />
              }
            </div>
            <hr />
            <div>
              <h2>
                <FormattedMessage {...messages.actionsExplore} />
              </h2>
              <Icon name="actions" size="4em" />
              <p>
                <FormattedMessage {...messages.actionsExploreContent} />
              </p>
              <Link to={'/actions'}>
                <Button>
                  <FormattedMessage {...messages.actionsExploreLink} />
                </Button>
              </Link>
            </div>
            <hr />
            <div>
              <h2>
                <FormattedMessage {...messages.moreExplore} />
              </h2>
              <p>
                <FormattedMessage {...messages.moreExploreContent} />
              </p>
              <Link to={'/recommendations'}>
                <Button>
                  <FormattedMessage {...messages.recommendationsExploreLink} />
                </Button>
              </Link>
              <Link to={'/indicators'}>
                <Button>
                  <FormattedMessage {...messages.indicatorsExploreLink} />
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }
}
HomePage.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
};

HomePage.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'taxonomies',
    'categories',
  ] }),
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      extend: {
        type: 'count',
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        as: 'count',
      },
      out: 'js',
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      // kick off loading although not needed
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('roles'));
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
      dispatch(loadEntitiesIfNeeded('due_dates'));
      dispatch(loadEntitiesIfNeeded('progress_reports'));
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

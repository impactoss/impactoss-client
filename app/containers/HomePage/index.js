/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import TaxonomyList from 'components/TaxonomyList';

import {
  getEntities,
  isReady,
} from 'containers/App/selectors';
import messages from './messages';


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
        <Page
          title={this.context.intl.formatMessage(messages.pageTitle)}
          actions={[]}
        >
          <p>
            <FormattedMessage {...messages.intro} />
          </p>
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
          <div>
            <h2>
              <FormattedMessage {...messages.actionsExplore} />
            </h2>
            <p>
              <FormattedMessage {...messages.actionsExploreContent} />
            </p>
            <Link to={'/actions'}>
              <h3>
                <FormattedMessage {...messages.actionsExploreLink} />
              </h3>
            </Link>
          </div>
          <div>
            <h2>
              <FormattedMessage {...messages.moreExplore} />
            </h2>
            <p>
              <FormattedMessage {...messages.moreExploreContent} />
            </p>
            <Link to={'/recommendations'}>
              <h3>
                <FormattedMessage {...messages.recommendationsExploreLink} />
              </h3>
            </Link>
            <Link to={'/indicators'}>
              <h3>
                <FormattedMessage {...messages.indicatorsExploreLink} />
              </h3>
            </Link>
          </div>
        </Page>
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
      dispatch(loadEntitiesIfNeeded('measures')); // kick off loading although not needed
      dispatch(loadEntitiesIfNeeded('recommendations')); // kick off loading although not needed
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

/*
 *
 * RecommendationList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Map } from 'immutable';

import EntityList from 'containers/EntityList2';
import { PUBLISH_STATUSES, ACCEPTED_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { isReady, selectEntities } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

export class RecommendationList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }
  // componentWillUpdate(nextProps) {
  //   // reload entities if invalidated
  //   console.log('reclist componentWillUpdate')
  //   console.log('componentWillUpdate: entities', this.props.entities !== nextProps.entities)
  //   console.log('componentWillUpdate: taxonomies', this.props.taxonomies !== nextProps.taxonomies)
  //   console.log('componentWillUpdate: categories', this.props.categories !== nextProps.categories)
  //   console.log('componentWillUpdate: measures', this.props.measures !== nextProps.measures)
  //   console.log('componentWillUpdate: entityCategories', this.props.entityCategories !== nextProps.entityCategories)
  //   console.log('componentWillUpdate: recommendation_measures', this.props.recommendation_measures !== nextProps.recommendation_measures)
  // }
  // shouldComponentUpdate(nextProps, state) {
  //   return this.props.dataReady !== nextProps.dataReady;
  // }
  render() {
    const {
      dataReady,
      entities,
      entityCategories,
      taxonomies,
      categories,
      measures,
      recommendation_measures,
    } = this.props;

    // define selects for getEntities

    const relationships = {
      entities: {
        entityCategories: {
          key: 'recommendation_id',
          reverse: true,
        },
        entityConnections: {
          recommendation_measures: {
            key: 'recommendation_id',
            reverse: true,
            as: 'measures',
            hasConnection: { // exclude "ghost" connections, eg draft
              measures: {
                key: 'measure_id',
              },
            },
          },
        },
      },
      taxonomies: { // filter by each category
        where: {
          tags_recommendations: true,
        },
      },
    };

    const filters = {
      search: ['reference', 'title'],
      attributes: {  // filter by attribute value
        label: 'By attribute',
        options: [
          {
            filter: false,
            label: this.context.intl.formatMessage(appMessages.attributes.accepted),
            attribute: 'accepted',
            options: ACCEPTED_STATUSES,
          },
          {
            filter: false,
            label: this.context.intl.formatMessage(appMessages.attributes.draft),
            attribute: 'draft',
            options: PUBLISH_STATUSES,
          },
        ],
      },
      // taxonomies: { // filter by each category
      //   query: 'cat',
      //   filter: true,
      //   connected: {
      //     path: 'recommendation_categories',
      //     key: 'recommendation_id',
      //     whereKey: 'category_id',
      //   },
      // },
      // connections: { // filter by associated entity
      //   options: [
      //     {
      //       filter: true,
      //       label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
      //       path: 'measures', // filter by recommendation connection
      //       query: 'actions',
      //       key: 'measure_id',
      //       connected: {
      //         path: 'recommendation_measures',
      //         key: 'recommendation_id',
      //         whereKey: 'measure_id',
      //       },
      //     },
      //   ],
      // },
    };
    const edits = {
      taxonomies: { // edit category
        connectPath: 'recommendation_categories',
        key: 'category_id',
        ownKey: 'recommendation_id',
        filter: true,
      },
      connections: { // filter by associated entity
        options: [
          {
            label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
            path: 'measures',
            connectPath: 'recommendation_measures', // filter by recommendation connection
            key: 'measure_id',
            ownKey: 'recommendation_id',
            filter: true,

          },
        ],
      },
      attributes: {  // edit attribute value
        options: [
          {
            label: this.context.intl.formatMessage(appMessages.attributes.draft),
            attribute: 'draft',
            options: PUBLISH_STATUSES,
            filter: false,
          },
        ],
      },
    };

    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'recommendations',
      actions: [{
        type: 'text',
        title: 'Import',
        onClick: () => this.props.handleImport(),
      }, {
        type: 'add',
        title: this.context.intl.formatMessage(messages.add),
        onClick: () => this.props.handleNew(),
      }],
    };

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { dataReady &&
          <EntityList
            location={this.props.location}
            relationships={relationships}
            path="recommendations"
            filters={filters}
            edits={edits}
            entities={entities}
            connections={{ measures }}
            taxonomies={taxonomies}
            categories={categories}
            entityCategories={entityCategories}
            entityConnections={{ recommendation_measures }}
            header={headerOptions}
            dataReady={dataReady}
            entityTitle={{
              single: this.context.intl.formatMessage(appMessages.entities.recommendations.single),
              plural: this.context.intl.formatMessage(appMessages.entities.recommendations.plural),
            }}
            entityLinkTo="/recommendations/"
          />
        }
      </div>
    );
  }
}

RecommendationList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  handleImport: PropTypes.func,
  location: PropTypes.object.isRequired,
  dataReady: PropTypes.bool,
  entities: PropTypes.instanceOf(Map),
  taxonomies: PropTypes.instanceOf(Map),
  categories: PropTypes.instanceOf(Map),
  measures: PropTypes.instanceOf(Map),
  entityCategories: PropTypes.instanceOf(Map),
  recommendation_measures: PropTypes.instanceOf(Map),
};

RecommendationList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'measures',
    'users',
    'taxonomies',
    'categories',
    'recommendations',
    'recommendation_measures',
    'recommendation_categories',
  ] }),
  entities: selectEntities(state, 'recommendations'),
  taxonomies: selectEntities(state, 'taxonomies'),
  categories: selectEntities(state, 'categories'),
  entityCategories: selectEntities(state, 'recommendation_categories'),
  measures: selectEntities(state, 'measures'),
  recommendation_measures: selectEntities(state, 'recommendation_measures'),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
    handleNew: () => {
      dispatch(updatePath('/recommendations/new/'));
    },
    handleImport: () => {
      dispatch(updatePath('/recommendations/import/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationList);

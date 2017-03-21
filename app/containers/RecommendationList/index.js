/*
 *
 * RecommendationList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

import EntityList from 'containers/EntityList';
import Page from 'components/Page';

import {
  loadEntitiesIfNeeded,
} from 'containers/App/actions';

import messages from './messages';

export class RecommendationList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  mapToEntityList = ({ id, attributes }) => ({
    id,
    title: attributes.title,
    linkTo: `/recommendations/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

  render() {
    const filters = {
      categoriesPath: 'recommendation_categories',
      categoryKey: 'recommendation_id',
    };
    return (
      <div>
        <Helmet
          title="SADATA - List Recommendations"
          meta={[
            { name: 'description', content: 'Description of RecommendationList' },
          ]}
        />
        <Page
          title={this.context.intl.formatMessage(messages.header)}
          actions={[]}
        >
          <Link to="recommendations/new">Add Recommendation</Link>
          <EntityList
            location={this.props.location}
            mapToEntityList={this.mapToEntityList}
            path="recommendations"
            filters={filters}
          />
        </Page>
      </div>
    );
  }
}

RecommendationList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  location: PropTypes.object.isRequired,
};

RecommendationList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_categories'));
    },
  };
}

export default connect(null, mapDispatchToProps)(RecommendationList);

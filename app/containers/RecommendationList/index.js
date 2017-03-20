/*
 *
 * RecommendationList
 *
 */

import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import EntityList from 'components/EntityList';

import messages from './messages';

export default class RecommendationList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  mapToEntityList = ({ id, attributes }) => ({
    id,
    title: attributes.title,
    linkTo: `/recommendations/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

  render() {
    return (
      <div>
        <Helmet
          title="SADATA - List Recommendations"
          meta={[
            { name: 'description', content: 'Description of RecommendationList' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <Link to="recommendations/new">Add Recommendation</Link>
        <EntityList
          location={this.props.location}
          mapToEntityList={this.mapToEntityList}
          path="recommendations"
        />
      </div>
    );
  }
}

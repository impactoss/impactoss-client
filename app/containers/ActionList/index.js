/*
 *
 * ActionList
 *
 */

import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import EntityList from 'components/EntityList';

import messages from './messages';

export default class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  mapToEntityList = ({ id, attributes }) => ({
    id,
    title: attributes.title,
    linkTo: `/actions/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

  render() {
    return (
      <div>
        <Helmet
          title="SADATA - List Actions"
          meta={[
            { name: 'description', content: 'Description of ActionList' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <Link to="actions/new">Add Action</Link>
        <EntityList
          location={this.props.location}
          mapToEntityList={this.mapToEntityList}
          path="actions"
        />
      </div>
    );
  }
}

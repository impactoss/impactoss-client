/*
 *
 * ActionList
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

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  mapToEntityList = ({ id, attributes }) => ({
    id,
    title: attributes.title,
    linkTo: `/actions/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

  render() {
    const filters = {
      categoriesPath: 'measure_categories',
      categoryKey: 'measure_id',
    };
    return (
      <div>
        <Helmet
          title="SADATA - List Actions"
          meta={[
            { name: 'description', content: 'Description of ActionList' },
          ]}
        />
        <Page
          title={this.context.intl.formatMessage(messages.header)}
          actions={[]}
        >
          <Link to="actions/new">Add Action</Link>
          <EntityList
            location={this.props.location}
            mapToEntityList={this.mapToEntityList}
            path="measures"
            filters={filters}
          />
        </Page>
      </div>
    );
  }
}

ActionList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  location: PropTypes.object.isRequired,
};

ActionList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
    },
  };
}

export default connect(null, mapDispatchToProps)(ActionList);

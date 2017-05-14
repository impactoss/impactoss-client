/*
 *
 * UserList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import EntityList from 'containers/EntityList';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

export class UserList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  render() {
    const { dataReady } = this.props;

    // define selects for getEntities
    const selects = {
      entities: {
        path: 'users',
        extensions: [
          {
            path: 'user_categories',
            key: 'user_id',
            reverse: true,
            as: 'taxonomies',
          },
          {
            path: 'user_roles',
            key: 'user_id',
            reverse: true,
            as: 'roles',
          },
        ],
      },
      connections: {
        options: ['roles'],
      },
      taxonomies: { // filter by each category
        out: 'js',
        path: 'taxonomies',
        where: {
          tags_users: true,
        },
        extend: {
          path: 'categories',
          key: 'taxonomy_id',
          reverse: true,
        },
      },
    };

    // specify the filter and query  options
    const filters = {
      search: ['name'],
      taxonomies: { // filter by each category
        query: 'cat',
        filter: true,
        connected: {
          path: 'user_categories',
          key: 'user_id',
          whereKey: 'category_id',
        },
      },
      connections: { // filter by associated entity
        options: [
          {
            label: this.context.intl.formatMessage(appMessages.entities.roles.plural),
            path: 'roles', // filter by user connection
            query: 'roles',
            key: 'role_id',
            filter: false,
            connected: {
              path: 'user_roles',
              key: 'user_id',
              whereKey: 'role_id',
            },
          },
        ],
      },
    };
    const edits = {
      taxonomies: { // edit category
        connectPath: 'user_categories',
        key: 'category_id',
        ownKey: 'user_id',
        filter: true,
      },
    };
    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'users',
    };

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <EntityList
          location={this.props.location}
          selects={selects}
          filters={filters}
          edits={edits}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: this.context.intl.formatMessage(appMessages.entities.users.single),
            plural: this.context.intl.formatMessage(appMessages.entities.users.plural),
          }}
          entityLinkTo="/users/"
        />
      </div>
    );
  }
}

UserList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  location: PropTypes.object.isRequired,
  dataReady: PropTypes.bool,
};

UserList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'users',
    'user_roles',
    'roles',
    'user_categories',
    'categories',
    'taxonomies',
  ] }),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('user_roles'));
      dispatch(loadEntitiesIfNeeded('roles'));
      dispatch(loadEntitiesIfNeeded('user_categories'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);

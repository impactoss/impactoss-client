/*
 *
 * UserView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import {
  getTitleField,
  getRoleField,
  getMetaField,
  getEmailField,
  getTaxonomyFields,
} from 'utils/fields';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { CONTENT_SINGLE } from 'containers/App/constants';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectIsUserManager,
  selectSessionUserId,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class UserView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if not ready or no longer ready (eg invalidated)
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getButtons = () => {
    const userId = this.props.user.get('id') || this.props.user.getIn(['attributes', 'id']);
    const edit = {
      type: 'edit',
      onClick: () => this.props.handleEdit(userId),
    };
    const close = {
      type: 'close',
      onClick: this.props.handleClose,
    };
    if (userId === this.props.sessionUserId) {
      return [
        {
          type: 'edit',
          title: this.context.intl.formatMessage(messages.editPassword),
          onClick: () => this.props.handleEditPassword(userId),
        },
        edit,
        close,
      ];
    }
    return [edit, close];
  };

  getHeaderMainFields = (entity, isManager) => ([{ // fieldGroup
    fields: [getTitleField(entity, isManager, 'name', appMessages.attributes.name)],
  }]);

  getHeaderAsideFields = (entity) => ([{
    fields: [
      getRoleField(entity, this.context.intl.formatMessage, appMessages),
      getMetaField(entity, appMessages),
    ],
  }]);

  getBodyMainFields = (entity) => ([{
    fields: [getEmailField(entity)],
  }]);

  getBodyAsideFields = (taxonomies) => ([
    { // fieldGroup
      label: appMessages.entities.taxonomies.plural,
      icon: 'categories',
      fields: getTaxonomyFields(taxonomies, appMessages),
    },
  ]);

  render() {
    const { user, dataReady, isManager, taxonomies } = this.props;

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="users"
            buttons={user && this.getButtons()}
          />
          { !user && !dataReady &&
            <Loading />
          }
          { !user && dataReady &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          { user && dataReady &&
            <EntityView
              fields={{
                header: {
                  main: this.getHeaderMainFields(user, isManager),
                  aside: isManager && this.getHeaderAsideFields(user),
                },
                body: {
                  main: this.getBodyMainFields(user),
                  aside: isManager && this.getBodyAsideFields(taxonomies),
                },
              }}
            />
          }
        </Content>
      </div>
    );
  }
}

UserView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleEdit: PropTypes.func,
  handleEditPassword: PropTypes.func,
  handleClose: PropTypes.func,
  user: PropTypes.object,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  sessionUserId: PropTypes.string,
};

UserView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  isManager: selectIsUserManager(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  sessionUserId: selectSessionUserId(state),
  user: selectViewEntity(state, props.params.id),
  // all connected categories for all user-taggable taxonomies
  taxonomies: selectTaxonomies(state, props.params.id),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleEdit: (userId) => {
      dispatch(updatePath(`/users/edit/${userId}`));
    },
    handleEditPassword: (userId) => {
      dispatch(updatePath(`/users/password/${userId}`));
    },
    handleClose: () => {
      dispatch(closeEntity('/users'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView);

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

import { getEntityTitle } from 'utils/entities';

import { loadEntitiesIfNeeded, updatePath, closeEntity } from 'containers/App/actions';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectSessionUserId,
  selectSessionUserHighestRoleId,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import {
  selectViewEntity,
  selectTaxonomies,
} from './selectors';

import { DEPENDENCIES } from './constants';

export class UserView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if not ready or no longer ready (eg invalidated)
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  getButtons = ({
    user,
    sessionUserId,
    sessionUserHighestRoleId,
    handleEdit,
    handleClose,
    handleEditPassword,
    dataReady,
  }) => {
    const { intl } = this.context;
    const userId = user.get('id') || user.getIn(['attributes', 'id']);
    const buttons = [];
    if (dataReady) {
      buttons.push({
        type: 'icon',
        onClick: () => window.print(),
        title: 'Print',
        icon: 'print',
      });
    }
    if (userId === sessionUserId) {
      buttons.push({
        type: 'edit',
        title: intl.formatMessage(messages.editPassword),
        onClick: () => handleEditPassword(userId),
      });
    }
    if (sessionUserHighestRoleId === USER_ROLES.ADMIN.value // is admin
      || userId === sessionUserId // own profile
      || sessionUserHighestRoleId < this.getHighestUserRoleId(user.get('roles'))
    ) {
      buttons.push({
        type: 'edit',
        onClick: () => handleEdit(userId),
      });
    }
    buttons.push({
      type: 'close',
      onClick: handleClose,
    });
    return buttons;
  };

  getHeaderMainFields = (entity, isManager) => ([{ // fieldGroup
    fields: [getTitleField(entity, isManager, 'name', appMessages.attributes.name)],
  }]);

  getHeaderAsideFields = (entity) => ([{
    fields: [
      getRoleField(entity),
      getMetaField(entity),
    ],
  }]);

  getBodyMainFields = (entity) => ([{
    fields: [getEmailField(entity)],
  }]);

  getBodyAsideFields = (taxonomies) => ([
    { // fieldGroup
      fields: getTaxonomyFields(taxonomies),
    },
  ]);

  // only show the highest rated role (lower role ids means higher)
  getHighestUserRoleId = (roles) => roles.reduce((memo, role) => (role.get('id') < memo) ? role.get('id') : memo,
    USER_ROLES.DEFAULT.value);

  render() {
    const { intl } = this.context;
    const {
      user, dataReady, sessionUserHighestRoleId, taxonomies,
    } = this.props;
    const isManager = sessionUserHighestRoleId <= USER_ROLES.MANAGER.value;

    const pageTitle = intl.formatMessage(messages.pageTitle);
    const metaTitle = user
      ? `${pageTitle}: ${getEntityTitle(user)}`
      : `${pageTitle} ${this.props.params.id}`;

    return (
      <div>
        <Helmet
          title={metaTitle}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="users"
            buttons={user && this.getButtons(this.props)}
          />
          { !user && !dataReady
            && <Loading />
          }
          { !user && dataReady
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          { user && dataReady
            && (
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
            )
          }
        </Content>
      </div>
    );
  }
}

UserView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  // handleEdit: PropTypes.func,
  // handleEditPassword: PropTypes.func,
  // handleClose: PropTypes.func,
  user: PropTypes.object,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  sessionUserHighestRoleId: PropTypes.number,
  params: PropTypes.object,
  // sessionUserId: PropTypes.string,
};

UserView.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  sessionUserHighestRoleId: selectSessionUserHighestRoleId(state),
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
      dispatch(updatePath(`${PATHS.USERS}${PATHS.EDIT}/${userId}`, { replace: true }));
    },
    handleEditPassword: (userId) => {
      dispatch(updatePath(`${PATHS.USERS}${PATHS.PASSWORD}/${userId}`, { replace: true }));
    },
    handleClose: () => {
      dispatch(closeEntity(PATHS.USERS));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView);

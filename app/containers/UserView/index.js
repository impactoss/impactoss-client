/*
 *
 * UserView
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  getTitleField,
  getRoleField,
  getMetaField,
  getEmailField,
  getTaxonomyFields,
  getTextField,
} from 'utils/fields';

import { getEntityTitle } from 'utils/entities';
import { canUserManageUsers, canUserSeeMeta } from 'utils/permissions';
import qe from 'utils/quasi-equals';

import {
  loadEntitiesIfNeeded, updatePath, closeEntity, redirectNotPermitted,
} from 'containers/App/actions';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES, ENABLE_AZURE } from 'themes/config';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityView from 'components/EntityView';

import {
  selectReady,
  selectSessionUserId,
  selectSessionUserHighestRoleId,
  selectReadyForAuthCheck,
} from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
import messages from './messages';

import { selectViewEntity, selectTaxonomies } from './selectors';

import { DEPENDENCIES } from './constants';

export class UserView extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if not ready or no longer ready (eg invalidated)
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // redirect if user not found, assuming no permissions
    if (nextProps.dataReady && nextProps.authReady && !nextProps.user) {
      this.props.onRedirectNotPermitted();
    }
    if (nextProps.dataReady && nextProps.authReady && nextProps.user) {
      const canView = canUserManageUsers(nextProps.sessionUserHighestRoleId) || nextProps.user.get('id') === nextProps.sessionUserId;
      if (!canView) {
        this.props.onRedirectNotPermitted();
      }
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
    intl,
  }) => {
    const userId = user.get('id') || user.getIn(['attributes', 'id']);
    let buttons = [];
    if (dataReady) {
      buttons = [
        ...buttons,
        {
          type: 'icon',
          onClick: () => window.print(),
          title: intl.formatMessage(appMessages.buttons.printTitle),
          icon: 'print',
        },
      ];
    }
    if (userId === sessionUserId && !ENABLE_AZURE) {
      buttons = [
        ...buttons,
        {
          type: 'edit',
          title: intl.formatMessage(messages.editPassword),
          onClick: () => handleEditPassword(userId),
        },
      ];
    }
    if (canUserManageUsers(sessionUserHighestRoleId) || (userId === sessionUserId && !ENABLE_AZURE)) {
      buttons = [
        ...buttons,
        {
          type: 'edit',
          onClick: () => handleEdit(userId),
        },
      ];
    }
    buttons = [
      ...buttons,
      {
        type: 'close',
        onClick: handleClose,
      },
    ];
    return buttons;
  };

  getHeaderMainFields = (entity, isManager) => [
    {
      // fieldGroup
      fields: [getTitleField(entity, isManager, 'name', appMessages.attributes.name)],
    },
  ];

  getHeaderAsideFields = (entity, userId, highestRole) => {
    let fields = [];
    const canSeeRole = canUserManageUsers(highestRole) || qe(entity.get('id'), userId);
    if (canSeeRole) {
      fields = [...fields, getRoleField(entity)];
    }
    if (canUserSeeMeta(highestRole)) {
      fields = [...fields, getMetaField(entity)];
    }
    return [{ fields }];
  };

  getBodyMainFields = (entity) => {
    const fields = [getEmailField(entity), getTextField(entity, 'domain')];

    return [{ fields }];
  };

  getBodyAsideFields = (taxonomies) => [
    {
      // fieldGroup
      fields: getTaxonomyFields(taxonomies),
    },
  ];

  // only show the highest rated role (lower role ids means higher)
  getHighestUserRoleId = (roles) =>
    roles.reduce((memo, role) => (role.get('id') < memo ? role.get('id') : memo), USER_ROLES.DEFAULT.value);

  render() {
    const {
      user, dataReady, sessionUserHighestRoleId, taxonomies, sessionUserId, intl,
    } = this.props;
    const isManager = sessionUserHighestRoleId <= USER_ROLES.MANAGER.value;

    const pageTitle = intl.formatMessage(messages.pageTitle);
    const metaTitle = user ? `${pageTitle}: ${getEntityTitle(user)}` : `${pageTitle} ${this.props.params.id}`;

    const canSeeOrg = dataReady && (canUserManageUsers(sessionUserHighestRoleId) || qe(user.get('id'), sessionUserId));

    return (
      <div>
        <HelmetCanonical
          title={metaTitle}
          meta={[{ name: 'description', content: intl.formatMessage(messages.metaDescription) }]}
        />
        <Content>
          <ContentHeader
            title={pageTitle}
            type={CONTENT_SINGLE}
            icon="users"
            buttons={user && this.getButtons(this.props)}
          />
          {!user && !dataReady && <Loading />}
          {!user && dataReady && (
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          )}
          {user && dataReady && (
            <EntityView
              fields={{
                header: {
                  main: this.getHeaderMainFields(user, isManager),
                  aside: this.getHeaderAsideFields(user, sessionUserId, sessionUserHighestRoleId),
                },
                body: {
                  main: this.getBodyMainFields(user),
                  aside: canSeeOrg && this.getBodyAsideFields(taxonomies),
                },
              }}
            />
          )}
        </Content>
      </div>
    );
  }
}

UserView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onRedirectNotPermitted: PropTypes.func,
  // handleEdit: PropTypes.func,
  // handleEditPassword: PropTypes.func,
  // handleClose: PropTypes.func,
  user: PropTypes.object,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  sessionUserHighestRoleId: PropTypes.number,
  params: PropTypes.object,
  sessionUserId: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  sessionUserHighestRoleId: selectSessionUserHighestRoleId(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
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
    onRedirectNotPermitted: () => {
      dispatch(redirectNotPermitted());
    },
    handleEdit: (userId) => {
      dispatch(updatePath(`${ROUTES.USERS}${ROUTES.EDIT}/${userId}`, { replace: true }));
    },
    handleEditPassword: (userId) => {
      dispatch(updatePath(`${ROUTES.USERS}${ROUTES.PASSWORD}/${userId}`, { replace: true }));
    },
    handleClose: () => {
      dispatch(closeEntity(ROUTES.USERS));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(UserView));

/*
 *
 * UserView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityView from 'components/views/EntityView';

import {
  getUser,
  isReady,
} from 'containers/App/selectors';

import messages from './messages';

export class UserView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  handleEdit = () => {
    browserHistory.push(`/users/edit/${this.props.user.id || this.props.user.attributes.id}`);
  }

  handleEditPassword = () => {
    browserHistory.push(`/users/password/${this.props.user.id || this.props.user.attributes.id}`);
  }

  handleClose = () => {
    browserHistory.push('/');
    // TODO should be "go back" if history present or to categories list when not
  }

  render() {
    const { user, dataReady } = this.props;

    const reference = user && user.id;

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !user && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !user && dataReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        { user && user.attributes &&
          <Page
            title={this.context.intl.formatMessage(messages.pageTitle)}
            actions={[
              {
                type: 'simple',
                title: 'Edit',
                onClick: this.handleEdit,
              },
              {
                type: 'simple',
                title: 'Change password',
                onClick: this.handleEditPassword,
              },
              {
                type: 'primary',
                title: 'Close',
                onClick: this.handleClose,
              },
            ]}
          >
            <EntityView
              fields={{
                header: {
                  main: [
                    {
                      id: 'name',
                      heading: 'Name',
                      value: user.attributes.name,
                    },
                  ],
                  aside: [
                    {
                      id: 'number',
                      heading: 'Number',
                      value: reference,
                    },
                    {
                      id: 'updated',
                      heading: 'Updated At',
                      value: user.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      heading: 'Updated By',
                      value: user.user && user.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    {
                      id: 'email',
                      heading: 'Email',
                      value: user.attributes.email,
                    },
                  ],
                },
              }}
            />
          </Page>
        }
      </div>
    );
  }
}

UserView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  user: PropTypes.object,
  dataReady: PropTypes.bool,
};

UserView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: isReady(state, { path: [
    // 'categories',
    'users',
    // 'taxonomies',
    // 'indicators',
  ] }),
  user: getUser(
    state,
    {
      id: props.params.id,
      out: 'js',
      extend: {
        type: 'single',
        path: 'users',
        key: 'last_modified_user_id',
        as: 'user',
      },
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      // dispatch(loadEntitiesIfNeeded('taxonomies'));
      // dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('users'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserView);

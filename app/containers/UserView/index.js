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
import SimpleView from 'components/views/SimpleView';

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

  handleClose = () => {
    browserHistory.push('/');
    // TODO should be "go back" if history present or to categories list when not
  }

  render() {
    const { user, dataReady } = this.props;

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
                type: 'primary',
                title: 'Close',
                onClick: this.handleClose,
              },
            ]}
          >
            <SimpleView
              fields={[
                {
                  id: 'name',
                  heading: 'Name',
                  value: user.attributes.name,
                },
                {
                  id: 'email',
                  heading: 'Email',
                  value: user.attributes.email,
                },
              ]}
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

/*
 *
 * IndicatorView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';
import { find } from 'lodash/collection';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import Page from 'components/Page';
import EntityView from 'components/views/EntityView';

import {
  getEntity,
  getEntities,
  isReady,
} from 'containers/App/selectors';

import messages from './messages';

export class IndicatorView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  handleEdit = () => {
    browserHistory.push(`/indicators/edit/${this.props.params.id}`);
  }

  handleClose = () => {
    browserHistory.push('/indicators');
    // TODO should be "go back" if history present or to indicators list when not
  }

  mapActions = (actions) =>
    Object.values(actions).map((action) => ({
      label: action.attributes.title,
      linkTo: `/actions/${action.id}`,
    }))

  render() {
    const { indicator, dataReady } = this.props;
    const reference = this.props.params.id;
    const status = indicator && find(PUBLISH_STATUSES, { value: indicator.attributes.draft });

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !indicator && !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !indicator && dataReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        { indicator &&
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
            <EntityView
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      value: indicator.attributes.title,
                    },
                  ],
                  aside: [
                    {
                      id: 'number',
                      heading: 'Number',
                      value: reference,
                    },
                    {
                      id: 'status',
                      heading: 'Status',
                      value: status && status.label,
                    },
                    {
                      id: 'updated',
                      heading: 'Updated At',
                      value: indicator.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      heading: 'Updated By',
                      value: indicator.user && indicator.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    {
                      id: 'description',
                      heading: 'Description',
                      value: indicator.attributes.description,
                    },
                    {
                      id: 'actions',
                      heading: 'Actions',
                      type: 'list',
                      values: this.mapActions(this.props.actions),
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

IndicatorView.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  indicator: PropTypes.object,
  dataReady: PropTypes.bool,
  actions: PropTypes.object,
  params: PropTypes.object,
};

IndicatorView.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};


const mapStateToProps = (state, props) => ({
  dataReady: isReady(state, { path: [
    'measures',
    'users',
    'indicators',
    'measure_indicators',
  ] }),
  indicator: getEntity(
    state,
    {
      id: props.params.id,
      path: 'indicators',
      out: 'js',
      extend: {
        type: 'single',
        path: 'users',
        key: 'last_modified_user_id',
        as: 'user',
      },
    },
  ),

  // all connected actions
  actions: getEntities(
    state, {
      path: 'measures',
      out: 'js',
      connected: {
        path: 'measure_indicators',
        key: 'measure_id',
        where: {
          indicator_id: props.params.id,
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('indicators'));
      dispatch(loadEntitiesIfNeeded('measure_indicators'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorView);

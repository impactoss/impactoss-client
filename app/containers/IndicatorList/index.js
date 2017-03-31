/*
 *
 * IndicatorList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { browserHistory } from 'react-router';

import EntityList from 'containers/EntityList';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';

import messages from './messages';

export class IndicatorList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  mapToEntityList = ({ id, attributes }) => ({
    id,
    title: attributes.title,
    linkTo: `/indicators/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

  render() {
    const { dataReady } = this.props;

    // specify the associations to query with entities
    const extensions = [
      {
        path: 'measure_indicators',
        key: 'indicator_id',
        reverse: true,
        as: 'actions',
      },
    ];

    // specify the filter and query  options
    const filters = {
      keyword: {
        attributes: [
          'id',
          'title',
          'description',
        ],
      },
      attributes: {  // filter by attribute value
        label: 'By attribute',
        options: [
          {
            label: 'Status',
            attribute: 'draft',
            options: PUBLISH_STATUSES,
          },
        ],
      },
      connections: { // filter by associated entity
        label: 'By connection',
        options: [
          {
            label: 'Actions',
            path: 'measures', // filter by indicator connection
            query: 'actions',
            key: 'measure_id',
            connected: {
              path: 'measure_indicators',
              key: 'indicator_id',
              whereKey: 'measure_id',
            },
          },
        ],
      },
    };
    const headerOptions = {
      title: this.context.intl.formatMessage(messages.header),
      actions: [{
        type: 'primary',
        title: 'New indicator',
        onClick: () => browserHistory.push('/indicators/new/'),
      }],
    };

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !dataReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { dataReady &&
          <EntityList
            location={this.props.location}
            mapToEntityList={this.mapToEntityList}
            path="indicators"
            filters={filters}
            extensions={extensions}
            header={headerOptions}
          />
        }
      </div>
    );
  }
}

IndicatorList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  location: PropTypes.object.isRequired,
  dataReady: PropTypes.bool,
};

IndicatorList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'indicators',
    'users',
    'measures',
    'measure_indicators',
  ] }),
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

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorList);

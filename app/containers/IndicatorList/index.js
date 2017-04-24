/*
 *
 * IndicatorList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import EntityList from 'containers/EntityList';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';

import messages from './messages';

export class IndicatorList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
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

    // define selects for getEntities
    const selects = {
      entities: {
        path: 'indicators',
        extensions: [
          {
            path: 'measure_indicators',
            key: 'indicator_id',
            reverse: true,
            as: 'measures',
          },
          {
            single: true,
            path: 'users',
            key: 'manager_id',
            as: 'manager',
          },
        ],
      },
      connections: {
        options: ['measures'],
      },
    };

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
          {
            label: 'Manager',
            attribute: 'manager_id',
            extension: {
              key: 'manager',
              label: 'name',
              without: true,
            },
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
    const edits = {
      connections: { // filter by associated entity
        label: 'Update connections',
        options: [
          {
            label: 'Actions',
            path: 'measures', // filter by recommendation connection
            connectPath: 'measure_indicators',
            key: 'measure_id',
            ownKey: 'indicator_id',
            // search: true,
          },
        ],
      },
      attributes: {  // edit attribute value
        label: 'Update attribute',
        options: [
          {
            label: 'Status',
            attribute: 'draft',
            options: PUBLISH_STATUSES,
          },
        ],
      },
    };
    const headerOptions = {
      title: this.context.intl.formatMessage(messages.header),
      actions: [{
        type: 'primary',
        title: 'New indicator',
        onClick: () => this.props.handleNew(),
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
        <EntityList
          location={this.props.location}
          mapToEntityList={this.mapToEntityList}
          selects={selects}
          filters={filters}
          edits={edits}
          header={headerOptions}
          dataReady={dataReady}
        />
      </div>
    );
  }
}

IndicatorList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
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
      dispatch(loadEntitiesIfNeeded('user_roles'));
    },
    handleNew: () => {
      dispatch(updatePath('/indicators/new/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorList);

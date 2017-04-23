/*
 *
 * PageList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';

import EntityList from 'containers/EntityList';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';

import messages from './messages';

export class PageList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
    linkTo: `/pages/${id}`,
    reference: id,
    status: attributes.draft ? 'draft' : null,
  })

  render() {
    const { dataReady } = this.props;

    // define selects for getEntities
    const selects = {
      entities: {
        path: 'pages',
      },
    };

    // specify the filter and query  options
    const filters = {
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
    };
    const edits = {
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
        title: 'New page',
        onClick: () => browserHistory.push('/pages/new/'),
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

PageList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  location: PropTypes.object.isRequired,
  dataReady: PropTypes.bool,
};

PageList.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: isReady(state, { path: [
    'pages',
  ] }),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('pages'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageList);

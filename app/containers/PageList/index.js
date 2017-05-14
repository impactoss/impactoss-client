/*
 *
 * PageList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import EntityList from 'containers/EntityList';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';

import appMessages from 'containers/App/messages';
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
      search: ['title'],
      attributes: {  // filter by attribute value
        label: 'By attribute',
        options: [
          {
            label: 'Status',
            attribute: 'draft',
            options: PUBLISH_STATUSES,
            filter: false,
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
            filter: false,
          },
        ],
      },
    };
    const headerOptions = {
      supTitle: this.context.intl.formatMessage(messages.pageTitle),
      icon: 'pages',
      actions: [{
        type: 'add',
        title: this.context.intl.formatMessage(messages.add),
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
          selects={selects}
          filters={filters}
          edits={edits}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: this.context.intl.formatMessage(appMessages.entities.pages.single),
            plural: this.context.intl.formatMessage(appMessages.entities.pages.plural),
          }}
          entityLinkTo="/pages/"
        />
      </div>
    );
  }
}

PageList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
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
    handleNew: () => {
      dispatch(updatePath('/pages/new/'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageList);

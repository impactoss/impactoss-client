/*
 *
 * PageList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { List, fromJS } from 'immutable';

import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import { isReady } from 'containers/App/selectors';
import appMessages from 'containers/App/messages';

import EntityList from 'containers/EntityList';

import { FILTERS, EDITS } from './constants';
import { selectPages } from './selectors';
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
          entities={this.props.entities}
          filters={FILTERS}
          edits={EDITS}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: this.context.intl.formatMessage(appMessages.entities.pages.single),
            plural: this.context.intl.formatMessage(appMessages.entities.pages.plural),
          }}
          serverPath="pages"
          clientPath="pages"
          locationQuery={fromJS(this.props.location.query)}
        />
      </div>
    );
  }
}

PageList.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  handleNew: PropTypes.func,
  dataReady: PropTypes.bool,
  entities: PropTypes.instanceOf(List).isRequired,
  location: PropTypes.object,
};

PageList.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  dataReady: isReady(state, { path: [
    'pages',
  ] }),
  entities: selectPages(state, fromJS(props.location.query)),
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

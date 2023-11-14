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
import { selectReady } from 'containers/App/selectors';
import appMessages from 'containers/App/messages';
import { PATHS } from 'containers/App/constants';

import EntityList from 'containers/EntityList';

import { CONFIG, DEPENDENCIES } from './constants';
import { selectPages } from './selectors';
import messages from './messages';

export class PageList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }

  render() {
    const { intl } = this.context;
    const { dataReady } = this.props;

    const headerOptions = {
      supTitle: intl.formatMessage(messages.pageTitle),
      icon: 'pages',
      actions: [{
        type: 'add',
        title: [
          intl.formatMessage(appMessages.buttons.add),
          {
            title: intl.formatMessage(appMessages.entities.pages.single),
            hiddenSmall: true,
          },
        ],
        onClick: () => this.props.handleNew(),
      }],
    };

    return (
      <div>
        <Helmet
          title={intl.formatMessage(messages.pageTitle)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <EntityList
          entities={this.props.entities}
          config={CONFIG}
          header={headerOptions}
          dataReady={dataReady}
          entityTitle={{
            single: intl.formatMessage(appMessages.entities.pages.single),
            plural: intl.formatMessage(appMessages.entities.pages.plural),
          }}
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
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  entities: selectPages(state, fromJS(props.location.query)),
});
function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    handleNew: () => {
      dispatch(updatePath(`${PATHS.PAGES}${PATHS.NEW}`, { replace: true }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageList);

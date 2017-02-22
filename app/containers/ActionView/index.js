/*
 *
 * ActionView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import
  makeSelectActionView
from './selectors';

import { getEntitiesAndActionById } from './actions';


import messages from './messages';

export class ActionView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.onComponentWillMount(this.props.params.id);
  }

  render() {
    const { action, getEntitiesError, loadActionError } = this.props.actionView;
    return (
      <div>
        <Helmet
          title="Action"
          meta={[
            { name: 'description', content: 'Description of ActionView' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        {action &&
          <div>
            <h1>{action.attributes.title}</h1>
            <h5>Description</h5>
            <p>{action.attributes.description}</p>
            <h5>Draft Status:</h5>
            <p>{action.attributes.draft ? 'Y' : 'N'}</p>
            <h5>Updated At:</h5>
            <p>{action.attributes['updated-at']}</p>
          </div>
        }
        {getEntitiesError &&
          <p>{getEntitiesError}</p>
        }
        {loadActionError &&
          <p>{loadActionError}</p>
        }
      </div>
    );
  }
}

ActionView.propTypes = {
  onComponentWillMount: PropTypes.func,
  params: PropTypes.object,
  actionView: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  action: makeSelectActionView(),
});

function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: (id) => {
      dispatch(getEntitiesAndActionById('actions', id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionView);

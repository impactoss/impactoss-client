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
    const { action } = this.props.action;
    return (
      <div>
        <Helmet
          title="ActionView"
          meta={[
            { name: 'description', content: 'Description of ActionView' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        {action &&
          <div>
            <p>{action.attributes.title}</p>
            <p>{action.attributes.description}</p>
          </div>
        }
      </div>
    );
  }
}

ActionView.propTypes = {
  onComponentWillMount: PropTypes.func,
  params: PropTypes.object,
  action: PropTypes.object,
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

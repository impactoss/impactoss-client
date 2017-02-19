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
import makeSelectActionView from './selectors';
import messages from './messages';

export class ActionView extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="ActionView"
          meta={[
            { name: 'description', content: 'Description of ActionView' },
          ]}
        />
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

ActionView.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ActionView: makeSelectActionView(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionView);

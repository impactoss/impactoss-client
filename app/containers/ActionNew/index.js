/*
 *
 * ActionNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectActionNew from './selectors';
import messages from './messages';

export class ActionNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="ActionNew"
          meta={[
            { name: 'description', content: 'Description of ActionNew' },
          ]}
        />
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

ActionNew.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ActionNew: makeSelectActionNew(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionNew);

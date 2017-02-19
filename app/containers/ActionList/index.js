/*
 *
 * ActionList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectActionList from './selectors';
import messages from './messages';

export class ActionList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="ActionList"
          meta={[
            { name: 'description', content: 'Description of ActionList' },
          ]}
        />
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

ActionList.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ActionList: makeSelectActionList(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);

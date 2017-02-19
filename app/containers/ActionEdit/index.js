/*
 *
 * ActionEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectActionEdit from './selectors';
import messages from './messages';

export class ActionEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="ActionEdit"
          meta={[
            { name: 'description', content: 'Description of ActionEdit' },
          ]}
        />
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

ActionEdit.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ActionEdit: makeSelectActionEdit(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionEdit);

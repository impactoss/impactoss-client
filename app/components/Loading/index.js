import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

class Loading extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <FormattedMessage {...messages.loading} />
      </div>
    );
  }
}

export default Loading;

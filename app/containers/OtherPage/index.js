/*
 * TestPage
 *
 */
import React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

export default class OtherPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  // Since state and props are static,
  // there's no need to re-render this component
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div>
          <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

/*
 * LoginPage
 *
 */
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Form from './Form';

import messages from './messages';
import {
  logout,
} from '../App/actions';


export class LogoutPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <article>
        <div>
          <FormattedMessage {...messages.header} />
        </div>
        <Form onSubmit={this.props.onSubmitForm}>
          <button type="submit">
            <FormattedMessage {...messages.logout} />
          </button>
        </Form>
      </article>
    );
  }
}

LogoutPage.propTypes = {
  onSubmitForm: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(logout());
    },
  };
}


// Wrap the component to inject dispatch and state into it
export default connect(null, mapDispatchToProps)(LogoutPage);

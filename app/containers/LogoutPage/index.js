/*
 * LoginPage
 *
 */
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { FormattedMessage } from 'react-intl';

import { 
  makeSelectPassword, 
  makeSelectEmail
} from 'containers/App/selectors';

import Form from './Form';

import messages from './messages';
import { 
  logout
} from '../App/actions';


export class LogoutPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state email is not null, submit the form to load repos
   */
//  componentDidMount() {
//    if (this.props.email && this.props.email.trim().length > 0) {
//      this.props.onSubmitForm();
//    }
//  }
  
  render() {
    
    return (
      <article>            
        <div>
          <FormattedMessage {...messages.header} />
        </div>
        <Form onSubmit={this.props.onSubmitForm}>                     
          <button>Log out</button>
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

const mapStateToProps = createStructuredSelector({  
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage);
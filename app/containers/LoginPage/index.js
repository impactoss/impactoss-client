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
import Input from './Input';

import messages from './messages';
import { 
  authenticate,
  changeEmail,
  changePassword
} from '../App/actions';


export class LoginPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
          <label htmlFor="email">
            <FormattedMessage {...messages.email} />
            <Input
              id="email"
              type="text"
              placeholder="placeholder"
              value={this.props.email}
              onChange={this.props.onChangeEmail}            
            />
          </label>
          <label htmlFor="password">
            <FormattedMessage {...messages.password} />
            <Input
              id="password"
              type="text"
              placeholder="placeholder"
              value={this.props.password}
              onChange={this.props.onChangePassword}            
            />
          </label>
          <button>Sign in</button>
        </Form>
      </article>
    );
  }
}

LoginPage.propTypes = {  
  email: React.PropTypes.string,
  password: React.PropTypes.string,    
  onSubmitForm: React.PropTypes.func,  
  onChangeEmail: React.PropTypes.func,
  onChangePassword: React.PropTypes.func,  
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeEmail: (evt) => {
      dispatch(changeEmail(evt.target.value))
    },    
    onChangePassword: (evt) => {
      dispatch(changePassword(evt.target.value))
    },    
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(authenticate());
    },
  };
}

const mapStateToProps = createStructuredSelector({  
  email: makeSelectEmail(),
  password: makeSelectPassword(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
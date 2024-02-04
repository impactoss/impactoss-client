/*
 *
 * UserLogin
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';

import { selectQueryMessages } from 'containers/App/selectors';
import { dismissQueryMessages } from 'containers/App/actions';

import messages from './messages';

import { selectDomain } from './selectors';
import { ENDPOINTS } from '../../themes/config';


export class UserLogin extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    this.props.initialiseForm();
  }

  componentDidMount() {
    const { authSending } = this.props.viewDomain.get('page').toJS();
    if (!authSending) {
      window.location.href = `${ENDPOINTS.API}/auth/azure_activedirectory_v2?resource_class=User&auth_origin_url=${window.location.toString()}`;
    }
  }

  render() {
    const { intl } = this.context;
    const { authError, authSending } = this.props.viewDomain.get('page').toJS();

    return (
      <div>
        <Helmet
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <ContentNarrow>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
          />
          {this.props.queryMessages.info
            && (
              <Messages
                type="info"
                onDismiss={this.props.onDismissQueryMessages}
                messageKey={this.props.queryMessages.info}
              />
            )
          }
          {authError
            && (
              <Messages
                type="error"
                messages={authError.messages}
              />
            )
          }
          {authSending
            && <Loading />
          }
        </ContentNarrow>
      </div>
    );
  }
}

UserLogin.propTypes = {
  viewDomain: PropTypes.object.isRequired,
  initialiseForm: PropTypes.func,
  onDismissQueryMessages: PropTypes.func,
  queryMessages: PropTypes.object,
};

UserLogin.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  queryMessages: selectQueryMessages(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: () => {
      // console.log('dispatch', dispatch);
      // if (!authSending) {
      // window.location.href = `${ENDPOINTS.API}/auth/azure_activedirectory_v2?resource_class=User&auth_origin_url=${window.location.toString()}`;
      // }
    },
    onDismissQueryMessages: () => {
      dispatch(dismissQueryMessages());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);

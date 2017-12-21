/*
 *
 * UserPassword
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

import {
  getPasswordCurrentField,
  getPasswordNewField,
  getPasswordConfirmationField,
} from 'utils/forms';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import ContentNarrow from 'components/ContentNarrow';
import ContentHeader from 'components/ContentHeader';
import AuthForm from 'components/forms/AuthForm';

import { updatePath } from 'containers/App/actions';

import { PATHS } from 'containers/App/constants';
import appMessages from 'containers/App/messages';
import messages from './messages';

import { save } from './actions';
import userPasswordSelector from './selectors';

export class UserPassword extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.initialiseForm();
  }
  render() {
    const { passwordSending, passwordError } = this.props.userPassword.page;
    const reference = this.props.params.id;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <ContentNarrow>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
          />
          {passwordError &&
            <Messages type="error" messages={passwordError.messages} />
          }
          {passwordSending &&
            <Loading />
          }
          { this.props.userPassword.form &&
            <AuthForm
              model="userPassword.form.data"
              sending={passwordSending}
              handleSubmit={(formData) => this.props.handleSubmit(formData, reference)}
              handleCancel={() => this.props.handleCancel(reference)}
              labels={{ submit: this.context.intl.formatMessage(messages.submit) }}
              fields={[
                getPasswordCurrentField(this.context.intl.formatMessage, appMessages),
                getPasswordNewField(this.context.intl.formatMessage, appMessages),
                getPasswordConfirmationField(this.context.intl.formatMessage, appMessages),
              ]}
            />
          }
        </ContentNarrow>
      </div>
    );
  }
}

UserPassword.propTypes = {
  userPassword: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  params: PropTypes.object,
  initialiseForm: PropTypes.func,
};

UserPassword.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userPassword: userPasswordSelector(state),
});

export function mapDispatchToProps(dispatch) {
  return {
    initialiseForm: () => {
      dispatch(formActions.reset('userPassword.form.data'));
    },
    handleSubmit: (formData, userId) => {
      const saveData = {
        ...formData.toJS(),
        id: userId,
      };
      dispatch(save(saveData));
    },
    handleCancel: (userId) => {
      dispatch(updatePath(`${PATHS.USERS}/${userId}`, { replace: true }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPassword);

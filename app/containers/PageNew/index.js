/*
 *
 * PageNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import {
  getTitleFormField,
  getMenuTitleFormField,
  getMarkdownFormField,
  getStatusField,
  getMenuOrderFormField,
} from 'utils/formik';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';
import {
  selectReady,
  selectReadyForAuthCheck,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import { selectDomain } from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class PageNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
    this.remoteSubmitForm = null;
  }

  UNSAFE_componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
    if (hasNewError(nextProps, this.props) && this.scrollContainer) {
      scrollToTop(this.scrollContainer.current);
    }
  }

  bindHandleSubmit = (submitForm) => {
    this.remoteSubmitForm = submitForm;
  };

  getHeaderMainFields = (intl) =>
    ([ // fieldGroups
      { // fieldGroup
        fields: [
          getTitleFormField(intl.formatMessage),
          getMenuTitleFormField(intl.formatMessage),
          getMenuOrderFormField(intl.formatMessage),
        ],
      },
    ]);

  getHeaderAsideFields = (intl) =>
    ([
      {
        fields: [getStatusField(intl.formatMessage)],
      },
    ]);

  getBodyMainFields = (intl) =>
    ([
      {
        fields: [getMarkdownFormField({
          formatMessage: intl.formatMessage,
          attribute: 'content',
        })],
      },
    ]);

  render() {
    const { viewDomain, dataReady, intl } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();

    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="categories"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                disabled: saveSending,
                onClick: (e) => {
                  if (this.remoteSubmitForm) {
                    this.remoteSubmitForm(e);
                  }
                },
              }] : null
            }
          />
          {!submitValid
            && (
              <Messages
                type="error"
                messageKey="submitInvalid"
                onDismiss={this.props.onErrorDismiss}
              />
            )
          }
          {saveError
            && (
              <Messages
                type="error"
                messages={saveError.messages}
                onDismiss={this.props.onServerErrorDismiss}
              />
            )
          }
          {(saveSending || !dataReady)
            && <Loading />
          }
          {dataReady
            && (
              <EntityForm
                formData={FORM_INITIAL}
                saving={saveSending}
                bindHandleSubmit={this.bindHandleSubmit}
                handleSubmit={(formData) => this.props.handleSubmit(formData)}
                handleSubmitFail={() => this.props.handleSubmitFail()}
                handleCancel={this.props.handleCancel}
                fields={{
                  header: {
                    main: this.getHeaderMainFields(intl),
                    aside: this.getHeaderAsideFields(intl),
                  },
                  body: {
                    main: this.getBodyMainFields(intl),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          { saveSending
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

PageNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func.isRequired,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.ADMIN.value));
    },
    onErrorDismiss: () => {
      dispatch(submitInvalid(true));
    },
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
    },
    handleSubmitFail: () => {
      dispatch(submitInvalid(false));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData));
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.PAGES, { replace: true }));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PageNew));

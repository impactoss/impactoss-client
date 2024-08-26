/*
 *
 * PageEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Map, fromJS } from 'immutable';

import {
  getTitleFormField,
  getMenuTitleFormField,
  getMenuOrderFormField,
  getMarkdownFormField,
  getStatusField,
} from 'utils/forms';

import {
  getMetaField,
} from 'utils/fields';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';
import { canUserDeleteEntities } from 'utils/permissions';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  deleteEntity,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectIsUserAdmin,
  selectSessionUserHighestRoleId,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import {
  selectDomain,
  selectViewEntity,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES, FORM_INITIAL } from './constants';

export class PageEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function
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

  getInitialFormData = ({ viewEntity }) =>
    viewEntity
      ? Map({
        id: viewEntity.get('id'),
        attributes: viewEntity.get('attributes').mergeWith(
          (oldVal, newVal) => oldVal === null ? newVal : oldVal,
          FORM_INITIAL.get('attributes')
        ),
      })
      : Map();

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

  getHeaderAsideFields = (entity, intl) =>
    ([
      {
        fields: [
          getStatusField(intl.formatMessage),
          getMetaField(entity),
        ],
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
    const {
      viewEntity, dataReady, viewDomain, intl,
    } = this.props;
    const reference = this.props.params.id;
    const {
      saveSending, saveError, deleteSending, deleteError, submitValid,
    } = viewDomain.get('page').toJS();

    return (
      <div>
        <HelmetCanonical
          title={`${intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content ref={this.scrollContainer}>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            buttons={
              viewEntity && dataReady ? [{
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
          {deleteError
            && <Messages type="error" messages={deleteError.messages} />
          }
          {(saveSending || deleteSending || !dataReady)
            && <Loading />
          }
          {!viewEntity && dataReady && !saveError && !deleteSending
            && (
              <div>
                <FormattedMessage {...messages.notFound} />
              </div>
            )
          }
          {viewEntity && dataReady && !deleteSending
            && (
              <EntityForm
                formData={this.getInitialFormData(this.props).toJS()}
                saving={saveSending}
                bindHandleSubmit={this.bindHandleSubmit}
                handleSubmit={(formData) => this.props.handleSubmit(formData, viewEntity)}
                handleSubmitFail={this.props.handleSubmitFail}
                handleCancel={this.props.handleCancel}
                handleDelete={canUserDeleteEntities(this.props.highestRole) ? this.props.handleDelete : null}
                fields={{
                  header: {
                    main: this.getHeaderMainFields(intl),
                    aside: this.getHeaderAsideFields(viewEntity, intl),
                  },
                  body: {
                    main: this.getBodyMainFields(intl),
                  },
                }}
                scrollContainer={this.scrollContainer.current}
              />
            )
          }
          { (saveSending || deleteSending)
            && <Loading />
          }
        </Content>
      </div>
    );
  }
}

PageEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  isUserAdmin: PropTypes.bool,
  params: PropTypes.object,
  viewEntity: PropTypes.object,
  highestRole: PropTypes.number,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  isUserAdmin: selectIsUserAdmin(state),
  highestRole: selectSessionUserHighestRoleId(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  viewEntity: selectViewEntity(state, props.params.id),
});

function mapDispatchToProps(dispatch, props) {
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
    handleSubmit: (formValues, viewEntity) => {
      const formData = fromJS(formValues);
      let saveData = formData;
      // check if attributes have changed
      if (saveData.get('attributes').equals(viewEntity.get('attributes'))) {
        saveData = saveData.set('skipAttributes', true);
      }
      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`${ROUTES.PAGES}/${props.params.id}`, { replace: true }));
    },
    handleDelete: () => {
      dispatch(deleteEntity({
        path: 'pages',
        id: props.params.id,
      }));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PageEdit));

/*
 *
 * PageEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import { Map, fromJS } from 'immutable';

import {
  getTitleFormField,
  getMenuTitleFormField,
  getMenuOrderFormField,
  getMarkdownFormField,
  getStatusField,
  getArchiveField,
} from 'utils/forms';

import {
  getMetaField,
} from 'utils/fields';

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';
import { canUserDeleteEntities } from 'utils/permissions';
import { lowerCase } from 'utils/string';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  deleteEntity,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectSessionUserHighestRoleId,
} from 'containers/App/selectors';

import Messages from 'components/Messages';
import Loading from 'components/Loading';
import Content from 'components/Content';
import EntityForm from 'containers/EntityForm';
import NotFoundEntity from 'containers/NotFoundEntity';

import appMessages from 'containers/App/messages';

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

  getInitialFormData = ({ viewEntity }) =>
    viewEntity
      ? Map({
        id: viewEntity.get('id'),
        attributes: viewEntity.get('attributes').mergeWith(
          (oldVal, newVal) => oldVal === null ? newVal : oldVal,
          FORM_INITIAL.get('attributes'),
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
          getArchiveField(intl.formatMessage),
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
      saveSending, saveError, deleteSending, deleteError,
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
          {!viewEntity && dataReady && !saveError && !deleteSending && (
            <NotFoundEntity
              id={this.props.params.id}
              type={lowerCase(intl.formatMessage(appMessages.entities.pages.single))}
            />
          )}
          {viewEntity && dataReady && !deleteSending
            && (
              <EntityForm
                formData={this.getInitialFormData(this.props).toJS()}
                saving={saveSending}
                handleSubmit={(formData) => this.props.handleSubmit(formData, viewEntity)}
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
                headerTitle={intl.formatMessage(messages.pageTitle)}
                headerType={CONTENT_SINGLE}
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
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  params: PropTypes.object,
  viewEntity: PropTypes.object,
  highestRole: PropTypes.number,
  onServerErrorDismiss: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
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
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
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

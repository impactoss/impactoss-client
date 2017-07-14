/*
 *
 * PageEdit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';

import { fromJS } from 'immutable';
import {
  validateRequired,
} from 'utils/forms';

import { PUBLISH_STATUSES, USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import { isReady } from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectViewEntity,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES } from './constants';

export class PageEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
    if (this.props.dataReady && this.props.viewEntity) {
      this.props.populateForm('pageEdit.form.data', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    // repopulate if new data becomes ready
    if (nextProps.dataReady && !this.props.dataReady && nextProps.viewEntity) {
      this.props.redirectIfNotPermitted();
      this.props.populateForm('pageEdit.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { viewEntity } = props;
    return fromJS(viewEntity);
  }

  getHeaderMainFields = (entity) => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          controlType: 'info',
          type: 'reference',
          value: entity.get('id'),
          label: this.context.intl.formatMessage(appMessages.attributes.id),
        },
        {
          id: 'title',
          controlType: 'title',
          model: '.attributes.title',
          label: this.context.intl.formatMessage(appMessages.attributes.title),
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.title),
          validators: {
            required: validateRequired,
          },
          errorMessages: {
            required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
          },
        },
        {
          id: 'menuTitle',
          controlType: 'short',
          model: '.attributes.menu_title',
          label: this.context.intl.formatMessage(appMessages.attributes.menu_title),
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.menu_title),
          validators: {
            required: validateRequired,
          },
          errorMessages: {
            required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
          },
        },
      ],
    },
  ]);

  getHeaderAsideFields = (entity) => ([
    {
      fields: [
        {
          id: 'status',
          controlType: 'select',
          model: '.attributes.draft',
          label: this.context.intl.formatMessage(appMessages.attributes.draft),
          options: PUBLISH_STATUSES,
        },
        {
          controlType: 'info',
          type: 'meta',
          fields: [
            {
              label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_at),
              value: this.context.intl.formatDate(new Date(entity.getIn(['attributes', 'updated_at']))),
            },
            {
              label: this.context.intl.formatMessage(appMessages.attributes.meta.updated_by),
              value: entity.get('user') && entity.get(['user', 'attributes', 'name']),
            },
          ],
        },
      ],
    },
  ]);

  getBodyMainFields = () => ([
    {
      fields: [
        {
          id: 'content',
          controlType: 'markdown',
          model: '.attributes.content',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.content),
          label: this.context.intl.formatMessage(appMessages.attributes.content),
        },
      ],
    },
  ]);

  getFields = (entity) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(entity),
      aside: this.getHeaderAsideFields(entity),
    },
    body: {
      main: this.getBodyMainFields(entity),
    },
  })
  render() {
    const { viewEntity, dataReady, viewDomain } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = viewDomain.viewEntity;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="categories"
            buttons={
              viewEntity && dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(viewDomain.form.data),
              }] : null
            }
          />
          {saveSending &&
            <p>Saving</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          { !viewEntity && !dataReady &&
            <Loading />
          }
          { !viewEntity && dataReady && !saveError &&
            <div>
              <FormattedMessage {...messages.notFound} />
            </div>
          }
          {viewEntity && dataReady &&
            <EntityForm
              model="pageEdit.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(viewEntity)}
            />
          }
        </Content>
      </div>
    );
  }
}

PageEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  params: PropTypes.object,
  viewEntity: PropTypes.object,
};

PageEdit.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  dataReady: isReady(state, { path: DEPENDENCIES }),
  viewEntity: selectViewEntity(state, props.params.id),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.ADMIN));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath(`/pages/${props.params.id}`));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageEdit);

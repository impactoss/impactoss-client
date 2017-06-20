/*
 *
 * SdgTargetNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { Map, List } from 'immutable';

import {
  renderIndicatorControl,
  renderTaxonomyControl,
  validateRequired,
} from 'utils/forms';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { PUBLISH_STATUSES, USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import { getEntities, isReady } from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import viewDomainSelect from './selectors';
import messages from './messages';
import { save } from './actions';


export class SdgTargetNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.redirectIfNotPermitted();
    }
  }

  getHeaderMainFields = () => ([ // fieldGroups
    { // fieldGroup
      fields: [
        {
          id: 'title',
          controlType: 'titleText',
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
      ],
    },
  ]);

  getHeaderAsideFields = () => ([
    {
      fields: [
        {
          id: 'number',
          controlType: 'short',
          model: '.attributes.reference',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.number),
          label: this.context.intl.formatMessage(appMessages.attributes.reference),
          validators: {
            required: validateRequired,
          },
          errorMessages: {
            required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
          },
        },
        {
          id: 'status',
          controlType: 'select',
          model: '.attributes.draft',
          label: this.context.intl.formatMessage(appMessages.attributes.draft),
          options: PUBLISH_STATUSES,
        },
      ],
    },
  ]);

  getBodyMainFields = (indicators) => ([
    {
      fields: [
        {
          id: 'description',
          controlType: 'markdown',
          model: '.attributes.description',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.description),
          label: this.context.intl.formatMessage(appMessages.attributes.description),
        },
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderIndicatorControl(indicators),
      ],
    },
  ]);

  getBodyAsideFields = (taxonomies) => ([ // fieldGroups
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies),
    },
  ]);

  getFields = (taxonomies, indicators) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(),
    },
    body: {
      main: this.getBodyMainFields(indicators),
      aside: this.getBodyAsideFields(taxonomies),
    },
  })
  render() {
    const { dataReady, viewDomain, indicators, taxonomies } = this.props;
    const { saveSending, saveError } = viewDomain.page;

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
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="sdgtargets"
            buttons={
              dataReady ? [{
                type: 'cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'save',
                onClick: () => this.props.handleSubmit(
                  viewDomain.form.data,
                ),
              }] : null
            }
          />
          { !dataReady &&
            <Loading />
          }
          {saveSending &&
            <p>Saving</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          {dataReady &&
            <EntityForm
              model="sdgtargetNew.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(taxonomies, indicators)}
            />
          }
        </Content>
      </div>
    );
  }
}

SdgTargetNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  indicators: PropTypes.object,
};

SdgTargetNew.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: viewDomainSelect(state),
  // all categories for all taggable taxonomies
  dataReady: isReady(state, { path: [
    'categories',
    'taxonomies',
    'indicators',
  ] }),
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      where: {
        tags_sdgtargets: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
      },
    },
  ),
  // all indicators,
  indicators: getEntities(
    state, {
      path: 'indicators',
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('indicators'));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    handleSubmit: (formData) => {
      let saveData = formData;

      // sdgtargetCategories
      if (formData.get('associatedTaxonomies')) {
        saveData = saveData.set(
          'sdgtargetCategories',
          formData.get('associatedTaxonomies')
          .map(getCheckedValuesFromOptions)
          .reduce((updates, formCategoryIds) => Map({
            delete: List(),
            create: updates.get('create').concat(formCategoryIds.map((id) => Map({
              category_id: id,
            }))),
          }), Map({ delete: List(), create: List() }))
        );
      }

      // indicators
      if (formData.get('associatedIndicators')) {
        saveData = saveData.set('sdgtargetIndicators', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedIndicators'))
          .map((id) => Map({
            indicator_id: id,
          })),
        }));
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/sdgtargets'));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SdgTargetNew);

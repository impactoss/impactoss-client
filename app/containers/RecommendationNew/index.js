/*
*
* RecommendationNew
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { Map, List } from 'immutable';

import {
  renderMeasureControl,
  renderTaxonomyControl,
  validateRequired,
} from 'utils/forms';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { PUBLISH_STATUSES, USER_ROLES, CONTENT_SINGLE, ACCEPTED_STATUSES } from 'containers/App/constants';
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


export class RecommendationNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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
          id: 'reference',
          controlType: 'short',
          model: '.attributes.reference',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.reference),
          label: this.context.intl.formatMessage(appMessages.attributes.reference),
          validators: {
            required: validateRequired,
          },
          errorMessages: {
            required: this.context.intl.formatMessage(appMessages.forms.fieldRequired),
          },
        },
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
          id: 'status',
          controlType: 'select',
          model: '.attributes.draft',
          label: this.context.intl.formatMessage(appMessages.attributes.draft),
          options: PUBLISH_STATUSES,
        },
      ],
    },
  ]);
  getBodyMainFields = (measures) => ([
    {
      fields: [
        {
          id: 'accepted',
          controlType: 'select',
          model: '.attributes.accepted',
          label: this.context.intl.formatMessage(appMessages.attributes.accepted),
          options: ACCEPTED_STATUSES,
        },
        {
          id: 'response',
          controlType: 'markdown',
          model: '.attributes.response',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.response),
          label: this.context.intl.formatMessage(appMessages.attributes.response),
        },
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderMeasureControl(measures),
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

  getFields = (taxonomies, measures) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(),
    },
    body: {
      main: this.getBodyMainFields(measures),
      aside: this.getBodyAsideFields(taxonomies),
    },
  })
  render() {
    const { dataReady, viewDomain, taxonomies, measures } = this.props;
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
            icon="recommendations"
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
            <p>Saving Action</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          {dataReady &&
            <EntityForm
              model="recommendationNew.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(taxonomies, measures)}
            />
          }
        </Content>
      </div>
    );
  }
}

RecommendationNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  measures: PropTypes.object,
};

RecommendationNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: viewDomainSelect(state),
  dataReady: isReady(state, { path: [
    'categories',
    'taxonomies',
    'measures',
  ] }),
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      where: {
        tags_recommendations: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
      },
    },
  ),
  measures: getEntities(
    state, {
      path: 'measures',
    },
  ),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('measures'));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    handleSubmit: (formData) => {
      let saveData = formData;

      // measureCategories
      if (formData.get('associatedTaxonomies')) {
        saveData = saveData.set(
          'recommendationCategories',
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

      // measures
      if (formData.get('associatedMeasures')) {
        saveData = saveData.set('recommendationMeasures', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedMeasures'))
          .map((id) => Map({
            measure_id: id,
          })),
        }));
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/recommendations'));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(RecommendationNew);

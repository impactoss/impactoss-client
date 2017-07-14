/*
 *
 * ActionNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { Map, List } from 'immutable';

import {
  renderRecommendationControl,
  renderSdgTargetControl,
  renderIndicatorControl,
  renderTaxonomyControl,
  validateRequired,
  validateDateFormat,
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

import { selectEntities, isReady } from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import {
  selectDomain,
  selectTaxonomies,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { DEPENDENCIES } from './constants';

export class ActionNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

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

  getBodyMainFields = (recommendations, indicators, sdgtargets) => ([
    {
      fields: [
        {
          id: 'description',
          controlType: 'markdown',
          model: '.attributes.description',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.description),
          label: this.context.intl.formatMessage(appMessages.attributes.description),
        },
        {
          id: 'outcome',
          controlType: 'markdown',
          model: '.attributes.outcome',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.outcome),
          label: this.context.intl.formatMessage(appMessages.attributes.outcome),
        },
        {
          id: 'indicator_summary',
          controlType: 'markdown',
          model: '.attributes.indicator_summary',
          placeholder: this.context.intl.formatMessage(appMessages.placeholders.indicator_summary),
          label: this.context.intl.formatMessage(appMessages.attributes.indicator_summary),
        },
      ],
    },
    {
      label: this.context.intl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: [
        renderRecommendationControl(recommendations),
        renderSdgTargetControl(sdgtargets),
        renderIndicatorControl(indicators),
      ],
    },
  ]);

  getBodyAsideFields = (taxonomies) => ([ // fieldGroups
    { // fieldGroup
      fields: [{
        id: 'target_date',
        controlType: 'date',
        model: '.attributes.target_date',
        label: this.context.intl.formatMessage(appMessages.attributes.target_date),
        placeholder: 'YYYY-MM-DD',
        validators: {
          date: validateDateFormat,
        },
        errorMessages: {
          date: this.context.intl.formatMessage(appMessages.forms.dateFormatError),
        },
      },
      {
        id: 'target_date_comment',
        controlType: 'textarea',
        model: '.attributes.target_date_comment',
        label: this.context.intl.formatMessage(appMessages.attributes.target_date_comment),
        placeholder: this.context.intl.formatMessage(appMessages.placeholders.target_date_comment),
      }],
    },
    { // fieldGroup
      label: this.context.intl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(taxonomies),
    },
  ]);

  getFields = (taxonomies, recommendations, indicators, sdgtargets) => ({ // isManager, taxonomies,
    header: {
      main: this.getHeaderMainFields(),
      aside: this.getHeaderAsideFields(),
    },
    body: {
      main: this.getBodyMainFields(recommendations, indicators, sdgtargets),
      aside: this.getBodyAsideFields(taxonomies),
    },
  })
  render() {
    const { dataReady, viewDomain, recommendations, indicators, taxonomies, sdgtargets } = this.props;
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
            icon="measures"
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
              model="measureNew.form.data"
              formData={viewDomain.form.data}
              handleSubmit={(formData) => this.props.handleSubmit(formData)}
              handleCancel={this.props.handleCancel}
              handleUpdate={this.props.handleUpdate}
              fields={this.getFields(taxonomies, recommendations, indicators, sdgtargets)}
            />
          }
        </Content>
      </div>
    );
  }
}

ActionNew.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
  taxonomies: PropTypes.object,
  recommendations: PropTypes.object,
  indicators: PropTypes.object,
  sdgtargets: PropTypes.object,
};

ActionNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
  dataReady: isReady(state, { path: DEPENDENCIES }),
  taxonomies: selectTaxonomies(state),
  sdgtargets: selectEntities(state, 'sdgtargets'),
  indicators: selectEntities(state, 'indicators'),
  recommendations: selectEntities(state, 'recommendations'),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    handleSubmit: (formData) => {
      let saveData = formData;

      // measureCategories
      if (formData.get('associatedTaxonomies')) {
        saveData = saveData.set(
          'measureCategories',
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

      // recommendations
      if (formData.get('associatedRecommendations')) {
        saveData = saveData.set('recommendationMeasures', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedRecommendations'))
          .map((id) => Map({
            recommendation_id: id,
          })),
        }));
      }

      // indicators
      if (formData.get('associatedIndicators')) {
        saveData = saveData.set('measureIndicators', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedIndicators'))
          .map((id) => Map({
            indicator_id: id,
          })),
        }));
      }

      // sdgtargets
      if (formData.get('associatedSdgTargets')) {
        saveData = saveData.set('sdgtargetMeasures', Map({
          delete: List(),
          create: getCheckedValuesFromOptions(formData.get('associatedSdgTargets'))
          .map((id) => Map({
            sdgtarget_id: id,
          })),
        }));
      }

      dispatch(save(saveData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/actions'));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionNew);

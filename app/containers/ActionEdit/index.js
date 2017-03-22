/*
 *
 * ActionEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';
import { browserHistory } from 'react-router';
import { camelCase } from 'lodash/string';
import { difference, without } from 'lodash/array';

import { fromJS } from 'immutable';

import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/EntityForm';
// import MultiSelect from 'components/MultiSelect';

import {
  getEntity,
  getEntities,
  isReady,
} from 'containers/App/selectors';

import {
  pageSelector,
  formSelector,
} from './selectors';

import messages from './messages';
import { save } from './actions';

export class ActionEdit extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();

    if (this.props.action && this.props.actionsReady) {
      this.props.populateForm('actionEdit.form.action', this.getInitialFormData());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action && nextProps.actionsReady && !this.props.actionsReady) {
      this.props.populateForm('actionEdit.form.action', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const data = props.action.attributes;
    const { taxonomies } = this.props;

    // TODO this functionality should be shared
    if (taxonomies) {
      // Reducer - starts with {}, iterate taxonomies, and store assigned ids as { [camelCase(tax.title)]: [assigned,category,ids], ... }
      const assignedTaxonmies = Object.values(taxonomies).reduce((values, tax) => {
        const assigned = tax.categories ? Object.values(tax.categories).filter((cat) => cat.connected) : [];
        return assigned.length > 0
        ? {
          ...values,
          [camelCase(tax.attributes.title)]: assigned.map((cat) => cat.id),
        }
        : values;
      }, {});

      data.taxonomies = assignedTaxonmies;
    }

    return data;
  }

  mapCategoryOptions = (categories) => Object.values(categories).map((cat) => ({
    value: cat.id,
    label: cat.attributes.title,
  }));

  mapRecommendationOptions = (recommendations) => Object.values(recommendations).map((rec) => ({
    value: rec.id,
    label: `${rec.attributes.title}${rec.connected ? ' - connected' : ' - not connected'}`,
  }));

  // TODO this should be shared functionality
  renderTaxonomyControl = (taxonomies) => taxonomies ? Object.values(taxonomies).map((tax) => ({
    id: camelCase(tax.attributes.title),
    model: `.taxonomies.${camelCase(tax.attributes.title)}`,
    title: tax.attributes.title,
    controlType: 'multiselect',
    options: tax.categories ? this.mapCategoryOptions(tax.categories) : [],
  })) : [];


  render() {
    const { action, actionsReady } = this.props;
    const reference = this.props.params.id;
    const { saveSending, saveError } = this.props.page;
    const required = (val) => val && val.length;

    // const taxonomyControl = this.renderTaxonomyControl(this.props.taxonomies);
    // console.log(taxonomyControl)

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}: ${reference}`}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !action && !actionsReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !action && actionsReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        {action &&
          <Page
            title={this.context.intl.formatMessage(messages.pageTitle)}
            actions={[
              {
                type: 'simple',
                title: 'Cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'primary',
                title: 'Save',
                onClick: () => this.props.handleSubmit(this.props.form.action), // TODO This won't work will need a ref I think
              },
            ]}
          >
            <EntityForm
              model="actionEdit.form.action"
              handleSubmit={(formData) => this.props.handleSubmit(formData, this.getInitialFormData())} // we can use inital form data for diffing
              handleCancel={this.props.handleCancel}
              fields={{
                header: {
                  main: [
                    {
                      id: 'title',
                      controlType: 'input',
                      model: '.title',
                      validators: {
                        required,
                      },
                      errorMessages: {
                        required: this.context.intl.formatMessage(messages.fieldRequired),
                      },
                    },
                  ],
                  aside: [
                    {
                      id: 'no',
                      controlType: 'info',
                      displayValue: reference,
                    },
                    {
                      id: 'status',
                      controlType: 'select',
                      model: '.draft',
                      value: action.draft,
                      options: PUBLISH_STATUSES,
                    },
                    {
                      id: 'updated',
                      controlType: 'info',
                      displayValue: action.attributes.updated_at,
                    },
                    {
                      id: 'updated_by',
                      controlType: 'info',
                      displayValue: action.user && action.user.attributes.name,
                    },
                  ],
                },
                body: {
                  main: [
                    {
                      id: 'description',
                      controlType: 'textarea',
                      model: '.description',
                    },
                    {
                      id: 'recommendations',
                      controlType: 'select',
                      options: this.mapRecommendationOptions(this.props.recommendations),
                    },
                  ],
                  aside: this.renderTaxonomyControl(this.props.taxonomies),
                },
              }}
            />
            {/* {taxonomyControl.length > 0 && taxonomyControl[0].options && taxonomyControl[0].options.length > 0 &&
            <MultiSelect onChange={console.log} values={[]} options={taxonomyControl[0].options} /> } */}
          </Page>
        }
        {saveSending &&
          <p>Saving</p>
        }
        {saveError &&
          <p>{saveError}</p>
        }
      </div>
    );
  }
}

ActionEdit.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  populateForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  page: PropTypes.object,
  form: PropTypes.object,
  action: PropTypes.object,
  actionsReady: PropTypes.bool,
  params: PropTypes.object,
  taxonomies: PropTypes.object,
  recommendations: PropTypes.object,
};

ActionEdit.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  page: pageSelector(state),
  form: formSelector(state),
  actionsReady: isReady(state, { path: 'measures' }),
  action: getEntity(
    state,
    {
      id: props.params.id,
      path: 'measures',
      out: 'js',
      extend: {
        type: 'single',
        path: 'users',
        key: 'last_modified_user_id',
        as: 'user',
      },
    },
  ),
  // all categories for all taggable taxonomies, listing connection if any
  taxonomies: getEntities(
    state,
    {
      path: 'taxonomies',
      where: {
        tags_measures: true,
      },
      extend: {
        path: 'categories',
        key: 'taxonomy_id',
        reverse: true,
        extend: {
          as: 'assigned',
          path: 'measure_categories',
          key: 'category_id',
          reverse: true,
          where: {
            measure_id: props.params.id,
          },
        },
      },
      out: 'js',
    },
  ),
  // all recommendations, listing connection if any
  recommendations: getEntities(
    state, {
      path: 'recommendations',
      out: 'js',
      extend: {
        as: 'connected',
        path: 'recommendation_measures',
        key: 'recommendation_id',
        reverse: true,
        where: {
          action_id: props.params.id,
        },
      },
    },
  ),
});

function mapDispatchToProps(dispatch, props) {
  return {
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('measures'));
      dispatch(loadEntitiesIfNeeded('users'));
      dispatch(loadEntitiesIfNeeded('categories'));
      dispatch(loadEntitiesIfNeeded('taxonomies'));
      dispatch(loadEntitiesIfNeeded('recommendations'));
      dispatch(loadEntitiesIfNeeded('recommendation_measures'));
      dispatch(loadEntitiesIfNeeded('measure_categories'));
    },
    populateForm: (model, formData) => {
      dispatch(formActions.load(model, fromJS(formData)));
    },
    handleSubmit: (formData, prevFormData) => {
      // TODO maybe this function should be updated to work with Immutable objects, instead of converting
      const prevTaxonomies = prevFormData.taxonomies || {};
      const saveData = formData.toJS();
      const formTaxonomies = saveData.taxonomies;

      saveData.taxonomies = Object.keys(formTaxonomies).reduce((updates, taxonomy) => ({
        // TODO delete actually needs the join table id :/
        delete: updates.delete.concat(difference(prevTaxonomies[taxonomy], formTaxonomies[taxonomy])),
        create: updates.create.concat(without(formTaxonomies[taxonomy], prevTaxonomies[taxonomy])),
      }), { delete: [], create: [] });

      dispatch(save(saveData, props.params.id));
    },
    handleCancel: () => {
      // not really a dispatch function here, could be a member function instead
      // however
      // - this could in the future be moved to a saga or reducer
      // - also its nice to be next to handleSubmit
      browserHistory.push(`/actions/${props.params.id}`);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionEdit);

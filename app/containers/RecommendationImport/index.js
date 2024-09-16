/*
 *
 * RecommendationImport
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { actions as formActions } from 'react-redux-form/immutable';

import { fromJS } from 'immutable';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES, API, ENTITY_FIELDS } from 'themes/config';
import { getImportFields, getColumnAttribute, validateType } from 'utils/import';
import qe from 'utils/quasi-equals';
import { checkRecommendationAttribute } from 'utils/entities';
import appMessage from 'utils/app-message';

import {
  redirectIfNotPermitted,
  updatePath,
  loadEntitiesIfNeeded,
  resetProgress,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectRecommendationConnections,
  selectCategories,
} from 'containers/App/selectors';

// import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import ImportEntitiesForm from 'components/forms/ImportEntitiesForm';

import {
  selectErrors,
  selectProgress,
  selectFormData,
  selectSuccess,
  selectSending,
} from './selectors';

import messages from './messages';
import { save, resetForm } from './actions';
import { FORM_INITIAL, DEPENDENCIES } from './constants';

export class RecommendationImport extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    if (this.props.dataReady) {
      this.props.initialiseForm('recommendationImport.form.data', FORM_INITIAL);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.initialiseForm('recommendationImport.form.data', FORM_INITIAL);
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
  }

  render() {
    const { intl } = this.context;
    const { connections, categories, params } = this.props;
    const frameworkId = params.id || 1;
    const recFields = ENTITY_FIELDS.recommendations;
    // prepare attribute fields
    const fields = Object.keys(recFields.ATTRIBUTES).reduce((memo, key) => {
      const val = recFields.ATTRIBUTES[key];
      if (
        !val.skipImport
        && checkRecommendationAttribute(frameworkId, key)
      ) {
        return [
          ...memo,
          {
            attribute: key,
            type: val.type || 'text',
            required: !!val.required,
            unique: !!val.unique,
            import: true,
          },
        ];
      }
      return memo;
    }, []);
    // prepare connection fields
    const relationshipFields = Object.keys(
      recFields.RELATIONSHIPS_IMPORT
    ).map((key) => {
      const val = recFields.RELATIONSHIPS_IMPORT[key];
      return {
        attribute: key,
        type: val.type || 'text',
        required: !!val.required,
        import: true,
        relationshipValue: val.attribute,
        separator: val.separator,
        hint: val.hintMessage
          ? appMessage(intl, val.hintMessage)
          : val.hint,
      };
    });
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
        <Content>
          <ContentHeader
            title={intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="recommendations"
            buttons={[{
              type: 'cancel',
              onClick: this.props.handleCancel,
            }]}
          />
          <ImportEntitiesForm
            model="recommendationImport.form.data"
            fieldModel="import"
            formData={this.props.formData}
            handleSubmit={(formData) => {
              this.props.handleSubmit(formData, connections, categories, fields);
            }}
            handleCancel={this.props.handleCancel}
            handleReset={this.props.handleReset}
            resetProgress={this.props.resetProgress}
            errors={this.props.errors}
            success={this.props.success}
            progress={this.props.progress}
            sending={this.props.sending}
            template={{
              filename: `${intl.formatMessage(messages.filename)}.csv`,
              data: getImportFields({
                shape: {
                  fields,
                  relationshipFields,
                },
                type: 'recommendations',
                formatMessage: intl.formatMessage,
              }),
            }}
          />
        </Content>
      </div>
    );
  }
}

RecommendationImport.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  redirectIfNotPermitted: PropTypes.func,
  initialiseForm: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  formData: PropTypes.object,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  resetProgress: PropTypes.func.isRequired,
  progress: PropTypes.number,
  errors: PropTypes.object, // Map
  sending: PropTypes.object, // Map
  success: PropTypes.object, // Map
  params: PropTypes.object,
  connections: PropTypes.object,
  categories: PropTypes.object,
};

RecommendationImport.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  formData: selectFormData(state),
  progress: selectProgress(state),
  errors: selectErrors(state),
  success: selectSuccess(state),
  sending: selectSending(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  connections: selectRecommendationConnections(state),
  categories: selectCategories(state),
});

function mapDispatchToProps(dispatch, { params }) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    resetProgress: () => {
      dispatch(resetProgress());
      dispatch(resetForm());
    },
    initialiseForm: (model, formData) => {
      dispatch(formActions.load(model, formData));
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
    },
    handleSubmit: (formData, connections, categories, fields) => {
      if (formData.get('import') !== null) {
        // submit requests for each row
        fromJS(formData.get('import').rows).forEach((row, index) => {
          // make sure we only take valid columns
          const rowCleanColumns = row.mapKeys((k) => getColumnAttribute(k));
          // use framework id from URL if set, otherwise assume default framework 1
          const frameworkId = params.id || 1;
          let rowClean = {
            attributes: rowCleanColumns
              // make sure only valid fields are imported
              .filter(
                (val, att) => typeof val !== 'undefined'
                  && val !== null
                  && val.toString().trim() !== ''
                  && checkRecommendationAttribute(frameworkId, att)
                  && validateType(att, val, fields)
              )
              .set('framework_id', frameworkId)
              // make sure we only import draft content
              .set('draft', true)
              .toJS(),
            saveRef: index + 1,
          };
          const rowJS = row.toJS();
          // check for relationships from [rel: ...] columns
          // and prep values
          const relationships = Object.keys(rowJS).reduce(
            (memo, key) => {
              const hasRelData = key.indexOf('[rel:') > -1
                && rowJS[key]
                && rowJS[key].trim() !== '';
              if (!hasRelData) return memo;
              const start = key.indexOf('[');
              const end = key.indexOf(']');
              const [, fieldValues] = key.substring(start + 1, end).split('rel:');
              const [field, values] = fieldValues.split('|');
              return [
                ...memo,
                {
                  column: key,
                  value: rowJS[key],
                  values: rowJS[key].trim().split(','),
                  field,
                  fieldValues: values,
                },
              ];
            },
            [],
          );
          // prepare data for sending it to the server,
          // also make sure we only allow connections that exist
          if (relationships) {
            let recommendationMeasures;
            let recommendationIndicators;
            let recommendationCategories;
            Object.values(relationships).forEach(
              (relationship) => {
                if (relationship.values) {
                  const relField = relationship.field;
                  const relConfig = ENTITY_FIELDS.recommendations.RELATIONSHIPS_IMPORT[relationship.field];
                  relationship.values.forEach(
                    (relValue) => {
                      const idOrCode = relValue.trim();
                      if (relConfig) {
                        // assume field to referencet the id
                        let connectionId = idOrCode;
                        // unless attribute specified
                        if (relConfig.lookup && relConfig.lookup.table
                        ) {
                          if (categories && relConfig.lookup.table === API.CATEGORIES) {
                            const category = relConfig.lookup.attribute
                              ? categories.find(
                                // if "short_title" also check for "title" in case short title is auto generated
                                // TODO better explicitly store automatic short title in database when null
                                (entity) => qe(entity.getIn(['attributes', relConfig.lookup.attribute]), idOrCode)
                                  || (relConfig.lookup.attribute === 'short_title' && qe(entity.getIn(['attributes', 'title']).trim(), idOrCode))
                              )
                              : categories.get(idOrCode);
                            connectionId = category ? category.get('id') : null;
                            if (!category) {
                              console.log('category not found');
                              console.log('row', index + 1);
                              console.log('idOrCode', idOrCode);
                            }
                          } else if (connections && connections.get(relConfig.lookup.table)) {
                            const connection = relConfig.lookup.attribute
                              ? connections.get(relConfig.lookup.table).find(
                                (entity) => qe(entity.getIn(['attributes', relConfig.lookup.attribute]), idOrCode)
                              )
                              : connections.get(relConfig.lookup.table).get(idOrCode);
                            connectionId = connection ? connection.get('id') : null;
                            if (!connection) {
                              console.log('connection not found');
                              console.log('row', index + 1);
                              console.log('idOrCode', idOrCode);
                            }
                          }
                        }
                        if (connectionId) {
                          // actor actions by code or id
                          if (relField === 'action-reference' || relField === 'action-id') {
                            const create = { measure_id: connectionId };
                            if (recommendationMeasures && recommendationMeasures.create) {
                              // make sure does not already exist
                              if (!recommendationMeasures.create.find((el) => el.measure_id === connectionId)) {
                                recommendationMeasures.create = [
                                  ...recommendationMeasures.create,
                                  create,
                                ];
                              }
                            } else {
                              recommendationMeasures = { create: [create] };
                            }
                          }
                          // indicator by code or id
                          if (relField === 'indicator-reference' || relField === 'indicator-id') {
                            const create = { indicator_id: connectionId };
                            if (recommendationIndicators && recommendationIndicators.create) {
                              recommendationIndicators.create = [
                                ...recommendationIndicators.create,
                                create,
                              ];
                            } else {
                              recommendationIndicators = { create: [create] };
                            }
                          }
                          // actorCategories by code or id
                          if (
                            relField === 'category-reference'
                            || relField === 'category-id'
                            || relField === 'category-short-title'
                          ) {
                            const create = { category_id: connectionId };
                            if (recommendationCategories && recommendationCategories.create) {
                              // only add if not already present
                              if (!recommendationCategories.create.find((el) => el.category_id === connectionId)) {
                                recommendationCategories.create = [
                                  ...recommendationCategories.create,
                                  create,
                                ];
                              }
                            } else {
                              recommendationCategories = { create: [create] };
                            }
                          }
                        }
                      } // relConfig
                    }
                  ); // forEach
                }
              }
            );
            rowClean = {
              ...rowClean,
              recommendationMeasures,
              recommendationIndicators,
              recommendationCategories,
            };
          }
          // console.log('rowClean', rowClean)
          dispatch(save(rowClean));
        });
      }
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.RECOMMENDATIONS));
    },
    handleReset: () => {
      dispatch(resetProgress());
      dispatch(resetForm());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationImport);

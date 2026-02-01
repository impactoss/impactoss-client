/*
 *
 * RecommendationImport
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

import { format, parse } from 'date-fns';

import { fromJS } from 'immutable';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import {
  API,
  USER_ROLES,
  ENTITY_FIELDS,
  DATE_FORMAT,
  API_DATE_FORMAT,
} from 'themes/config';
import { getImportFields, getColumnAttribute } from 'utils/import';
import { checkRecommendationAttribute, checkAttribute } from 'utils/entities';
import { lowerCase } from 'utils/string';
import qe from 'utils/quasi-equals';

import {
  redirectIfNotPermitted,
  updatePath,
  loadEntitiesIfNeeded,
  resetProgress,
  saveError,
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
import validateDateFormat from 'components/forms/validators/validate-date-format';

import appMessages from 'containers/App/messages';

import {
  selectErrors,
  selectProgress,
  selectSuccess,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { FORM_INITIAL, DEPENDENCIES } from './constants';

function RecommendationImport({
  dataReady,
  authReady,
  onLoadEntitiesIfNeeded,
  onRedirectIfNotPermitted,
  categories,
  connections,
  handleCancel,
  handleSubmit,
  onResetProgress,
  errors,
  success,
  progress,
  intl,
}) {
  // reload entities if invalidated
  useEffect(() => {
    if (!dataReady) {
      onLoadEntitiesIfNeeded();
    }
  }, [dataReady]);
  useEffect(() => {
    if (authReady) {
      onRedirectIfNotPermitted();
    }
  }, [authReady]);
  const typeLabel = intl.formatMessage(appMessages.entities.recommendations.plural);
  const fields = Object.keys(ENTITY_FIELDS.recommendations.ATTRIBUTES).reduce((memo, key) => {
    const val = ENTITY_FIELDS.recommendations.ATTRIBUTES[key];
    if (!val.skipImport && checkRecommendationAttribute(key)) {
      return [
        ...memo,
        {
          attribute: key,
          type: val.type || 'text',
          value: null,
          required: !!val.required,
          import: true,
        },
      ];
    }
    return memo;
  }, []);
  const relationshipFields = Object.keys(
    ENTITY_FIELDS.recommendations.RELATIONSHIPS_IMPORT,
  ).reduce(
    (memo, key) => {
      if (
        checkAttribute({
          att: key,
          attributes: ENTITY_FIELDS.recommendations.RELATIONSHIPS_IMPORT,
        })
      ) {
        const val = ENTITY_FIELDS.recommendations.RELATIONSHIPS_IMPORT[key];
        return [
          ...memo,
          {
            attribute: key,
            type: val.type || 'text',
            required: !!val.required,
            import: true,
            relationshipValue: val.attribute,
            separator: val.separator,
            hint: val.hint,
          },
        ];
      }
      return memo;
    },
    [],
  );
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
            onClick: handleCancel,
          }]}
        />
        <ImportEntitiesForm
          typeLabel={typeLabel}
          fieldModel="import"
          formData={FORM_INITIAL}
          handleSubmit={(formData) => {
            // console.log('handleSubmit', formData);
            handleSubmit(formData, connections, categories);
          }}
          handleCancel={handleCancel}
          resetProgress={onResetProgress}
          errors={errors}
          success={success}
          progress={progress}
          template={{
            filename: `${intl.formatMessage(messages.filename, { type: lowerCase(typeLabel) })}`,
            data: getImportFields({ fields, relationshipFields }, intl.formatMessage),
          }}
        />
      </Content>
    </div>
  );
}

RecommendationImport.propTypes = {
  onLoadEntitiesIfNeeded: PropTypes.func,
  onRedirectIfNotPermitted: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  onResetProgress: PropTypes.func.isRequired,
  progress: PropTypes.number,
  errors: PropTypes.object,
  success: PropTypes.object,
  connections: PropTypes.object,
  categories: PropTypes.object,
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => ({
  progress: selectProgress(state),
  errors: selectErrors(state),
  success: selectSuccess(state),
  connections: selectRecommendationConnections(state),
  categories: selectCategories(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onResetProgress: () => {
      dispatch(resetProgress());
    },
    onRedirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
    },
    handleSubmit: (formValues, connections, categories) => {
      const formData = fromJS(formValues);
      let invalidConnections = [];
      // console.log(formValues);
      if (formData.get('import') !== null) {
        formData.getIn(['import', 'rows']).forEach((row, index) => {
          const rowCleanColumns = row.mapKeys((k) => getColumnAttribute(k));
          // make sure type id is set
          let rowClean = {
            attributes: rowCleanColumns
              // make sure only valid fields are imported
              .filter((val, att) => checkRecommendationAttribute(att))
              // make sure we store well formatted date
              .map((val, att) => {
                const config = ENTITY_FIELDS.recommendations.ATTRIBUTES[att];
                if (config.type === 'date' && val && val.trim() !== '') {
                  if (validateDateFormat(val, DATE_FORMAT)) {
                    return format(
                      parse(val, DATE_FORMAT, new Date()),
                      API_DATE_FORMAT,
                    );
                  }
                  return '';
                }
                return val;
              })
              .set('draft', true)
              .toJS(),
            saveRef: index + 1,
          };
          const rowJS = row.toJS();
          const relRows = Object.keys(rowJS).reduce(
            (memo, key) => {
              const hasRelData = key.indexOf('[rel:') > -1
                && rowJS[key]
                && rowJS[key].trim() !== '';
              if (!hasRelData) return memo;
              const start = key.indexOf('[');
              const end = key.indexOf(']');
              const [, fieldValues] = key.substring(start + 1, end).split('rel:');
              const [field, values] = fieldValues.split('|');
              return checkAttribute({
                att: field,
                attributes: ENTITY_FIELDS.recommendations.RELATIONSHIPS_IMPORT,
              })
                ? [
                  ...memo,
                  {
                    column: key,
                    value: rowJS[key],
                    values: rowJS[key].trim().split(','),
                    field,
                    fieldValues: values,
                  },
                ]
                : memo;
            },
            [],
          );
          // check relationships
          if (relRows) {
            let recommendationMeasures;
            let recommendationIndicators;
            let recommendationCategories;
            // console.log(relRows);
            Object.values(relRows).forEach(
              (relationship) => {
                if (relationship.values) {
                  const relField = relationship.field;
                  const relConfig = ENTITY_FIELDS.recommendations.RELATIONSHIPS_IMPORT[relationship.field];
                  relationship.values.forEach(
                    (relValue) => {
                      // console.log(relValue)
                      const [id] = relValue.trim().split('|');
                      if (relConfig) {
                        // check if connection id is valid
                        let connectionId;
                        // unless attribute specified
                        if (relConfig.lookup && relConfig.lookup.table) {
                          if (relConfig.lookup.attribute) {
                            if (categories && relConfig.lookup.table === API.CATEGORIES) {
                              const category = categories.find(
                                (entity) => entity.getIn(['attributes', relConfig.lookup.attribute])
                                  && qe(entity.getIn(['attributes', relConfig.lookup.attribute]).trim(), id),
                              );
                              if (category) {
                                connectionId = category.get('id');
                              }
                            } else if (connections) {
                              const connection = connections.get(relConfig.lookup.table)
                                && connections.get(relConfig.lookup.table).find(
                                  (entity) => entity.getIn(['attributes', relConfig.lookup.attribute])
                                    && qe(entity.getIn(['attributes', relConfig.lookup.attribute]).trim(), id),
                                );
                              if (connection) {
                                connectionId = connection.get('id');
                              }
                            }
                          } else if (categories && relConfig.lookup.table === API.CATEGORIES) {
                            if (categories.get(`${id}`)) {
                              connectionId = id;
                            }
                          } else if (connections) {
                            if (
                              connections.get(relConfig.lookup.table)
                                && connections.getIn([relConfig.lookup.table, `${id}`])
                            ) {
                              connectionId = id;
                            }
                          }
                        }
                        if (typeof connectionId !== 'undefined') {
                          // recommendationIndicators by code
                          if (
                            relField === 'indicator-reference'
                            || relField === 'indicator-id') {
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
                          // recommendationMeasures by code or id
                          if (
                            relField === 'action-reference'
                            || relField === 'action-id'
                          ) {
                            const create = { measure_id: connectionId };
                            if (recommendationMeasures && recommendationMeasures.create) {
                              recommendationMeasures.create = [
                                ...recommendationMeasures.create,
                                create,
                              ];
                            } else {
                              recommendationMeasures = { create: [create] };
                            }
                          }

                          // recommendationCategories by code or id
                          if (
                            relField === 'category-reference'
                            || relField === 'category-short-title'
                            || relField === 'category-id'
                          ) {
                            const create = { category_id: connectionId };
                            if (recommendationCategories && recommendationCategories.create) {
                              recommendationCategories.create = [
                                ...recommendationCategories.create,
                                create,
                              ];
                            } else {
                              recommendationCategories = { create: [create] };
                            }
                          }
                        } else {
                          invalidConnections = [
                            ...invalidConnections,
                            {
                              id,
                              relField,
                              row: index + 1,
                            },
                          ];
                        }
                      } // relConfig
                    },
                  ); // forEach
                }
              },
            );
            rowClean = {
              ...rowClean,
              recommendationMeasures,
              recommendationCategories,
              recommendationIndicators,
            };
          }
          // console.log('rowClean', rowClean)
          dispatch(save(rowClean));
          // dispatch errors for invalid entries
          invalidConnections.forEach((invalidItem) => {
            const error = {
              error: `Invalid connection: ${JSON.stringify(invalidItem)}`,
              data: invalidItem,
              messages: [`Row ${invalidItem.row}: Invalid connection attribute for ${invalidItem.relField}: '${invalidItem.id}'`],
              name: 'Invalid connection',
            };
            dispatch(saveError(
              error,
              invalidItem,
              Object.assign(
                invalidItem,
                {
                  timestamp: `${Date.now()}-${Math.random().toString(36).slice(-8)}`,
                },
              ),
            ));
          });
        });
      }
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.RECOMMENDATIONS));
    },
    // handleReset: () => {
    //   dispatch(resetProgress());
    //   dispatch(resetForm());
    // },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RecommendationImport));

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
import { getImportFields, getColumnAttribute } from 'utils/import';
import qe from 'utils/quasi-equals';
import { checkRecommendationAttribute } from 'utils/entities';

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
    const typeId = params.id || 1;
    const recFields = ENTITY_FIELDS.recommendations;

    const fields = Object.keys(recFields.ATTRIBUTES).reduce((memo, key) => {
      const val = recFields.ATTRIBUTES[key];
      if (
        !val.skipImport
        && checkRecommendationAttribute(typeId, key)
      ) {
        return [
          ...memo,
          {
            attribute: key,
            type: val.type || 'text',
            required: !!val.required,
            import: true,
          },
        ];
      }
      return memo;
    }, []);
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
        hint: val.hint,
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
              this.props.handleSubmit(formData, connections, categories);
            }}
            handleCancel={this.props.handleCancel}
            handleReset={this.props.handleReset}
            resetProgress={this.props.resetProgress}
            errors={this.props.errors}
            success={this.props.success}
            progress={this.props.progress}
            template={{
              filename: `${intl.formatMessage(messages.filename)}.csv`,
              data: getImportFields({ fields, relationshipFields }, intl.formatMessage),
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
  errors: PropTypes.object,
  success: PropTypes.object,
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
    handleSubmit: (formData, connections, categories) => {
      if (formData.get('import') !== null) {
        fromJS(formData.get('import').rows).forEach((row, index) => {
          console.log('row index', row, index);
          const rowCleanColumns = row.mapKeys((k) => getColumnAttribute(k));
          const typeId = params.id || 1;
          // make sure type id is set
          let rowClean = {
            attributes: rowCleanColumns
              // make sure only valid fields are imported
              .filter((val, att) => checkRecommendationAttribute(typeId, att))
              // make sure we store well formatted date
              // .map((val, att) => {
              //   const config = ENTITY_FIELDS.recommendations.ATTRIBUTES[att];
              //   // if (config.type === 'date' && val && val.trim() !== '') {
              //   //   if (validateDateFormat(val, DATE_FORMAT)) {
              //   //     return format(
              //   //       parse(val, DATE_FORMAT, new Date()),
              //   //       API_DATE_FORMAT
              //   //     );F
              //   //   }
              //   //   return '';
              //   // }
              //   return val;
              // })
              .set('framework_id', typeId)
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
              // console.log('hasRelData', hasRelData, key, rowJS[key])
              if (!hasRelData) return memo;
              const start = key.indexOf('[');
              const end = key.indexOf(']');
              const [, fieldValues] = key.substring(start + 1, end).split('rel:');
              const [field, values] = fieldValues.split('|');
              // console.log('values', values);
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
          // const attributes = row
          //   .mapKeys((k) => getColumnAttribute(k))
          //   .set('draft', true)
          //   .toJS();

          // console.log(relRows)
          if (relRows) {
            let recommendationMeasures;
            let recommendationCategories;
            Object.values(relRows).forEach(
              (relationship) => {
                if (relationship.values) {
                  const relField = relationship.field;
                  const relConfig = ENTITY_FIELDS.recommendations.RELATIONSHIPS_IMPORT[relationship.field];
                  // console.log('connections', connections && connections.toJS(0))
                  relationship.values.forEach(
                    (relValue) => {
                      const idOrCode = relValue;
                      if (relConfig) {
                        // assume field to referencet the id
                        let connectionId = 'INVALID';
                        // unless attribute specified
                        if (relConfig.lookup && relConfig.lookup.table
                        ) {
                          if (categories && relConfig.lookup.table === API.CATEGORIES) {
                            const category = relConfig.lookup.attribute
                              ? categories.find(
                                (entity) => qe(entity.getIn(['attributes', relConfig.lookup.attribute]), idOrCode)
                              )
                              : categories.get(idOrCode);
                            if (category) {
                              connectionId = category.get('id');
                            }
                          } else if (connections && connections.get(relConfig.lookup.table)) {
                            const connection = relConfig.lookup.attribute
                              ? connections.get(relConfig.lookup.table).find(
                                (entity) => qe(entity.getIn(['attributes', relConfig.lookup.attribute]), idOrCode)
                              )
                              : connections.get(relConfig.lookup.table).get(idOrCode);
                            if (connection) {
                              connectionId = connection.get('id');
                            }
                          }
                        }
                        // actor actions by code or id
                        if (relField === 'action-reference' || relField === 'action-id') {
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
                        // actorCategories by code or id
                        if (relField === 'category-reference' || relField === 'category-id') {
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
                      } // relConfig
                    }
                  ); // forEach
                }
              }
            );
            rowClean = {
              ...rowClean,
              recommendationMeasures,
              recommendationCategories,
            };
          }
          console.log(rowClean);
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

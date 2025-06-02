/*
 *
 * RecommendationImport
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { injectIntl } from 'react-intl';

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
  selectSuccess,
  selectSending,
} from './selectors';

import messages from './messages';
import { save } from './actions';
import { FORM_INITIAL } from './constants';

export class RecommendationImport extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
  }

  render() {
    const { intl } = this.props;
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
            fieldModel="import"
            formData={FORM_INITIAL}
            handleSubmit={(formData) => this.props.handleSubmit(formData)}
            handleCancel={this.props.handleCancel}
            resetProgress={this.props.resetProgress}
            errors={this.props.errors}
            success={this.props.success}
            progress={this.props.progress}
            sending={this.props.sending}
            template={{
              filename: `${intl.formatMessage(messages.filename)}`,
              data: getImportFields({
                fields: [
                  {
                    attribute: 'reference',
                    type: 'text',
                    required: true,
                    import: true,
                  },
                  {
                    attribute: 'title',
                    type: 'text',
                    required: true,
                    import: true,
                  },
                  {
                    attribute: 'description',
                    label: 'fullRecommendation',
                    type: 'markdown',
                    import: true,
                  },
                  {
                    attribute: 'support_level',
                    type: 'number',
                    import: true,
                  },
                  {
                    attribute: 'response',
                    type: 'markdown',
                    import: true,
                  },
                ],
              }, intl.formatMessage),
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
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  dataReady: PropTypes.bool,
  authReady: PropTypes.bool,
  resetProgress: PropTypes.func.isRequired,
  progress: PropTypes.number,
  errors: PropTypes.object,
  success: PropTypes.object,
  intl: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => ({
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
    },
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER.value));
    },
    handleSubmit: (formValues) => {
      const formData = fromJS(formValues)
      if (formData.get('import') !== null) {
        formData.getIn(['import', 'rows']).forEach((row, index) => {
          const attributes = row
            .mapKeys((k) => getColumnAttribute(k))
            .set('draft', true)
            .toJS();
          if (!attributes.framework_id) {
            attributes.framework_id = 1;
          }
          dispatch(save({
            attributes,
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
                                (entity) => qe(entity.getIn(['attributes', relConfig.lookup.attribute]), idOrCode)
                              )
                              : categories.get(idOrCode);
                            connectionId = category ? category.get('id') : `INVALID|${idOrCode}`;
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
                            connectionId = connection ? connection.get('id') : `INVALID|${idOrCode}`;
                            if (!connection) {
                              console.log('connection not found');
                              console.log('row', index + 1);
                              console.log('idOrCode', idOrCode);
                            }
                          }
                        }
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
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RecommendationImport));

/*
 *
 * ActionImport
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
import { checkActionAttribute } from 'utils/entities';

import {
  redirectIfNotPermitted,
  updatePath,
  loadEntitiesIfNeeded,
  resetProgress,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectMeasureConnections,
  selectCategories,
} from 'containers/App/selectors';

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

export class ActionImport extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
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
            icon="measures"
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
                    type: 'markdown',
                    import: true,
                  },
                  {
                    attribute: 'outcome',
                    type: 'markdown',
                    label: 'comment',
                    import: true,
                  },
                  {
                    disabled: true,
                    attribute: 'indicator_summary',
                    type: 'markdown',
                    import: true,
                  },
                  {
                    attribute: 'target_date',
                    type: 'date',
                    import: true,
                  },
                  {
                    attribute: 'target_date_comment',
                    type: 'text',
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

ActionImport.propTypes = {
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
  connections: selectMeasureConnections(state),
  categories: selectCategories(state),
});

function mapDispatchToProps(dispatch) {
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
      const formData = fromJS(formValues);
      if (formData.get('import') !== null) {
        formData.getIn(['import', 'rows']).forEach((row, index) => {
          dispatch(save({
            attributes: row
              .mapKeys((k) => getColumnAttribute(k))
              .set('draft', true)
              // for testing, give new ref everytime
              // .set('reference', Math.random().toString(36).slice(-8))
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
            let measureIndicators;
            let measureCategories;
            Object.values(relationships).forEach(
              (relationship) => {
                if (relationship.values) {
                  const relField = relationship.field;
                  const relConfig = ENTITY_FIELDS.measures.RELATIONSHIPS_IMPORT[relationship.field];
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
                        // recommendations by code or id
                        if (relField === 'recommendation-reference' || relField === 'recommendation-id') {
                          const create = { recommendation_id: connectionId };
                          if (recommendationMeasures && recommendationMeasures.create) {
                            if (!recommendationMeasures.create.find((el) => el.recommendation_id === connectionId)) {
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
                          if (measureIndicators && measureIndicators.create) {
                            measureIndicators.create = [
                              ...measureIndicators.create,
                              create,
                            ];
                          } else {
                            measureIndicators = { create: [create] };
                          }
                        }
                        // categories by code or id
                        if (
                          relField === 'category-reference'
                          || relField === 'category-id'
                          || relField === 'category-short-title'
                        ) {
                          const create = { category_id: connectionId };
                          if (measureCategories && measureCategories.create) {
                            measureCategories.create = [
                              ...measureCategories.create,
                              create,
                            ];
                          } else {
                            measureCategories = { create: [create] };
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
              measureIndicators,
              measureCategories,
            };
          }
          dispatch(save(rowClean));
        });
      }
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.MEASURES));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ActionImport));

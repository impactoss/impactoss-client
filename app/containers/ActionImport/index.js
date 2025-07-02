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

import { format, parse } from 'date-fns';

import { fromJS } from 'immutable';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import {
  USER_ROLES,
  ENTITY_FIELDS,
  DATE_FORMAT,
  API_DATE_FORMAT,
} from 'themes/config';
import { getImportFields, getColumnAttribute } from 'utils/import';
import { checkActionAttribute, checkAttribute } from 'utils/entities';
import { lowerCase  } from 'utils/string';

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

import appMessages from 'containers/App/messages';

import {
  selectErrors,
  selectProgress,
  selectSuccess,
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
    const { connections, categories, params } = this.props;
    const typeLabel = intl.formatMessage(appMessages.entities.measures.plural);

    const fields = Object.keys(ENTITY_FIELDS.measures.ATTRIBUTES).reduce((memo, key) => {
      const val = ENTITY_FIELDS.measures.ATTRIBUTES[key];
      if (!val.skipImport && checkActionAttribute(key)) {
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
      ENTITY_FIELDS.measures.RELATIONSHIPS_IMPORT
    ).reduce(
      (memo, key) => {
        if (
          checkAttribute({
            att: key,
            attributes: ENTITY_FIELDS.measures.RELATIONSHIPS_IMPORT,
          })
        ) {
          const val = ENTITY_FIELDS.measures.RELATIONSHIPS_IMPORT[key];
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
    //
    // const fields = [
    //   {
    //     attribute: 'reference',
    //     type: 'text',
    //     required: true,
    //     import: true,
    //   },
    //   {
    //     attribute: 'title',
    //     type: 'text',
    //     required: true,
    //     import: true,
    //   },
    //   {
    //     attribute: 'description',
    //     type: 'markdown',
    //     import: true,
    //   },
    //   {
    //     attribute: 'outcome',
    //     type: 'markdown',
    //     label: 'comment',
    //     import: true,
    //   },
    //   {
    //     disabled: true,
    //     attribute: 'indicator_summary',
    //     type: 'markdown',
    //     import: true,
    //   },
    //   {
    //     attribute: 'target_date',
    //     type: 'date',
    //     import: true,
    //   },
    //   {
    //     attribute: 'target_date_comment',
    //     type: 'text',
    //     import: true,
    //   },
    // ];

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
            typeLabel={typeLabel}
            fieldModel="import"
            formData={FORM_INITIAL}
            handleSubmit={(formData) => {
              this.props.handleSubmit(formData, connections, categories);
            }}
            handleCancel={this.props.handleCancel}
            resetProgress={this.props.resetProgress}
            errors={this.props.errors}
            success={this.props.success}
            progress={this.props.progress}
            template={{
              filename: `${intl.formatMessage(messages.filename, { type: lowerCase(typeLabel) })}.csv`,
              data: getImportFields({ fields, relationshipFields }, intl.formatMessage),
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
  params: PropTypes.object,
  connections: PropTypes.object,
  categories: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  progress: selectProgress(state),
  errors: selectErrors(state),
  success: selectSuccess(state),
  connections: selectMeasureConnections(state),
  categories: selectCategories(state),
  dataReady: selectReady(state, {
    path: [
      'user_roles',
    ],
  }),
  authReady: selectReadyForAuthCheck(state),
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
    handleSubmit: (formValues, connections, categories) => {
      const formData = fromJS(formValues);
      if (formData.get('import') !== null) {
        fromJS(formData.get('import').rows).forEach((row, index) => {
          let rowCleanColumns = row.mapKeys((k) => getColumnAttribute(k));
          // make sure type id is set
          let rowClean = {
            attributes: rowCleanColumns
              // make sure only valid fields are imported
              .filter((val, att) => checkActionAttribute(att))
              // make sure we store well formatted date
              .map((val, att) => {
                const config = ENTITY_FIELDS.measures.ATTRIBUTES[att];
                if (config.type === 'date' && val && val.trim() !== '') {
                  if (validateDateFormat(val, DATE_FORMAT)) {
                    return format(
                      parse(val, DATE_FORMAT, new Date()),
                      API_DATE_FORMAT
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
              // console.log('hasRelData', hasRelData, key, rowJS[key])
              if (!hasRelData) return memo;
              const start = key.indexOf('[');
              const end = key.indexOf(']');
              const [, fieldValues] = key.substring(start + 1, end).split('rel:');
              const [field, values] = fieldValues.split('|');
              // console.log('values', values);
              return checkAttribute({
                att: field,
                attributes: ENTITY_FIELDS.measures.RELATIONSHIPS_IMPORT,
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
            let recommendationActions;
            let actionIndicators;
            let actionCategories;
            Object.values(relRows).forEach(
              (relationship) => {
                if (relationship.values) {
                  const relField = relationship.field;
                  const relConfig = ENTITY_FIELDS.measures.RELATIONSHIPS_IMPORT[relationship.field];
                  relationship.values.forEach(
                    (relValue) => {
                      const [id, value] = relValue.trim().split('|');
                      if (relConfig) {
                        // assume field to referencet the id
                        let connectionId = id;
                        // unless attribute specified
                        if (relConfig.lookup
                          && relConfig.lookup.table
                          && relConfig.lookup.attribute
                        ) {
                          if (categories && relConfig.lookup.table === API.CATEGORIES) {
                            const category = categories.find(
                              (entity) => qe(entity.getIn(['attributes', relConfig.lookup.attribute]), id)
                            );
                            connectionId = category ? category.get('id') : 'INVALID';
                          } else if (connections) {
                            const connection = connections.get(relConfig.lookup.table)
                              && connections.get(relConfig.lookup.table).find(
                                (entity) => qe(entity.getIn(['attributes', relConfig.lookup.attribute]), id)
                              );
                            connectionId = connection ? connection.get('id') : 'INVALID';
                          }
                        }
                        // actionIndicators by code
                        if (
                          relField === 'indicator-reference'
                          || relField === 'indicator-id') {
                          const create = { indicator_id: connectionId };
                          if (actionIndicators && actionIndicators.create) {
                            actionIndicators.create = [
                              ...actionIndicators.create,
                              create,
                            ];
                          } else {
                            actionIndicators = { create: [create] };
                          }
                        }
                        // recommendationActions by code or id
                        if (
                          relField === 'recommendation-reference'
                          || relField === 'recommendation-id'
                        ) {
                          const create = { recommendation_id: connectionId };
                          if (recommendationActions && recommendationActions.create) {
                            recommendationActions.create = [
                              ...recommendationActions.create,
                              create,
                            ];
                          } else {
                            recommendationActions = { create: [create] };
                          }
                        }

                        // actionCategories by code or id
                        if (
                          relField === 'category-reference'
                          || relField === 'category-short-title'
                        || relField === 'category-id') {
                          const create = { category_id: connectionId };
                          if (actionCategories && actionCategories.create) {
                            actionCategories.create = [
                              ...actionCategories.create,
                              create,
                            ];
                          } else {
                            actionCategories = { create: [create] };
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
              recommendationActions,
              actionCategories,
              actionIndicators,
            };
          }
          dispatch(save(rowClean));
        });
      }
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.MEASURES));
    },
    handleReset: () => {
      dispatch(resetProgress());
      dispatch(resetForm());
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ActionImport));

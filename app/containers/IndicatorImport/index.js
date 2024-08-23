/*
 *
 * IndicatorImport
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HelmetCanonical from 'components/HelmetCanonical';
import { actions as formActions } from 'react-redux-form/immutable';

import { fromJS } from 'immutable';

import { ROUTES, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES, ENTITY_FIELDS } from 'themes/config';
import { getImportFields, getColumnAttribute } from 'utils/import';

import qe from 'utils/quasi-equals';
import { checkIndicatorAttribute, checkActionAttribute } from 'utils/entities';

import {
  redirectIfNotPermitted,
  updatePath,
  loadEntitiesIfNeeded,
  resetProgress,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
  selectIndicatorConnections,
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

export class IndicatorImport extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  UNSAFE_componentWillMount() {
    if (this.props.dataReady) {
      this.props.initialiseForm('indicatorImport.form.data', FORM_INITIAL);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.initialiseForm('indicatorImport.form.data', FORM_INITIAL);
    }
    if (nextProps.authReady && !this.props.authReady) {
      this.props.redirectIfNotPermitted();
    }
  }

  render() {
    const { intl } = this.context;
    const { connections } = this.props;

    const recFields = ENTITY_FIELDS.indicators;
    // prepare attribute fields
    const fields = Object.keys(recFields.ATTRIBUTES).reduce((memo, key) => {
      const val = recFields.ATTRIBUTES[key];
      if (
        !val.skipImport
        && checkIndicatorAttribute(key)
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
            icon="indicators"
            buttons={[{
              type: 'cancel',
              onClick: this.props.handleCancel,
            }]}
          />
          <ImportEntitiesForm
            model="indicatorImport.form.data"
            fieldModel="import"
            formData={this.props.formData}
            handleSubmit={(formData) => this.props.handleSubmit(formData, connections)}
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

IndicatorImport.propTypes = {
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
  connections: PropTypes.object,
};

IndicatorImport.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  formData: selectFormData(state),
  progress: selectProgress(state),
  errors: selectErrors(state),
  success: selectSuccess(state),
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  authReady: selectReadyForAuthCheck(state),
  connections: selectIndicatorConnections(state),
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
    handleSubmit: (formData, connections) => {
      if (formData.get('import') !== null) {
        fromJS(formData.get('import').rows).forEach((row, index) => {
          // make sure we only take valid columns
          const rowCleanColumns = row.mapKeys((k) => getColumnAttribute(k));
          // use framework id from URL if set, otherwise assume default framework 1
          const frameworkId = params.id || 1;
          let rowClean = {
            attributes: rowCleanColumns
              // make sure only valid fields are imported
              .filter((val, att) => checkActionAttribute(att))
              .set('framework_id', frameworkId)
              // make sure we only import draft content
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
            let measureIndicators;
            Object.values(relationships).forEach(
              (relationship) => {
                if (relationship.values) {
                  const relField = relationship.field;
                  const relConfig = ENTITY_FIELDS.indicators.RELATIONSHIPS_IMPORT[relationship.field];
                  relationship.values.forEach(
                    (relValue) => {
                      const idOrCode = relValue;
                      if (relConfig) {
                        // assume field to referencet the id
                        let connectionId = 'INVALID';
                        // unless attribute specified
                        if (relConfig.lookup && relConfig.lookup.table) {
                          if (connections && connections.get(relConfig.lookup.table)) {
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
                        // action by code or id
                        if (relField === 'action-reference' || relField === 'action-id') {
                          const create = { action_id: connectionId };
                          if (measureIndicators && measureIndicators.create) {
                            measureIndicators.create = [
                              ...measureIndicators.create,
                              create,
                            ];
                          } else {
                            measureIndicators = { create: [create] };
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
              measureIndicators,
            };
            dispatch(save(rowClean));
          }
        });
      }
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.INDICATORS));
    },
    handleReset: () => {
      dispatch(resetProgress());
      dispatch(resetForm());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorImport);

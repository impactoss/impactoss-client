/*
 *
 * IndicatorImport
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { actions as formActions } from 'react-redux-form/immutable';

import { fromJS } from 'immutable';

import { PATHS, CONTENT_SINGLE } from 'containers/App/constants';
import { USER_ROLES } from 'themes/config';
import { getImportFields, getColumnAttribute } from 'utils/import';

import {
  redirectIfNotPermitted,
  updatePath,
  loadEntitiesIfNeeded,
  resetProgress,
} from 'containers/App/actions';

import {
  selectReady,
  selectReadyForAuthCheck,
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
import { FORM_INITIAL } from './constants';

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
    return (
      <div>
        <Helmet
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
            handleSubmit={(formData) => this.props.handleSubmit(formData)}
            handleCancel={this.props.handleCancel}
            handleReset={this.props.handleReset}
            resetProgress={this.props.resetProgress}
            errors={this.props.errors}
            success={this.props.success}
            progress={this.props.progress}
            template={{
              filename: `${intl.formatMessage(messages.filename)}.csv`,
              data: getImportFields({
                fields: [
                  {
                    attribute: 'reference',
                    type: 'text',
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
                ],
              }, intl.formatMessage),
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
};

IndicatorImport.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  formData: selectFormData(state),
  progress: selectProgress(state),
  errors: selectErrors(state),
  success: selectSuccess(state),
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
      dispatch(loadEntitiesIfNeeded('user_roles'));
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
    handleSubmit: (formData) => {
      if (formData.get('import') !== null) {
        fromJS(formData.get('import').rows).forEach((row, index) => {
          dispatch(save({
            attributes: row
              .mapKeys((k) => getColumnAttribute(k))
              .set('draft', true)
              .toJS(),
            saveRef: index + 1,
          }));
        });
      }
    },
    handleCancel: () => {
      dispatch(updatePath(PATHS.INDICATORS));
    },
    handleReset: () => {
      dispatch(resetProgress());
      dispatch(resetForm());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorImport);

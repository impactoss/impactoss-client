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
import ImportEntitiesForm from 'components/formik/ImportEntitiesForm';

import {
  selectErrors,
  selectProgress,
  selectSuccess,
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
                    attribute: 'accepted',
                    type: 'bool',
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
          }));
        });
      }
    },
    handleCancel: () => {
      dispatch(updatePath(ROUTES.RECOMMENDATIONS));
    },
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RecommendationImport));

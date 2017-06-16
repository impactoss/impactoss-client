/*
 *
 * ActionImport
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { Map, List, fromJS } from 'immutable';

import {
  renderRecommendationControl,
  renderIndicatorControl,
  renderTaxonomyControl,
  validateRequired,
  validateDateFormat,
} from 'utils/forms';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

import { PUBLISH_STATUSES, USER_ROLES, CONTENT_SINGLE } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import {
  loadEntitiesIfNeeded,
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import { getEntities, isReady } from 'containers/App/selectors';

import Loading from 'components/Loading';
import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import ImportEntitiesForm from 'components/forms/ImportEntitiesForm';

import viewDomainSelect from './selectors';
import messages from './messages';
import { save } from './actions';


export class ActionImport extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.redirectIfNotPermitted();
    }
  }

  render() {
    const { viewDomain } = this.props;
    const { saveSending, saveError } = viewDomain.page;

    return (
      <div>
        <Helmet
          title={`${this.context.intl.formatMessage(messages.pageTitle)}`}
          meta={[
            {
              name: 'description',
              content: this.context.intl.formatMessage(messages.metaDescription),
            },
          ]}
        />
        <Content>
          <ContentHeader
            title={this.context.intl.formatMessage(messages.pageTitle)}
            type={CONTENT_SINGLE}
            icon="actions"
          />
          {saveSending &&
            <p>Importing Actions</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          <ImportEntitiesForm
            model="actionImport.form.data"
            formData={viewDomain.form.data}
            fieldModel="import"
            handleSubmit={(formData) => this.props.handleSubmit(formData)}
            handleCancel={this.props.handleCancel}
            template={{
              filename: 'actions_import.csv',
              data: [{
                title: 'text (required)',
                description: 'text',
                target_date: 'date',
              }],
            }}
          />
        </Content>
      </div>
    );
  }
}

ActionImport.propTypes = {
  redirectIfNotPermitted: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
};

ActionImport.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: viewDomainSelect(state),
  dataReady: isReady(state, { path: [
    'user_roles',
  ] }),
});

function mapDispatchToProps(dispatch) {
  return {
    redirectIfNotPermitted: () => {
      dispatch(redirectIfNotPermitted(USER_ROLES.MANAGER));
    },
    handleSubmit: (formData) => {
      if(formData.get('import') !== null) {
        let saveData = formData.get('import').rows;
        fromJS(formData.get('import').rows).map((row) => {
          const attributes = row.set('draft', true).toJS();
          dispatch(save({attributes}));
        })
      }
    },
    handleCancel: () => {
      dispatch(updatePath('/actions'));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionImport);

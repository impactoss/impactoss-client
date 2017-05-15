/*
 *
 * PageNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import { FormattedMessage } from 'react-intl';

import { PUBLISH_STATUSES, USER_ROLES } from 'containers/App/constants';

import {
  redirectIfNotPermitted,
  updatePath,
  updateEntityForm,
} from 'containers/App/actions';

import Page from 'components/Page';
import EntityForm from 'components/forms/EntityForm';

import { isReady } from 'containers/App/selectors';

import viewDomainSelect from './selectors';

import messages from './messages';
import { save } from './actions';


export class PageNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillReceiveProps(nextProps) {
    if (nextProps.dataReady && !this.props.dataReady) {
      this.props.redirectIfNotPermitted();
    }
  }
  render() {
    const { viewDomain } = this.props;
    const { saveSending, saveError } = viewDomain.page;
    const required = (val) => val && val.length;

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
        <Page
          title={this.context.intl.formatMessage(messages.pageTitle)}
          actions={
            [
              {
                type: 'simple',
                title: 'Cancel',
                onClick: this.props.handleCancel,
              },
              {
                type: 'primary',
                title: 'Save',
                onClick: () => this.props.handleSubmit(
                  viewDomain.form.data,
                ),
              },
            ]
          }
        >
          {saveSending &&
            <p>Saving Page</p>
          }
          {saveError &&
            <p>{saveError}</p>
          }
          <EntityForm
            model="pageNew.form.data"
            formData={viewDomain.form.data}
            handleSubmit={(formData) => this.props.handleSubmit(formData)}
            handleCancel={this.props.handleCancel}
            handleUpdate={this.props.handleUpdate}
            fields={{
              header: {
                main: [
                  {
                    id: 'title',
                    controlType: 'input',
                    model: '.attributes.title',
                    placeholder: this.context.intl.formatMessage(messages.fields.title.placeholder),
                    validators: {
                      required,
                    },
                    errorMessages: {
                      required: this.context.intl.formatMessage(messages.fieldRequired),
                    },
                  },
                  {
                    id: 'menuTitle',
                    controlType: 'input',
                    label: 'Menu title',
                    model: '.attributes.menu_title',
                  },
                ],
                aside: [
                  {
                    id: 'status',
                    controlType: 'select',
                    model: '.attributes.draft',
                    options: PUBLISH_STATUSES,
                  },
                ],
              },
              body: {
                main: [
                  {
                    id: 'content',
                    controlType: 'textarea',
                    model: '.attributes.content',
                  },
                ],
                aside: [],
              },
            }}
          />
        </Page>
      </div>
    );
  }
}

PageNew.propTypes = {
  redirectIfNotPermitted: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  viewDomain: PropTypes.object,
  dataReady: PropTypes.bool,
};

PageNew.contextTypes = {
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
      dispatch(redirectIfNotPermitted(USER_ROLES.ADMIN));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData.toJS()));
    },
    handleCancel: () => {
      dispatch(updatePath('/pages'));
    },
    handleUpdate: (formData) => {
      dispatch(updateEntityForm(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageNew);

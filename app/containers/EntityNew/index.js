/*
 *
 * EntityNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions as formActions } from 'react-redux-form/immutable';

import { getEntityFields } from 'utils/forms';
import { attributesEqual } from 'utils/entities';
import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import {
  newEntity,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import {
  selectEntity,
  selectFrameworkQuery,
  selectFrameworksForQuery,
} from 'containers/App/selectors';
import { selectParentOptions, selectParentTaxonomy } from 'containers/CategoryNew/selectors';


import { DEFAULT_FRAMEWORK } from 'themes/config';
import { CONTENT_MODAL } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import Content from 'components/Content';
import Messages from 'components/Messages';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'containers/EntityForm';

import { selectDomain } from './selectors';
import { FORM_INITIAL } from './constants';

import messages from './messages';

export class EntityNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      scrollContainer: null,
    };
  }
  componentWillMount() {
    this.props.initialiseForm('entityNew.form.data', FORM_INITIAL);
  }
  componentWillReceiveProps(nextProps) {
    if (hasNewError(nextProps, this.props) && this.state.scrollContainer) {
      scrollToTop(this.state.scrollContainer);
    }
  }

  getTaxTitle = (id) => this.context.intl.formatMessage(appMessages.entities.taxonomies[id].single);

  render() {
    const {
      viewDomain,
      path,
      attributes,
      inModal,
      taxonomy,
      categoryParentOptions,
      parentTaxonomy,
      frameworks,
      frameworkId,
    } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.page;

    let pageTitle;
    let hasResponse;
    let fwSpecified;
    let icon = path;
    if (path === 'categories' && taxonomy && taxonomy.get('attributes')) {
      pageTitle = this.context.intl.formatMessage(messages[path].pageTitleTaxonomy, {
        taxonomy: this.getTaxTitle(taxonomy.get('id')),
      });
    } else if (path === 'recommendations') {
      // check if single framework set
      fwSpecified = (frameworkId && frameworkId !== 'all');
      // figure out framework id from form if not set
      const currentFrameworkId = fwSpecified
        ? frameworkId
        : viewDomain.form.data.getIn(['attributes', 'framework_id']) || DEFAULT_FRAMEWORK;
      // get current framework
      const currentFramework =
        frameworks &&
        frameworks.find((fw) => attributesEqual(fw.get('id'), currentFrameworkId));
      // get framework type
      const type = path === 'recommendations' && this.context.intl.formatMessage(
        appMessages.entities[fwSpecified ? `${path}_${frameworkId}` : path].single
      );
      // check if response is required
      hasResponse = currentFramework && currentFramework.getIn(['attributes', 'has_response']);
      // figure out title and icon
      pageTitle = this.context.intl.formatMessage(messages[path].pageTitle, { type });
      icon = fwSpecified ? `${path}_${frameworkId}` : path;
    } else {
      pageTitle = this.context.intl.formatMessage(messages[path].pageTitle);
    }

    return (
      <div>
        <Content
          innerRef={(node) => {
            if (!this.state.scrollContainer) {
              this.setState({ scrollContainer: node });
            }
          }}
          inModal={inModal}
        >
          <ContentHeader
            title={pageTitle}
            type={CONTENT_MODAL}
            icon={icon}
            buttons={[{
              type: 'cancel',
              onClick: this.props.onCancel,
            },
            {
              type: 'save',
              disabled: saveSending,
              onClick: () => this.props.handleSubmitRemote('entityNew.form.data'),
            }]}
          />
          {!submitValid &&
            <Messages
              type="error"
              messageKey="submitInvalid"
              onDismiss={this.props.onErrorDismiss}
            />
          }
          {saveError &&
            <Messages
              type="error"
              messages={saveError.messages}
              onDismiss={this.props.onServerErrorDismiss}
            />
          }
          {(saveSending) &&
            <Loading />
          }
          <EntityForm
            model="entityNew.form.data"
            formData={viewDomain.form.data}
            inModal={inModal}
            saving={saveSending}
            handleSubmit={(formData) => this.props.handleSubmit(
              formData,
              attributes
            )}
            handleSubmitFail={this.props.handleSubmitFail}
            handleCancel={this.props.onCancel}
            scrollContainer={this.state.scrollContainer}
            fields={getEntityFields(
              path,
              {
                categories: {
                  taxonomy,
                  categoryParentOptions,
                  parentTaxonomy,
                },
                recommendations: {
                  frameworks: !fwSpecified ? frameworks : null,
                  hasResponse,
                },
              },
              this.context.intl,
            )}
          />
          {saveSending &&
            <Loading />
          }
        </Content>
      </div>
    );
  }
}

EntityNew.propTypes = {
  path: PropTypes.string.isRequired,
  attributes: PropTypes.object,
  taxonomy: PropTypes.object,
  parentTaxonomy: PropTypes.object,
  categoryParentOptions: PropTypes.object,
  handleSubmitRemote: PropTypes.func.isRequired,
  handleSubmitFail: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  inModal: PropTypes.bool,
  // onSaveSuccess: PropTypes.func,
  viewDomain: PropTypes.object,
  initialiseForm: PropTypes.func,
  onErrorDismiss: PropTypes.func.isRequired,
  onServerErrorDismiss: PropTypes.func.isRequired,
  frameworkId: PropTypes.string,
  frameworks: PropTypes.object,
};

EntityNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, { path, attributes }) => ({
  viewDomain: selectDomain(state),
  taxonomy: path === 'categories' && attributes && attributes.get('taxonomy_id')
    ? selectEntity(state, { path: 'taxonomies', id: attributes.get('taxonomy_id') })
    : null,
  categoryParentOptions: path === 'categories' && attributes && attributes.get('taxonomy_id')
    ? selectParentOptions(state, attributes.get('taxonomy_id'))
    : null,
  parentTaxonomy: path === 'categories' && attributes && attributes.get('taxonomy_id')
    ? selectParentTaxonomy(state, attributes.get('taxonomy_id'))
    : null,
  frameworkId: path === 'recommendations'
    ? selectFrameworkQuery(state)
    : null,
  frameworks: path === 'recommendations'
    ? selectFrameworksForQuery(state)
    : null,
});

function mapDispatchToProps(dispatch, props) {
  return {
    initialiseForm: (model, formData) => {
      dispatch(formActions.reset(model));
      dispatch(formActions.change(model, formData, { silent: true }));
    },
    onErrorDismiss: () => {
      dispatch(submitInvalid(true));
    },
    onServerErrorDismiss: () => {
      dispatch(saveErrorDismiss());
    },
    handleSubmitFail: () => {
      dispatch(submitInvalid(false));
    },
    handleSubmitRemote: (model) => {
      dispatch(formActions.submit(model));
    },
    handleSubmit: (formData, attributes) => {
      const saveData = attributes
        ? formData.mergeIn(['attributes'], attributes)
        : formData;

      dispatch(newEntity({
        entity: saveData.toJS(),
        path: props.path,
        onSuccess: props.onSaveSuccess,
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityNew);

/*
 *
 * EntityNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions as formActions } from 'react-redux-form/immutable';
import { Map, List } from 'immutable';

import { getEntityAttributeFields } from 'utils/forms';
import { qe } from 'utils/quasi-equals';
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
  selectActiveFrameworks,
} from 'containers/App/selectors';
import { selectParentOptions, selectParentTaxonomy } from 'containers/CategoryNew/selectors';


import { DEFAULT_FRAMEWORK } from 'themes/config';
import { CONTENT_MODAL } from 'containers/App/constants';
import appMessages from 'containers/App/messages';
import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

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
    this.scrollContainer = React.createRef();
  }

  UNSAFE_componentWillMount() {
    this.props.initialiseForm('entityNew.form.data', this.getInitialFormData());
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (hasNewError(nextProps, this.props) && this.scrollContainer) {
      scrollToTop(this.scrollContainer.current);
    }
    if (!this.props.frameworkId && nextProps.frameworkId) {
      this.props.initialiseForm('recommendationNew.form.data', this.getInitialFormData(nextProps));
    }
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { frameworkId } = props;
    return Map(FORM_INITIAL.setIn(
      ['attributes', 'framework_id'],
      (frameworkId && frameworkId !== 'all')
        ? frameworkId
        : DEFAULT_FRAMEWORK,
    ));
  }

  /* eslint-disable react/destructuring-assignment */
  getTaxTitle = (id) => this.context.intl.formatMessage(appMessages.entities.taxonomies[id].single);
  /* eslint-enable react/destructuring-assignment */

  render() {
    const { intl } = this.context;
    const {
      viewDomain,
      path,
      attributes,
      inModal,
      taxonomy,
      categoryParentOptions,
      parentTaxonomy,
      frameworks,
      framework,
      frameworkId,
    } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.get('page').toJS();

    let pageTitle;
    let hasResponse;
    let fwSpecified;
    let icon = path;
    if (path === 'categories' && taxonomy && taxonomy.get('attributes')) {
      pageTitle = intl.formatMessage(messages[path].pageTitleTaxonomy, {
        taxonomy: this.getTaxTitle(taxonomy.get('id')),
      });
    } else if (path === 'recommendations') {
      // figure out framework id from form if not set
      const currentFrameworkId = (framework && framework.get('id'))
        || frameworkId
        || viewDomain.getIn(['form', 'data', 'attributes', 'framework_id'])
        || DEFAULT_FRAMEWORK;
      // check if single framework set
      fwSpecified = (currentFrameworkId && currentFrameworkId !== 'all');
      // get current framework
      const currentFramework = framework
        || (
          fwSpecified
          && frameworks
          && frameworks.find((fw) => qe(fw.get('id'), currentFrameworkId))
        );
      // check if response is required
      hasResponse = currentFramework && currentFramework.getIn(['attributes', 'has_response']);
      // figure out title and icon
      pageTitle = intl.formatMessage(
        messages[path].pageTitle,
        {
          type: intl.formatMessage(
            appMessages.entities[fwSpecified ? `${path}_${currentFrameworkId}` : path].single
          ),
        }
      );
      icon = fwSpecified ? `${path}_${currentFrameworkId}` : path;
    } else {
      pageTitle = intl.formatMessage(messages[path].pageTitle);
    }

    return (
      <div>
        <Content
          ref={this.scrollContainer}
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
          {!submitValid
            && (
              <Messages
                type="error"
                messageKey="submitInvalid"
                onDismiss={this.props.onErrorDismiss}
              />
            )
          }
          {saveError
            && (
              <Messages
                type="error"
                messages={saveError.messages}
                onDismiss={this.props.onServerErrorDismiss}
              />
            )
          }
          {(saveSending)
            && <Loading />
          }
          <EntityForm
            model="entityNew.form.data"
            formData={viewDomain.getIn(['form', 'data'])}
            inModal={inModal}
            saving={saveSending}
            handleSubmit={(formData) => this.props.handleSubmit(
              formData,
              attributes
            )}
            handleSubmitFail={this.props.handleSubmitFail}
            handleCancel={this.props.onCancel}
            scrollContainer={this.scrollContainer.current}
            fields={getEntityAttributeFields(
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
              intl,
            )}
          />
          {saveSending
            && <Loading />
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
  framework: PropTypes.object,
  frameworks: PropTypes.object,
  frameworkId: PropTypes.string,
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
    ? selectActiveFrameworks(state)
    : null,
  framework: path === 'recommendations' && attributes && attributes.get('framework_id')
    ? selectEntity(state, { path: 'frameworks', id: attributes.get('framework_id') })
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
      let saveData = attributes
        ? formData.mergeIn(['attributes'], attributes)
        : formData;

      // saveData = saveData.setIn(['attributes', 'taxonomy_id'], taxonomy.get('id'));

      if (props.path === 'categories') {
        const formCategoryIds = formData.get('associatedCategory')
          && getCheckedValuesFromOptions(formData.get('associatedCategory'));
        if (List.isList(formCategoryIds) && formCategoryIds.size) {
          saveData = saveData.setIn(['attributes', 'parent_id'], formCategoryIds.first());
        } else {
          saveData = saveData.setIn(['attributes', 'parent_id'], null);
        }
      }

      dispatch(newEntity({
        entity: saveData.toJS(),
        path: props.path,
        onSuccess: props.onSaveSuccess,
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityNew);

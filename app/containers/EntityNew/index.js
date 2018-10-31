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

import { scrollToTop } from 'utils/scroll-to-component';
import { hasNewError } from 'utils/entity-form';

import {
  newEntity,
  submitInvalid,
  saveErrorDismiss,
} from 'containers/App/actions';

import { selectEntity } from 'containers/App/selectors';

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
    const { viewDomain, path, attributes, inModal, taxonomy } = this.props;
    const { saveSending, saveError, submitValid } = viewDomain.page;

    let pageTitle = this.context.intl.formatMessage(messages[path].pageTitle);
    if (taxonomy && taxonomy.get('attributes')) {
      pageTitle = this.context.intl.formatMessage(messages[path].pageTitleTaxonomy, {
        taxonomy: this.getTaxTitle(taxonomy.get('id')),
      });
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
            icon={path}
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
            fields={getEntityFields(path, { taxonomy }, this.context.intl, appMessages)}
            scrollContainer={this.state.scrollContainer}
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
};

EntityNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  viewDomain: selectDomain(state),
  taxonomy: props.attributes && props.attributes.get('taxonomy_id')
    ? selectEntity(state, { path: 'taxonomies', id: props.attributes.get('taxonomy_id') })
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

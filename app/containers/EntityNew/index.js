/*
 *
 * EntityNew
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getEntityFields } from 'utils/forms';

import { newEntity } from 'containers/App/actions';
import { CONTENT_MODAL } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import Content from 'components/Content';
import Loading from 'components/Loading';
import ContentHeader from 'components/ContentHeader';
import EntityForm from 'components/forms/EntityForm';

import { selectDomain } from './selectors';

import messages from './messages';

export class EntityNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { viewDomain, path, attributes, inModal } = this.props;
    const { saveSending, saveError } = viewDomain.page;

    return (
      <div>
        <Content hasPaddingBottom={!inModal}>
          <ContentHeader
            title={this.context.intl.formatMessage(messages[path].pageTitle)}
            type={CONTENT_MODAL}
            icon="measures"
            buttons={[{
              type: 'cancel',
              onClick: this.props.onCancel,
            },
            {
              type: 'save',
              onClick: () => this.props.handleSubmit(
                viewDomain.form.data,
                attributes
              ),
            }]}
          />
          {saveSending &&
            <Loading />
          }
          {saveError &&
            <p>{saveError}</p>
          }
          <EntityForm
            model="entityNew.form.data"
            formData={viewDomain.form.data}
            inModal={inModal}
            handleSubmit={(formData) => this.props.handleSubmit(
              formData,
              attributes
            )}
            handleCancel={this.props.onCancel}
            fields={getEntityFields(path, null, this.context.intl.formatMessage, appMessages)}
          />
        </Content>
      </div>
    );
  }
}

EntityNew.propTypes = {
  path: PropTypes.string.isRequired,
  attributes: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  inModal: PropTypes.bool,
  // onSaveSuccess: PropTypes.func,
  viewDomain: PropTypes.object,
};

EntityNew.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  viewDomain: selectDomain(state),
});

function mapDispatchToProps(dispatch, props) {
  return {
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

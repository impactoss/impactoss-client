/*
 *
 * ActionEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Control, Form } from 'react-redux-form/immutable';
import { ACTION_STATUSES } from 'containers/App/constants';

import { actionSelector, pageSelector } from './selectors';
import messages from './messages';
import { save, getEntitiesAndActionById } from './actions';

export class ActionEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.onComponentWillMount(this.props.params.id);
  }
  render() {
    const { draft } = this.props.action;
    const { saveSending, saveError } = this.props.page;
    return (
      <div>
        <Helmet
          title="ActionEdit"
          meta={[
            { name: 'description', content: 'Description of ActionEdit' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <Form
          model="actionEdit.form.action"
          onSubmit={this.props.handleSubmit}
        >
          <label htmlFor="title">Title:</label>
          <Control.text id="title" model=".title" />
          <label htmlFor="description">Description:</label>
          <Control.textarea id="description" model=".description" />
          <label htmlFor="status">Status:</label>
          <Control.select id="status" model=".draft" value={draft}>
            {ACTION_STATUSES.map((status) =>
              <option key={status.value} value={status.value}>{status.label}</option>
            )}
          </Control.select>
          <button type="submit">Save</button>
        </Form>
        {saveSending &&
          <p>Saving</p>
        }
        {saveError &&
          <p>{saveError}</p>
        }
      </div>
    );
  }
}

ActionEdit.propTypes = {
  onComponentWillMount: PropTypes.func,
  params: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  action: PropTypes.object,
  page: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  action: actionSelector,
  page: pageSelector,
});

function mapDispatchToProps(dispatch) {
  return {
    onComponentWillMount: (id) => {
      dispatch(getEntitiesAndActionById('actions', id));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionEdit);

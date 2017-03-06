/*
 *
 * ActionNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Control, Form } from 'react-redux-form/immutable';
import { PUBLISH_STATUSES } from 'containers/App/constants';
import { createStructuredSelector } from 'reselect';
import makeSelectActionNew from './selectors';
import messages from './messages';
import { save } from './actions';

export class ActionNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { saveSending, saveError } = this.props.ActionNew.page;
    return (
      <div>
        <Helmet
          title="ActionNew"
          meta={[
            { name: 'description', content: 'Description of ActionNew' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <Form
          model="actionNew.form.action"
          onSubmit={this.props.handleSubmit}
        >
          <label htmlFor="title">Title:</label>
          <Control.text id="title" model=".title" />
          <label htmlFor="description">Description:</label>
          <Control.textarea id="description" model=".description" />
          <label htmlFor="status">Status:</label>
          <Control.select id="status" model=".draft">
            {PUBLISH_STATUSES.map((status) =>
              <option key={status.value} value={status.value}>{status.label}</option>
            )}
          </Control.select>
          <button type="submit">Save</button>
        </Form>
        {saveSending &&
          <p>Saving Action</p>
        }
        {saveError &&
          <p>{saveError}</p>
        }

      </div>
    );
  }
}

ActionNew.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  ActionNew: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  ActionNew: makeSelectActionNew(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    handleSubmit: (formData) => {
      dispatch(save(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionNew);

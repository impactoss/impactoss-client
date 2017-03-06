/*
 *
 * ActionEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Control, Form, actions as formActions } from 'react-redux-form/immutable';
// import { actions as formActions } from 'react-redux-form';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import {
  makeEntityMapSelector,
  makeEntitiesReadySelector,
} from 'containers/App/selectors';

import {
  pageSelector,
} from './selectors';

import messages from './messages';
import { save } from './actions';

const populateForm = (action) =>
  formActions.load('actionEdit.form.action', action.get('attributes'));

export class ActionEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(loadEntitiesIfNeeded('actions'));

    if (this.props.action && this.props.actionsReady) {
      dispatch(populateForm(this.props.action));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;

    if (nextProps.action && nextProps.actionsReady && !this.props.actionsReady) {
      dispatch(populateForm(nextProps.action));
    }
  }


  render() {
    const { action, actionsReady } = this.props;
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
        { !action && !actionsReady &&
          <div>
            <FormattedMessage {...messages.loading} />
          </div>
        }
        { !action && actionsReady &&
          <div>
            <FormattedMessage {...messages.notFound} />
          </div>
        }
        {action &&
          <Form
            model="actionEdit.form.action"
            onSubmit={this.props.handleSubmit}
          >
            <label htmlFor="title">Title:</label>
            <Control.text id="title" model=".title" />
            <label htmlFor="description">Description:</label>
            <Control.textarea id="description" model=".description" />
            <label htmlFor="status">Status:</label>
            <Control.select id="status" model=".draft" value={action && action.draft}>
              {PUBLISH_STATUSES.map((status) =>
                <option key={status.value} value={status.value}>{status.label}</option>
              )}
            </Control.select>
            <button type="submit">Save</button>
            </Form>
          }
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
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  page: PropTypes.object,
  action: PropTypes.object,
  actionsReady: PropTypes.bool,
};

const makeMapStateToProps = () => {
  const getEntity = makeEntityMapSelector();
  const entitiesReady = makeEntitiesReadySelector();
  const mapStateToProps = (state, props) => ({
    action: getEntity(state, { id: props.params.id, path: 'actions' }),
    actionsReady: entitiesReady(state, { path: 'actions' }),
    page: pageSelector(state),
  });
  return mapStateToProps;
};

function mapDispatchToProps(dispatch, props) {
  return {
    dispatch,
    onComponentWillMount: () => {
      dispatch(loadEntitiesIfNeeded('actions'));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData, props.params.id));
    },
  };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ActionEdit);

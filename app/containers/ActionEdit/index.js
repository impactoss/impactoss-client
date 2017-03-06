/*
 *
 * ActionEdit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { actions as formActions } from 'react-redux-form/immutable';
// import { actions as formActions } from 'react-redux-form';
import { PUBLISH_STATUSES } from 'containers/App/constants';

import { loadEntitiesIfNeeded } from 'containers/App/actions';

import EntityForm from 'components/EntityForm';

import {
  makeEntityMapSelector,
  makeEntitiesReadySelector,
} from 'containers/App/selectors';

import {
  pageSelector,
} from './selectors';

import messages from './messages';
import { save } from './actions';

export class ActionEdit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadEntitiesIfNeeded();

    if (this.props.action && this.props.actionsReady) {
      this.props.populateForm('actionEdit.form.action', this.props.action.get('attributes'));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action && nextProps.actionsReady && !this.props.actionsReady) {
      this.props.populateForm('actionEdit.form.action', nextProps.action.get('attributes'));
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
          <EntityForm
            model="actionEdit.form.action"
            handleSubmit={this.props.handleSubmit}
            fields={
              [
                {
                  id: 'title',
                  label: 'Title',
                  type: 'text',
                  model: '.title',
                },
                {
                  id: 'description',
                  label: 'Description: ',
                  type: 'textarea',
                  model: '.description',
                },
                {
                  id: 'status',
                  label: 'Status: ',
                  type: 'select',
                  model: '.draft',
                  value: action && action.draft,
                  options: PUBLISH_STATUSES,
                },
              ]
            }
          />
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
  loadEntitiesIfNeeded: PropTypes.func,
  populateForm: PropTypes.func,
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
    loadEntitiesIfNeeded: () => {
      dispatch(loadEntitiesIfNeeded('actions'));
    },
    populateForm: (model, data) => {
      dispatch(formActions.load(model, data));
    },
    handleSubmit: (formData) => {
      dispatch(save(formData, props.params.id));
    },
  };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(ActionEdit);

/*
 *
 * ActionNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { PUBLISH_STATUSES } from 'containers/App/constants';
import { createStructuredSelector } from 'reselect';

import EntityForm from 'components/EntityForm';

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
        <EntityForm
          model="actionNew.form.action"
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
                options: PUBLISH_STATUSES,
              },
            ]
          }
        />
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

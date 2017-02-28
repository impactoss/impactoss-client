/*
 *
 * RecommendationNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Control, Form } from 'react-redux-form/immutable';
import { RECOMMENDATION_STATUSES } from 'containers/App/constants';
import makeSelectRecommendationNew from './selectors';
import messages from './messages';
import { save } from './actions';

export class RecommendationNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { saveSending, saveError } = this.props.RecommendationNew.page;
    return (
      <div>
        <Helmet
          title="RecommendationNew"
          meta={[
            { name: 'description', content: 'Description of RecommendationNew' },
          ]}
        />
        <FormattedMessage {...messages.header} />
        <Form
          model="recommendationNew.form.recommendation"
          onSubmit={this.props.handleSubmit}
        >
          <label htmlFor="title">Title:</label>
          <Control.text id="title" model=".title" />
          <label htmlFor="number">Number:</label>
          <Control.textarea id="number" model=".number" />
          <label htmlFor="status">Status:</label>
          <Control.select id="status" model=".draft" dynamic={false}>
            {RECOMMENDATION_STATUSES.map((status) =>
              <option key={status.value} value={status.value}>{status.label}</option>
            )}
          </Control.select>
          <button type="submit">Save</button>
        </Form>
        {saveSending &&
          <p>Saving Recommendation</p>
        }
        {saveError &&
          <p>{saveError}</p>
        }
      </div>
    );
  }
}

RecommendationNew.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  RecommendationNew: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  RecommendationNew: makeSelectRecommendationNew(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleSubmit: (formData) => {
      dispatch(save(formData));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationNew);

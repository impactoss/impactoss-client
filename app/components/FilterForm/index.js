import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Form, actions as formActions } from 'react-redux-form/immutable';
import MultiSelect from 'components/MultiSelect';

// TODO as this now connects to redux in order to populate the form maybe it should live in `containers`
class FilterForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    model: PropTypes.string.isRequired,
    options: PropTypes.instanceOf(Immutable.List),
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    title: PropTypes.string,
    populateForm: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.URLParams = new URLSearchParams(browserHistory.getCurrentLocation().search);
  }

  componentWillMount() {
    this.props.populateForm(this.props.model, this.props.options, this.URLParams);
  }

  render() {
    return (
      <Form
        model={this.props.model}
        onSubmit={this.props.handleSubmit}
      >
        { this.props.title &&
          <strong>{this.props.title}</strong>
        }
        { this.props.onClose &&
          <button onClick={this.props.onClose}>close</button>
        }
        <MultiSelect
          model=".values"
          options={this.props.options}
          valueCompare={(value, option) =>
            // our values, are maps with nested value keys :)
            value.get('value') === option.get('value')
          }
        />
      </Form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  populateForm: (model, options, URLParams) => {
    // Filter each option, keep the values of those in the URL
    const urlValues = options
    .filter((option) => {
      const query = option.getIn(['value', 'query']);
      const value = option.getIn(['value', 'value']);
      return URLParams.has(query) && URLParams.getAll(query).indexOf(value.toString()) >= 0;
    })
    .map((option) => option.get('value'));

    if (urlValues.size > 0) {
      dispatch(formActions.load(model, Immutable.Map({ values: urlValues })));
    }
  },
});

export default connect(null, mapDispatchToProps)(FilterForm);

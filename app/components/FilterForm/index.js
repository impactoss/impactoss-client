import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Form, actions as formActions } from 'react-redux-form/immutable';
import MultiSelect from 'components/MultiSelect';

class FilterForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    model: PropTypes.string.isRequired,
    options: PropTypes.instanceOf(Immutable.List),
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    title: PropTypes.string,
    populateForm: PropTypes.func.isRequired,
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
        />
      </Form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  populateForm: (model, options) => {
    dispatch(formActions.load(model, Immutable.Map({ values: options.map((option) => option.get('value')) })));
  },
});

export default connect(null, mapDispatchToProps)(FilterForm);

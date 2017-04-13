import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { isEqual } from 'lodash/lang';
import { Form, actions as formActions } from 'react-redux-form/immutable';
import MultiSelect from 'components/MultiSelect';
// import { STATES as CHECKBOX_STATES } from 'components/IndeterminateCheckbox';

class EditForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    model: PropTypes.string.isRequired,
    options: PropTypes.instanceOf(Immutable.List),
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
    title: PropTypes.string,
    populateForm: PropTypes.func.isRequired,
    // resetForm: PropTypes.func.isRequired,
    submitLabel: PropTypes.string,
  }

  static defaultProps = {
    submitLabel: 'Update',
  }

  componentWillMount() {
    this.props.populateForm(this.props.model, this.props.options);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', nextProps)
     // Todo this is not efficent, parent component is creating a new map every time so we can't hashCode compare :(
    if (!isEqual(nextProps.options.toJS(), this.props.options.toJS())) {
      this.props.populateForm(nextProps.model, nextProps.options);
    }
  }

  render() {
    return (
      <Form
        model={this.props.model}
        onSubmit={this.props.onSubmit}
      >
        { this.props.title &&
          <strong>{this.props.title}</strong>
        }
        { this.props.onClose &&
          <button onClick={this.props.onClose}>close</button>
        }
        <MultiSelect
          model=".values"
          threeState
          options={this.props.options}
        />
        {this.props.onSubmit &&
          <button type="submit">{this.props.submitLabel}</button>
        }
      </Form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  resetForm: (model) => {
    dispatch(formActions.reset(model));
  },
  populateForm: (model, options) => {
    dispatch(formActions.load(model, Immutable.Map({
      values: options.map((option) => option.get('value')),
    })));
  },
});

export default connect(null, mapDispatchToProps)(EditForm);

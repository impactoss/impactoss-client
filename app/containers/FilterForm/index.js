import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { isEqual } from 'lodash/lang';
import { Form, actions as formActions } from 'react-redux-form/immutable';
import MultiSelectControl from 'components/forms/MultiSelectControl';

class FilterForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    model: PropTypes.string.isRequired,
    options: PropTypes.instanceOf(Immutable.List),
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    title: PropTypes.string,
    populateForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func,
  }

  componentWillMount() {
    // console.log('componentWillMount', this.props.options && this.props.options.toJS())
    this.props.populateForm(this.props.model, this.props.options);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', nextProps.options && nextProps.options.toJS())
    // console.log('componentWillReceiveProps', this.props.options && this.props.options.toJS())
    //  // Todo this is not efficent, parent component is creating a new map every time so we can't hashCode compare :(
    if (!isEqual(nextProps.options.toJS(), this.props.options.toJS())) {
      this.props.populateForm(nextProps.model, nextProps.options);
    }
  }
  onClose = () => {
    // console.log('onclose')
    this.props.resetForm(this.props.model);
    this.props.onClose();
  }
  render = () => (
    <Form
      model={this.props.model}
      onSubmit={this.props.handleSubmit}
    >
      { this.props.title &&
        <strong>{this.props.title}</strong>
      }
      <MultiSelectControl
        model=".values"
        options={this.props.options}
      />
      { this.props.onClose &&
        <button onClick={this.onClose}>close</button>
      }
    </Form>
  )
}

const mapDispatchToProps = (dispatch) => ({
  resetForm: (model) => {
    dispatch(formActions.reset(model));
  },
  populateForm: (model, options) => {
    // console.log('populateForm', model, options.toJS());
    dispatch(formActions.load(model, Immutable.Map({ values: options.map((option) => option.get('value')) })));
  },
});

export default connect(null, mapDispatchToProps)(FilterForm);

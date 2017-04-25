import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import { isEqual } from 'lodash/lang';
import { Form, actions as formActions } from 'react-redux-form/immutable';
import MultiSelectControl from 'components/forms/MultiSelectControl';

class EntityListFilterForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    model: PropTypes.string.isRequired,
    options: PropTypes.instanceOf(List),
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    title: PropTypes.string,
    populateForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func,
  }

  componentWillMount() {
    this.props.populateForm(this.props.model, this.getInitialFormData());
  }

  componentWillReceiveProps(nextProps) {
    // Todo this is not efficent, parent component is creating a new map every time so we can't hashCode compare :(
    if (!isEqual(nextProps.options.toJS(), this.props.options.toJS())) {
      this.props.populateForm(nextProps.model, this.getInitialFormData(nextProps));
    }
  }

  onClose = () => {
    this.props.resetForm(this.props.model);
    this.props.onClose();
  }

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { options } = props;
    return options;
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
    dispatch(formActions.load(model, Map({ values: options })));
  },
});

export default connect(null, mapDispatchToProps)(EntityListFilterForm);

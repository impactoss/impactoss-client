import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import { isEqual } from 'lodash/lang';
import { Form, actions as formActions } from 'react-redux-form/immutable';
import styled from 'styled-components';

import MultiSelectControl from 'components/forms/MultiSelectControl';

const FormWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 100%;
  min-width: 350px;
  background: #fff;
  overflow: hidden;
`;

class EntityListForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    model: PropTypes.string.isRequired,
    options: PropTypes.instanceOf(List),
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    title: PropTypes.string,
    populateForm: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    filter: PropTypes.bool,
    buttons: PropTypes.array,
  }

  static defaultProps = {
    multiple: true,
    required: false,
    filter: true,
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

  getInitialFormData = (nextProps) => {
    const props = nextProps || this.props;
    const { options } = props;
    return options;
  }

  render() {
    return (
      <FormWrapper>
        <Form
          model={this.props.model}
          onSubmit={this.props.onSubmit}
        >
          <MultiSelectControl
            model=".values"
            threeState
            multiple={this.props.multiple}
            required={this.props.required}
            options={this.props.options}
            title={this.props.title}
            onCancel={this.props.onCancel}
            buttons={this.props.buttons}
            filter={this.props.filter}
          />
        </Form>
      </FormWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  // resetForm: (model) => {
  //   dispatch(formActions.reset(model));
  // },
  populateForm: (model, options) => {
    dispatch(formActions.load(model, Map({ values: options })));
  },
});

export default connect(null, mapDispatchToProps)(EntityListForm);

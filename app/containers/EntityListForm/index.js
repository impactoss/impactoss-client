import React, { PropTypes } from 'react';
import { Map, fromJS } from 'immutable';
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
    populateForm: PropTypes.func.isRequired,
    model: PropTypes.string.isRequired,
    formOptions: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    buttons: PropTypes.array,
  }

  componentWillMount() {
    this.props.populateForm(this.props.model, this.props.formOptions.options);
  }

  componentWillReceiveProps(nextProps) {
     // Todo this is not efficent, parent component is creating a new map every time so we can't hashCode compare :(
    if (!isEqual(nextProps.formOptions.options, this.props.formOptions.options)) {
      this.props.populateForm(nextProps.model, nextProps.formOptions.options);
    }
  }

  render() {
    const { model, onSubmit, onCancel, buttons, formOptions } = this.props;

    return (
      <FormWrapper>
        <Form
          model={model}
          onSubmit={onSubmit}
        >
          <MultiSelectControl
            model=".values"
            threeState
            title={formOptions.title}
            options={fromJS(formOptions.options).toList()}
            multiple={formOptions.multiple}
            required={formOptions.required}
            filter={formOptions.filter}
            onCancel={onCancel}
            buttons={buttons}
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
    dispatch(formActions.load(model, Map({ values: fromJS(options).toList() })));
  },
});

export default connect(null, mapDispatchToProps)(EntityListForm);

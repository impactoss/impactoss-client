import React from 'react';
import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { isEqual } from 'lodash/lang';
import { Form, actions as formActions } from 'react-redux-form/immutable';
import styled from 'styled-components';

import MultiSelectControl from 'components/forms/MultiSelectControl';
import {
  FILTER_FORM_MODEL,
} from './constants';
import {
  setFilter,
} from './actions';

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
            search={formOptions.search}
            onCancel={onCancel}
            onChange={(values) => {
              this.props.onFormChange(values, model);
              this.props.onSelect();
            }}
            buttons={buttons}
          />
        </Form>
      </FormWrapper>
    );
  }
}

EntityListForm.propTypes = {
  populateForm: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
  model: PropTypes.string.isRequired,
  formOptions: PropTypes.object,
  onSubmit: PropTypes.func,
  onSelect: PropTypes.func,
  onCancel: PropTypes.func,
  buttons: PropTypes.array,
};

const mapDispatchToProps = (dispatch) => ({
  // resetForm: (model) => {
  //   dispatch(formActions.reset(model));
  // },
  populateForm: (model, options) => {
    dispatch(formActions.load(model, Map({ values: fromJS(options).toList() })));
  },
  onFormChange: (values, model) => {
    if (model === FILTER_FORM_MODEL) {
      dispatch(setFilter(values));
    }
  },
});

export default connect(null, mapDispatchToProps)(EntityListForm);

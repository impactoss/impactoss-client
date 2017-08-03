import React from 'react';
import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { isEqual } from 'lodash/lang';
import { Form, actions as formActions } from 'react-redux-form/immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

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
  min-width: ${(props) => props.wide ? 700 : 350}px;
  background: ${palette('primary', 4)};
  overflow: hidden;
  border-left: 1px solid ${palette('light', 2)};
  border-right: 1px solid ${palette('light', 2)};
  border-bottom: 1px solid ${palette('light', 2)};
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  z-index:-1;
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
      <FormWrapper wide={formOptions.advanced}>
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
            advanced={formOptions.advanced}
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

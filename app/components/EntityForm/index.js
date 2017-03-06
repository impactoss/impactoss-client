import React, { PropTypes } from 'react';
import { Control, Form } from 'react-redux-form/immutable';

class EntityForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Form
        model={this.props.model}
        onSubmit={this.props.handleSubmit}
      >
        {
          this.props.fields.map((el, index) => (
            <span key={index}>
              <label htmlFor={el.id}>{el.label}</label>
              { el.type === 'text' &&
                <Control.text id={el.id} model={el.model} />
              }
              { el.type === 'textarea' &&
                <Control.textarea id={el.id} model={el.model} />
              }
              { el.type === 'select' &&
                <Control.select id={el.id} model={el.model}>
                  {
                    el.options.map((option, i) =>
                      <option key={i} value={option.value}>{option.label}</option>
                    )
                  }
                </Control.select>
              }
            </span>
          ))
        }
        <button type="submit">Save</button>
      </Form>
    );
  }
}

EntityForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  model: PropTypes.string,
  fields: PropTypes.array,
};

export default EntityForm;

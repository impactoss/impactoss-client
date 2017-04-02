import React, { PropTypes } from 'react';
import { Form } from 'react-redux-form/immutable';
import MultiSelect from 'components/MultiSelect';

export default class FilterForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    model: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
  }

  render() {
    return (
      <Form
        model={this.props.model}
        onSubmit={this.props.handleSubmit}
      >
        <MultiSelect
          model=".values"
          options={this.props.options}
          valueCompare={(a, b) =>
            // our values, are maps with nested value keys :)
            a.get('value') === b.get('value')
          }
        />
      </Form>
    );
  }
}

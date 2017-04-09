import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Form } from 'react-redux-form/immutable';
import MultiSelect from 'components/MultiSelect';

export default class EditForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    model: PropTypes.string.isRequired,
    options: PropTypes.instanceOf(Immutable.List),
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    title: PropTypes.string,
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
          valueCompare={(a, b) =>
            // our values, are maps with nested value keys :)
            a.get('value') === b.get('value')
          }
        />
      </Form>
    );
  }
}

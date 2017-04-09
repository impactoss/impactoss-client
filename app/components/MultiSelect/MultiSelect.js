import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { kebabCase } from 'lodash/string';
import IndeterminateCheckbox from 'components/IndeterminateCheckbox';

export default class MultiSelect extends React.Component {

  static propTypes = {
    options: PropTypes.instanceOf(Immutable.List),
    values: PropTypes.instanceOf(Immutable.List),
    onChange: PropTypes.func.isRequired,
    valueCompare: PropTypes.func,
    threeState: PropTypes.bool,
  }

  static defaultProps = {
    values: new Immutable.List(),
    valueCompare: (a, b) => a.get('value') === b.get('value'),
    threeState: false,
  }

  check = (checked, theValue) => {
    const nextValues = this.props.values.map((value) => this.props.valueCompare(value, theValue) ? value.set('checked', checked) : value);
    this.props.onChange(nextValues);// sent back to rrf
  }

  renderCheckbox = (option, i) => {
    const value = option.get('value');
    const checked = value.get('checked');
    const label = option.get('label');
    const id = `${checked}-${i}-${kebabCase(label)}`;
    return (
      <div key={id}>
        { this.props.threeState &&
          <IndeterminateCheckbox
            onChange={(status) => {
              this.check(status, value);
            }}
            value={value.get('label')}
            checked={checked}
            id={id}
          />
        }
        { !this.props.threeState &&
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(evt) => {
              if (evt && evt !== undefined) evt.stopPropagation();
              this.check(evt.target.checked, value);
            }}
          />
        }
        <label htmlFor={id} >
          {label}
        </label>
      </div>
    );
  }

  render() {
    const { options, values, valueCompare } = this.props;
    const checkboxes = options.map((option) => {
      const value = values.find((v) => valueCompare(option.get('value'), v));
      return value ? option.setIn(['value', 'checked'], value.get('checked')) : option;
    });

    return (
      <div>
        {checkboxes && checkboxes.filter((option) => option.get('checked')).map(this.renderCheckbox)}
        {checkboxes && checkboxes.filterNot((option) => option.get('checked')).map(this.renderCheckbox)}
      </div>
    );
  }
}

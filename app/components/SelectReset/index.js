/*
 *
 * EntityListGroup
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash/collection';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonSimple from 'components/buttons/ButtonSimple';
import Icon from 'components/Icon';

const Label = styled.label`
  color: ${palette('dark', 3)};
  padding: 0 0.5em 0 0;
`;
const Select = styled.select`
  font-weight: ${(props) => props.active ? 'bold' : 'normal'};
`;
// border-bottom: 1px dotted #ccc;
const Option = styled.option`
  color: ${(props) => props.active && (!props.isPlaceholder) ? palette('primary', 4) : palette('dark', 2)};
  background-color: ${(props) => props.active && (!props.isPlaceholder) ? palette('primary', 1) : palette('primary', 4)};
`;
// color: ${palette('primary', 1)};
const Reset = styled(ButtonSimple)`
  padding: 0 0.5em;
  &:hover {
    color: ${palette('primary', 1)};
  }
  margin-right: 20px;
  font-weight: bold;
`;

export class SelectReset extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { onChange, value, emptyValue, label, options, isReset, index } = this.props;
    const optionActive = find(options, (option) => option.value === value);

    return (
      <span>
        {label &&
          <Label htmlFor={index}>{ label }</Label>
        }
        { (!isReset || optionActive.value === emptyValue) &&
          <Select
            id={index}
            onChange={(event) => onChange(event.target.value)}
            value={value}
            active={false}
          >
            { options.map((option, i) => (
              <Option
                key={i}
                value={option.value}
                isPlaceholder={option.value === emptyValue}
                default={option.default}
                active={option.value === value}
              >
                {option.label}
              </Option>
            ))}
          </Select>
        }
        { isReset && optionActive.value !== emptyValue &&
          <Reset onClick={() => onChange(emptyValue)}>
            {optionActive.label}
            <Icon name="removeSmall" text textRight />
          </Reset>
        }
      </span>
    );
  }
}

SelectReset.propTypes = {
  value: PropTypes.string,
  emptyValue: PropTypes.string,
  label: PropTypes.string,
  index: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  isReset: PropTypes.bool,
};

SelectReset.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default SelectReset;

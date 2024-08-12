import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';

const StyledWrapper = styled.span``;

const Option = styled.div`
  padding: 0.25em 0;
`;
const Hint = styled.div`
  font-size: 0.85em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;
// see also ScheduleItem
const Label = styled.label`
  font-weight: bold;
  color:  ${(props) => props.highlight ? palette('primary', 1) : palette('text', 0)};
`;
const LabelInner = styled.span`
  padding-left: 5px;
`;
const Input = styled.input`
`;
export class RadioControl extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { options, hints, onChange, name, value } = this.props;
    return (
      <StyledWrapper>
        {
          options && options.map((option, i) => (
            <Option key={i}>
              <Label highlight={option.highlight}>
                <Input
                  type='radio'
                  name={name}
                  value={option.value}
                  checked={option.value === value}
                  onChange={onChange}
                />
                <LabelInner>{option.label}</LabelInner>
              </Label>
            </Option>
          ))}
        { hints && options.length === 0
          && (
            <Hint>
              {hints[0]}
            </Hint>
          )
        }
        { hints && options.length === 1
          && (
            <Hint>
              {hints[1]}
            </Hint>
          )
        }
      </StyledWrapper>
    );
  }
}

RadioControl.propTypes = {
  options: PropTypes.array.isRequired,
  hints: PropTypes.object,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string,
};

export default RadioControl;
/*
 *
 * SelectReset
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash/collection';
import { injectIntl } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import ScreenReaderOnly from 'components/styled/ScreenReaderOnly';
import ScreenReaderHide from 'components/styled/ScreenReaderHide';
import ButtonSimple from 'components/buttons/ButtonSimple';
import Icon from 'components/Icon';

import messages from './messages';

const Label = styled.label`
  color: ${palette('text', 1)};
  padding: 0 0.5em 0 0;
  vertical-align: middle;
  display: inline-block;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;
const Styled = styled.span`;
  @media print {
    display: ${({ hidePrint }) => (hidePrint ? 'none' : 'inline')};
  }
`;
const Select = styled.select`
  font-weight: ${(props) => props.active ? 500 : 'normal'};
  vertical-align: middle;
  display: inline-block;
  cursor: pointer;
  &:focus-visible {
    border-radius: 2px;
    outline: 2px solid ${palette('linkHover', 2)};
  }
  @media print {
    appearance: none;
    text-overflow: '';
    text-indent: 0.01px; /* Removes default arrow from firefox */
    text-overflow: "";  /* Removes default arrow from firefox */
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;
// border-bottom: 1px dotted #ccc;
const Option = styled.option`
  color: ${(props) => props.active && (!props.isPlaceholder) ? palette('text', 2) : palette('text', 0)};
  background-color: ${(props) => props.active && (!props.isPlaceholder) ? palette('primary', 1) : palette('background', 0)};
`;
const Reset = styled(ButtonSimple)`
  vertical-align: middle;
  color: ${palette('link', 2)};
  margin-right: 20px;
  font-weight: 500;

  &:hover, &:focus-visible {
    color: ${palette('linkHover', 2)};
  }
  &:focus-visible {
    border-radius: 2px;
    outline: 2px solid ${palette('linkHover', 2)};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;

export class SelectReset extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      onChange,
      value,
      emptyValue,
      label,
      options,
      isReset,
      index,
      hidePrint,
      labelScreenreaderOnly,
      intl,
    } = this.props;
    const optionActive = find(options, (option) => option.value === value);
    return (
      <Styled hidePrint={hidePrint}>
        {(label || labelScreenreaderOnly) && (
          <Label htmlFor={index}>
            {label || ''}
            {labelScreenreaderOnly && (
              <ScreenReaderOnly>{labelScreenreaderOnly}</ScreenReaderOnly>
            )}
          </Label>
        )}
        {(!isReset || optionActive.value === emptyValue) && (
          <Select
            id={index}
            onChange={(event) => onChange(event.target.value)}
            value={value}
            active={false}
          >
            {options.map((option, i) => (
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
        )}
        {isReset && optionActive.value !== emptyValue && (
          <Reset
            id={index}
            onClick={() => onChange(emptyValue)}
            title={intl.formatMessage(messages.resetTitle, { label: optionActive.label })}
          >
            <ScreenReaderHide>
              {optionActive.label}
            </ScreenReaderHide>
            <Icon name="removeSmall" text textRight hidePrint />
          </Reset>
        )}
      </Styled>
    );
  }
}

SelectReset.propTypes = {
  value: PropTypes.string,
  emptyValue: PropTypes.string,
  label: PropTypes.string,
  labelScreenreaderOnly: PropTypes.string,
  index: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  isReset: PropTypes.bool,
  hidePrint: PropTypes.bool,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(SelectReset);

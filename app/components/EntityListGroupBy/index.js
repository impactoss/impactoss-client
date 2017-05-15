/*
 *
 * EntityListGroup
 *
 */
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonSimple from 'components/buttons/ButtonSimple';
import Icon from 'components/Icon';

import messages from './messages';

const Styled = styled.div`
  display: inline-block;
`;
const Label = styled.label`
  color: ${palette('greyscaleDark', 3)};
  padding: 0 0.5em 0 0;
`;
const Select = styled.select`
  font-weight: ${(props) => props.active ? 'bold' : 'normal'};
`;
const Option = styled.option`
  color: ${(props) => props.active && (!props.isPlaceholder) ? palette('primary', 4) : palette('greyscaleDark', 2)};
  background-color: ${(props) => props.active && (!props.isPlaceholder) ? palette('primary', 0) : palette('primary', 4)};
`;
const Reset = styled(ButtonSimple)`
  padding: 0 0.5em;
  color: ${palette('primary', 0)};
  &:hover {
    color: ${palette('primary', 1)};
  }
`;

export class EntityListGroupBy extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { onChange, value } = this.props;
    const options = value && value !== ''
      ? this.props.options
      : [{
        value: '',
        label: this.context.intl.formatMessage(messages.placeholder),
        default: true,
      }].concat(this.props.options);
    return (
      <Styled>
        { options && options.length > 0 &&
          <span>
            <Label htmlFor="select">
              <FormattedMessage {...messages.groupBy} />
            </Label>
            <Select
              id="select"
              onChange={(event) => onChange(event.target.value === value ? '' : event.target.value)}
              value={value}
              active={value !== ''}
            >
              { options.map((option, i) => (
                <Option
                  key={i}
                  value={option.value}
                  isPlaceholder={option.value === ''}
                  default={option.default}
                  active={option.value === value}
                >
                  {option.label}
                </Option>)
              )}
            </Select>
            { value !== '' &&
              <Reset
                title={this.context.intl.formatMessage(messages.reset)}
                onClick={() => onChange('')}
              >
                <Icon name="removeSmall" text />
              </Reset>
            }
          </span>
        }
      </Styled>
    );
  }
}

EntityListGroupBy.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
};

EntityListGroupBy.defaultProps = {
  value: '',
};

EntityListGroupBy.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListGroupBy;

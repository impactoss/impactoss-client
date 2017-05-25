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
  color: ${palette('dark', 3)};
  padding: 0 0.5em 0 0;
`;
const Select = styled.select`
  font-weight: ${(props) => props.active ? 'bold' : 'normal'};
`;
const Option = styled.option`
  color: ${(props) => props.active && (!props.isPlaceholder) ? palette('primary', 4) : palette('dark', 2)};
  background-color: ${(props) => props.active && (!props.isPlaceholder) ? palette('primary', 0) : palette('primary', 4)};
`;
const Reset = styled(ButtonSimple)`
  padding: 0 0.5em;
  color: ${palette('primary', 0)};
  &:hover {
    color: ${palette('primary', 1)};
  }
  margin-right: 20px;
`;

export class EntityListGroupBy extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { onChange, value, isSubgroup } = this.props;
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
              { !isSubgroup &&
                <FormattedMessage {...messages.groupBy} />
              }
              { isSubgroup &&
                <FormattedMessage {...messages.subgroupBy} />
              }
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
                </Option>
              ))}
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
  isSubgroup: PropTypes.bool,
};

EntityListGroupBy.defaultProps = {
  value: '',
};

EntityListGroupBy.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListGroupBy;

/*
 *
 * EntityListGroup
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash/collection';

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

export class EntityListGroupBy extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { onChange, value, isSubgroup } = this.props;
    const optionActive = find(this.props.options, (option) => option.value === value);
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
            { value === '' &&
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
            }
            { value !== '' &&
              <Reset
                title={this.context.intl.formatMessage(messages.reset)}
                onClick={() => onChange('')}
              >
                {optionActive.label}
                <Icon name="removeSmall" text textRight />
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

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

const NONE = 'OFF';

export class EntityListGroupBy extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { onChange, value, isSubgroup } = this.props;
    const optionActive = find(this.props.options, (option) => option.value === value);
    const options = value && value !== NONE
      ? this.props.options
      : [{
        value: NONE,
        label: this.context.intl.formatMessage(messages.placeholder),
        default: true,
      }].concat(this.props.options);

    return (
      <Styled>
        { this.props.options.length > 0 && options && options.length > 0 &&
          <span>
            <Label htmlFor="select">
              { !isSubgroup &&
                <FormattedMessage {...messages.groupBy} />
              }
              { isSubgroup &&
                <FormattedMessage {...messages.subgroupBy} />
              }
            </Label>
            { (!value || value === NONE) && !optionActive &&
              <Select
                id="select"
                onChange={(event) => onChange(event.target.value === value ? NONE : event.target.value)}
                value={value || NONE}
                active={false}
              >
                { options.map((option, i) => (
                  <Option
                    key={i}
                    value={option.value}
                    isPlaceholder={option.value === NONE}
                    default={option.default}
                    active={option.value === value}
                  >
                    {option.label}
                  </Option>
                ))}
              </Select>
            }
            { value !== NONE && optionActive &&
              <Reset
                title={this.context.intl.formatMessage(messages.reset)}
                onClick={() => onChange(NONE)}
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
  value: NONE,
};

EntityListGroupBy.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListGroupBy;

/*
 *
 * EntityListGroup
 *
 */
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import SelectReset from 'components/SelectReset';
import { PARAMS } from 'containers/App/constants';
import messages from './messages';

const Styled = styled.div`
  display: inline-block;
`;

export class EntityListGroupBy extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { onChange, isSubgroup } = this.props;
    const value = this.props.value || PARAMS.GROUP_RESET;
    const options = value !== PARAMS.GROUP_RESET
      ? this.props.options
      // add placeholder select option if no value set
      : [{
        value: PARAMS.GROUP_RESET,
        label: this.context.intl.formatMessage(messages.placeholder),
        default: true,
      }].concat(this.props.options);

    return (
      <Styled>
        { this.props.options.length > 0 && options && options.length > 0 &&
          <SelectReset
            value={value || PARAMS.GROUP_RESET}
            emptyValue={PARAMS.GROUP_RESET}
            label={this.context.intl.formatMessage(isSubgroup ? messages.subgroupBy : messages.groupBy)}
            index={`group-select-${isSubgroup ? '2' : '1'}`}
            options={options}
            isReset
            onChange={onChange}
          />
        }
      </Styled>
    );
  }
}
// <Select
//   id="select"
//   onChange={(event) => onChange(event.target.value === value ? NONE : event.target.value)}
//   value={value || NONE}
//   active={false}
// >
//   { options.map((option, i) => (
//     <Option
//       key={i}
//       value={option.value}
//       isPlaceholder={option.value === NONE}
//       default={option.default}
//       active={option.value === value}
//     >
//       {option.label}
//     </Option>
//   ))}
// </Select>
// }
// { value !== NONE && optionActive &&
// <Reset
//   title={this.context.intl.formatMessage(messages.reset)}
//   onClick={() => onChange(NONE)}
// >
//   {optionActive.label}
//   <Icon name="removeSmall" text textRight />
// </Reset>
// }
// </span>
// }

EntityListGroupBy.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  isSubgroup: PropTypes.bool,
};

EntityListGroupBy.defaultProps = {
  value: PARAMS.GROUP_RESET,
};

EntityListGroupBy.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListGroupBy;

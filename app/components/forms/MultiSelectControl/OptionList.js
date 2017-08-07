import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { kebabCase } from 'lodash/string';
import { FormattedMessage } from 'react-intl';

import IndeterminateCheckbox from 'components/forms/IndeterminateCheckbox';

import Option from './Option';

import messages from './messages';

const Styled = styled.div`
  display: table;
  width: 100%;
`;

const OptionWrapper = styled.div`
  display: table-row;
  width: 100%;
`;
const CheckboxWrapper = styled.div`
  display: table-cell;
  vertical-align:middle;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1em;
  padding-right: 0.5em;
  width: 10px;
  border-bottom: 1px solid ${palette('light', 1)};
`;
const OptionLabel = styled.label`
  display: table-cell;
  vertical-align:middle;
  cursor: pointer;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 0.5em;
  padding-right: 1em;
  border-bottom: 1px solid ${palette('light', 1)};
`;
const OptionCount = styled.span`
  display: table-cell;
  vertical-align:top;
  color: ${palette('dark', 4)};
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-right: 1em;
  text-align: right;
  border-bottom: 1px solid ${palette('light', 1)};
`;

const NoOptions = styled.div`
  padding: 1em;
  font-style: italic;
`;

const OptionList = (props) => (
  <Styled>
    { props.options && props.options.map((option, i) => {
      const checked = option.get('checked');
      const isIndeterminate = option.get('isIndeterminate');
      const id = `${checked}-${i}-${kebabCase(option.get('value'))}-${kebabCase(option.get('query'))}`;
      return (
        <OptionWrapper key={id}>
          <CheckboxWrapper>
            { isIndeterminate &&
              <IndeterminateCheckbox
                id={id}
                checked={checked}
                onChange={(checkedState) => {
                  props.onCheckboxChange(checkedState, option);
                }}
              />
            }
            { !isIndeterminate &&
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(evt) => {
                  evt.stopPropagation();
                  props.onCheckboxChange(evt.target.checked, option);
                }}
              />
            }
          </CheckboxWrapper>
          <OptionLabel htmlFor={id} >
            <Option
              bold={option.get('labelBold') || checked}
              reference={typeof option.get('reference') !== 'undefined' && option.get('reference') !== null ? option.get('reference').toString() : ''}
              label={option.get('label')}
              isNew={option.get('isNew')}
            />
          </OptionLabel>
          { option.get('showCount') && typeof option.get('count') !== 'undefined' &&
            <OptionCount>
              {option.get('count')}
            </OptionCount>
          }
        </OptionWrapper>
      );
    })}
    { (!props.options || props.options.size === 0) &&
      <NoOptions>
        <FormattedMessage {...messages.empty} />
      </NoOptions>
    }
  </Styled>
);


OptionList.propTypes = {
  options: PropTypes.object,
  // onCheckboxChange: PropTypes.func,
};

export default OptionList;

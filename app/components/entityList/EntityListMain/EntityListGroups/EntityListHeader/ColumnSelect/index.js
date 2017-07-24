import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import IndeterminateCheckbox from 'components/forms/IndeterminateCheckbox';
import SelectReset from 'components/SelectReset';
import ButtonFlatIconOnly from 'components/buttons/ButtonFlatIconOnly';
import Icon from 'components/Icon';

import ColumnHeader from 'components/styled/ColumnHeader';

import messages from './messages';

const SortButton = styled(ButtonFlatIconOnly)`
  padding: 0;
  color: inherit;
`;
const Styled = styled(ColumnHeader)`
  padding: 0.25em 0;
  position: relative;
`;
const CheckboxWrap = styled.div`
  width: 30px;
  padding: 5px;
  display: inline-block;
  text-align: center;
`;
const Checkbox = styled(IndeterminateCheckbox)`
  vertical-align: middle;
`;
const Label = styled.label`
  padding: 5px;
  vertical-align: middle;
`;
const SelectWrapper = styled.div`
  position: absolute;
  right:0;
  bottom:0;
  text-align:right;
  display: block;
`;

const SelectAll = styled.a``;

class ColumnSelect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { isSelect, isSelected, onSelect, width, label, hasSelectAll, onSelectAll, selectAllLabel } = this.props;

    const sortOptions = this.props.sortOptions.map((option) => ({
      value: option.attribute,
      label: this.context.intl.formatMessage(messages.sortAttributes[option.attribute]),
    }));

    const sortOrderOption = this.props.sortOrderOptions.find((option) => this.props.sortOrder === option.value);
    const nextSortOrderOption = sortOrderOption && this.props.sortOrderOptions.find((option) => sortOrderOption.nextValue === option.value);

    return (
      <Styled
        width={width}
      >
        {isSelect &&
          <span>
            <CheckboxWrap>
              <Checkbox
                id="select-all"
                checked={isSelected}
                onChange={onSelect}
              />
            </CheckboxWrap>
            <Label htmlFor="select-all">{label}</Label>
            {hasSelectAll &&
              <SelectAll
                onClick={(e) => {
                  e.preventDefault();
                  onSelectAll();
                }}
                href="/"
              >
                {selectAllLabel}
              </SelectAll>
            }
          </span>
        }
        {!isSelect &&
          <Label>{label}</Label>
        }
        <SelectWrapper>
          <SelectReset
            value={this.props.sortBy}
            label="Sort by"
            index="sortby"
            options={sortOptions}
            isReset={false}
            onChange={this.props.onSortBy}
          />
          {nextSortOrderOption &&
            <SortButton
              onClick={(e) => {
                e.preventDefault();
                this.props.onSortOrder(nextSortOrderOption.value);
              }}
            >
              <Icon name={sortOrderOption.icon} />
            </SortButton>
          }
        </SelectWrapper>
      </Styled>
    );
  }
}

ColumnSelect.propTypes = {
  isSelect: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  sortOptions: PropTypes.array,
  sortOrderOptions: PropTypes.array,
  onSortBy: PropTypes.func,
  onSortOrder: PropTypes.func,
  hasSelectAll: PropTypes.bool,
  label: PropTypes.string,
  selectAllLabel: PropTypes.string,
  width: PropTypes.number,
};
ColumnSelect.defaultProps = {
  label: 'label',
};
ColumnSelect.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ColumnSelect;

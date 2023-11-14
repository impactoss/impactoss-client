import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import IndeterminateCheckbox from 'components/forms/IndeterminateCheckbox';
import SelectReset from 'components/SelectReset';
import ButtonFlatIconOnly from 'components/buttons/ButtonFlatIconOnly';
import Icon from 'components/Icon';

import A from 'components/styled/A';
import ColumnHeader from 'components/styled/ColumnHeader';
import PrintHide from 'components/styled/PrintHide';

import messages from './messages';

const SortButton = styled(ButtonFlatIconOnly)`
  padding: 0;
  color: inherit;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0;
  }
`;
const Styled = styled(ColumnHeader)`
  padding-right: 0;
`;
const LabelWrap = styled.div`
  display: table-cell;
  padding-right: 4px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-left: ${(props) => props.isSelect ? 0 : 7}px;
  }
`;
const CheckboxWrap = styled(PrintHide)`
  display: table-cell;
  text-align: center;
  width: 20px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    width: 40px;
  }
`;
const Checkbox = styled(IndeterminateCheckbox)`
  vertical-align: middle;
`;
const Label = styled.label`
  vertical-align: middle;
`;
const Wrapper = styled.div`
  display: table;
  width: 100%;
`;
const SelectWrapper = styled.div`
  display: table-cell;
  text-align: right;
  padding-right: 2px;
`;

const SelectAll = styled(A)`
  vertical-align: middle;
`;

class ColumnSelect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      isSelect, isSelected, onSelect, width, label, hasSelectAll, onSelectAll, entitiesTotal,
    } = this.props;
    const { intl } = this.context;
    const sortOptions = this.props.sortOptions && this.props.sortOptions.map((option) => ({
      value: option.attribute,
      label: intl.formatMessage(messages.sortAttributes[option.attribute]),
    }));

    const sortOrderOption = this.props.sortOrderOptions.find((option) => this.props.sortOrder === option.value);
    const nextSortOrderOption = sortOrderOption && this.props.sortOrderOptions.find((option) => sortOrderOption.nextValue === option.value);

    return (
      <Styled colWidth={width * 100}>
        <Wrapper>
          {isSelect
            && (
              <CheckboxWrap>
                <Checkbox
                  id="select-all"
                  checked={isSelected}
                  onChange={onSelect}
                />
              </CheckboxWrap>
            )
          }
          {isSelect
            && (
              <LabelWrap isSelect={isSelect}>
                <Label htmlFor="select-all">{label}</Label>
                {hasSelectAll
                && (
                  <SelectAll
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectAll();
                    }}
                    href="/"
                  >
                    <FormattedMessage
                      {...messages.selectAll}
                      values={{ number: entitiesTotal }}
                    />
                  </SelectAll>
                )
                }
              </LabelWrap>
            )
          }
          {!isSelect
            && (
              <LabelWrap>
                <Label>{label}</Label>
              </LabelWrap>
            )
          }
          { sortOptions
            && (
              <SelectWrapper>
                <SelectReset
                  value={this.props.sortBy}
                  index="sortby"
                  options={sortOptions}
                  isReset={false}
                  onChange={this.props.onSortBy}
                />
                {nextSortOrderOption
                && (
                  <SortButton
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.onSortOrder(nextSortOrderOption.value);
                    }}
                  >
                    <Icon name={sortOrderOption.icon} />
                  </SortButton>
                )
                }
              </SelectWrapper>
            )
          }
        </Wrapper>
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
  entitiesTotal: PropTypes.number,
  width: PropTypes.number,
};
ColumnSelect.defaultProps = {
  label: 'label',
};
ColumnSelect.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ColumnSelect;

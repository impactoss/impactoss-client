import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import PrintHide from 'components/styled/PrintHide';
import ScreenReaderOnly from 'components/styled/ScreenReaderOnly';
const Select = styled(PrintHide)`
  display: table-cell;
  width: 20px;
  background-color: ${palette('mainListItem', 1)};
  padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
  padding-bottom: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingBottom}px;
  text-align: center;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-right: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingHorizontal}px;
    padding-left: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingHorizontal}px;
    width: 43px;
  }
`;
const Input = styled.input`
  accent-color: ${palette('checkbox', 0)};
  &:focus-visible {
    outline: 1px solid ${palette('primary', 0)};
  }
`;

const Label = styled.label``;

export default class EntityListItemSelect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    checked: PropTypes.bool,
    onSelect: PropTypes.func,
    selectId: PropTypes.string,
    selectLabel: PropTypes.string,
  };

  render() {
    const {
      checked, onSelect, selectId, selectLabel,
    } = this.props;
    return (
      <Select>
        {selectLabel && (
          <ScreenReaderOnly>
            <Label htmlFor={selectId}>{selectLabel}</Label>
          </ScreenReaderOnly>
        )}
        <Input
          id={selectId}
          type="checkbox"
          checked={checked}
          onChange={(evt) => onSelect(evt.target.checked)}
        />
      </Select>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Select = styled.div`
  display: table-cell;
  width: 20px;
  background-color: ${palette('mainListItem', 1)};
  padding-top: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingTop}px;
  padding-bottom: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingBottom}px;
  text-align: center;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-right: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingHorizontal}px;
    padding-left: ${(props) => props.theme.sizes && props.theme.sizes.mainListItem.paddingHorizontal}px;
    width: 40px;
  }
`;

export default class EntityListItemSelect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    checked: PropTypes.bool,
    onSelect: PropTypes.func,
  }

  render() {
    const { checked, onSelect } = this.props;
    return (
      <Select>
        <input
          type="checkbox"
          checked={checked}
          onChange={(evt) => onSelect(evt.target.checked)}
        />
      </Select>
    );
  }
}

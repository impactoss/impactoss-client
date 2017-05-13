import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Select = styled.div`
  display: table-cell;
  width: 30px;
  background-color: ${palette('primary', 4)};
  padding: 5px;
  text-align: center;
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

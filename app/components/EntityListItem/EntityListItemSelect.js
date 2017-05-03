import React, { PropTypes } from 'react';
import styled from 'styled-components';

import Component from 'components/basic/Component'
import Clear from 'components/basic/Clear'

import EntityListItemMainTop from './EntityListItemMainTop';
import EntityListItemMainTitle from './EntityListItemMainTitle';
import EntityListItemMainBottom from './EntityListItemMainBottom';

const Select = styled.div`
  display: table-cell;
  width: 30px;
  background: #fff;
`;

export default class EntityListItemSelect extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    checked: PropTypes.bool,
    onSelect: PropTypes.func,
  }

  render () {
    const { checked, onSelect } = this.props;
    return (
      <Select>
        <input
          type="checkbox"
          checked={checked}
          onChange={(evt) => onSelect(evt.target.checked)}
        />
      </Select>
    )
  }
}

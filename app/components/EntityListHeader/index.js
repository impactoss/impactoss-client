import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Column from './Column';
import ColumnSelect from './ColumnSelect';
import ColumnExpand from './ColumnExpand';

const Styled = styled.div`
  width:100%;
  background-color: ${palette('greyscaleLight', 1)};
`;
const ColumnNestedWrap = styled.div`
  width:${(props) => props.width * 100}%;
  background-color: ${palette('greyscaleLight', 1)};
  display: inline-block;
`;

class EntityListHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderFirstColumn = (col) => {
    const { isSelected, onSelect } = this.props;
    if (col.isSelect) {
      return (
        <ColumnSelect
          isSelected={isSelected}
          onSelect={onSelect}
          label={col.label}
          width={col.width}
        />
      );
    }
    return (
      <Column width={col.width}>
        {col.label}
      </Column>
    );
  }
  renderColumn = (col, i) => {
    if (col.isExpandable) {
      return (
        <ColumnExpand
          key={i}
          isExpand={col.isExpand}
          onExpand={col.onExpand}
          label={col.label}
          width={col.width}
        />
      );
    }
    return (
      <Column
        key={i}
        width={col.width}
      >
        {col.label}
      </Column>
    );
  }
  render() {
    const { columns } = this.props;
    const firstColumn = columns.shift();
    return (
      <Styled>
        { firstColumn && this.renderFirstColumn(firstColumn) }
        { columns.length > 0 &&
          <ColumnNestedWrap width={1 - firstColumn.width}>
            { columns.map((col, i) => this.renderColumn(col, i)) }
          </ColumnNestedWrap>
        }
      </Styled>
    );
  }
}
EntityListHeader.propTypes = {
  columns: PropTypes.array,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default EntityListHeader;

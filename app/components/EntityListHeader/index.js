import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ColumnSelect from './ColumnSelect';
import ColumnExpand from './ColumnExpand';

const Styled = styled.div`
  width:100%;
  background-color: ${palette('greyscaleLight', 1)};
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  width:${(props) => props.colWidth || 100}%;
  display: inline-block;
  padding: 0.25em 1em;
  border-right: 1px solid ${palette('greyscaleLight', 2)};
  font-size: 0.85em;
  &:last-child {
    border-right: none;
  }
`;

class EntityListHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderColumn = (col, i) => {
    const { isSelected, onSelect } = this.props;
    if (col.isSelect && i === 0) {
      return (
        <ColumnSelect
          key={i}
          isSelected={isSelected}
          onSelect={onSelect}
          label={col.label}
          colWidth={col.width === 'fixed' ? '50%' : null}
        />
      );
    }
    if (!col.isSelect && col.isExpandable) {
      return (
        <ColumnExpand
          key={i}
          isExpand={col.isExpand}
          onExpand={col.onExpand}
          label={col.label}
          colWidth={col.width === 'fixed' ? '150px' : null}
        />
      );
    }
    return (
      <Column key={i} colWidth={col.width}>
        {col.label}
      </Column>
    );
  }
  render() {
    const { columns } = this.props;
    return (
      <Styled>
        { columns.map((col, i) => this.renderColumn(col, i)) }
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

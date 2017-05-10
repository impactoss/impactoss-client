import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled.div`
  width:100%;
  background-color: ${palette('greyscaleLight', 1)};
`;

const Column = styled.div`
  width:${(props) => props.colWidth}%;
  display: inline-block;
  padding: 0.25em 1em;
  border-right: 1px solid ${palette('greyscaleLight', 2)};
  font-size: 0.85em;
  &:last-child {
    border-right: none;
  }
`;

class CategoryListHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { columns } = this.props;
    return (
      <Styled>
        {
          columns.map((col, i) => (
            <Column key={i} colWidth={col.width}>
              {col.header}
            </Column>
          ))
        }
      </Styled>
    );
  }
}
CategoryListHeader.propTypes = {
  columns: PropTypes.array,
};

export default CategoryListHeader;

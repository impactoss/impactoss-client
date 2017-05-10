import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled.button`
  width:100%;
  cursor: pointer;
  text-align: left;
  background-color: ${palette('primary', 4)};
  margin: 0;
  padding: 1em;
  display: block;
  margin-bottom: 2px;
  &:hover {
    color: ${palette('greyscaleDark', 3)};
  }
`;
const Column = styled.div`
  width:${(props) => props.colWidth}%;
  display: inline-block;
  vertical-align: middle;
`;
const BarWrap = styled.div`
  width:100%;
  display: table;
  vertical-align: middle;
`;
const BarWrapInner = styled.div`
  display: table-cell;
  vertical-align: middle;
`;
const Bar = styled.div`
  width:${(props) => props.length}%;
  height: 2em;
  background-color: ${(props) => palette(props.palette, 0)};
  vertical-align: middle;
`;
const Count = styled.div`
  display: table-cell;
  width: 40px;
  padding-right: 1em;
  font-weight: bold;
  text-align: right;
  vertical-align: middle;
  font-size: 1.1em;
  color: ${(props) => palette(props.palette, 0)};
`;
const Title = styled.span`
  font-size: 1.1em;
  padding-bottom: 3px;
  border-bottom: 1px solid;
  line-height: 1.6;
`;

class CategoryListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderColumnContent = (col, category) => {
    switch (col.type) {
      case ('title'):
        return (
          <Title>
            {category.title}
          </Title>
        );
      case ('count'):
        return (
          <BarWrap>
            <Count palette={col.entity}>
              {category.counts[col.countsIndex]}
            </Count>
            <BarWrapInner>
              { category.counts[col.countsIndex] > 0 &&
                <Bar
                  length={(category.counts[col.countsIndex] / col.maxCount) * 100}
                  palette={col.entity}
                />
              }
            </BarWrapInner>
          </BarWrap>
        );
      default:
        return null;
    }
  };
  render() {
    const { category, columns } = this.props;
    return (
      <Styled onClick={() => category.onLink()}>
        {
          columns.map((col, i) => (
            <Column key={i} colWidth={col.width}>
              {this.renderColumnContent(col, category)}
            </Column>
          ))
        }
      </Styled>
    );
  }
}

CategoryListItem.propTypes = {
  category: PropTypes.object,
  columns: PropTypes.array,
};

export default CategoryListItem;

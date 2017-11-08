import React from 'react';
import PropTypes from 'prop-types';
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
    opacity: 0.85;
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
  height: 1.6em;
  background-color: ${(props) => palette(props.palette, props.pIndex || 0)};
  vertical-align: middle;
  display: inline-block;
`;
const Count = styled.div`
  display: table-cell;
  width: 40px;
  font-weight: bold;
  text-align: right;
  vertical-align: middle;
  font-size: 1.1em;
  color: ${(props) => palette(props.palette, 0)};
  padding-right: 5px;
`;
const CountLight = styled(Count)`
  display: inline-block;
  width: auto;
  text-align: left;
  vertical-align: middle;
  padding-right: 0;
  padding-left: 5px;
  color: ${(props) => palette(props.palette, 1)};
`;
const Title = styled.span`
  font-size: 1.1em;
  line-height: 1.6;
`;
const Reference = styled.span`
  padding-right: 0.5em;
  opacity: 0.6;
`;

class CategoryListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  renderColumnContent = (col, category) => {
    const count = category.counts[col.countsIndex];
    switch (col.type) {
      case ('title'):
        return (
          <Title>
            { category.reference &&
              <Reference>{category.reference}</Reference>
            }
            {category.title}
          </Title>
        );
      case ('count'):
        return (count.accepted === null || typeof count.accepted === 'undefined')
        ? (
          <BarWrap>
            <Count palette={col.entity}>
              {count.public}
            </Count>
            <BarWrapInner>
              { count.public > 0 &&
                <Bar
                  length={(count.public / col.maxCount) * 100}
                  palette={col.entity}
                />
              }
            </BarWrapInner>
          </BarWrap>
        )
        : (
          <BarWrap>
            <Count palette={col.entity}>
              {count.accepted}
            </Count>
            <BarWrapInner>
              { count.accepted > 0 &&
                <Bar
                  length={(count.accepted / col.maxCount) * 100}
                  palette={col.entity}
                />
              }
              { count.noted > 0 &&
                <Bar
                  length={(count.noted / col.maxCount) * 100}
                  palette={col.entity}
                  pIndex={1}
                />
              }
              { count.noted > 0 &&
                <CountLight palette={col.entity}>
                  {count.noted}
                </CountLight>
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
